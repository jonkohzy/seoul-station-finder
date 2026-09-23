/* Trip pins are device-local. No account or network service is required. */
function createTripPins(api) {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const storageKey = 'seoul-station-finder.trip.v1';
  const colours = [
    {name:'Red', hex:'#d93035', ink:'#fff'},
    {name:'Orange', hex:'#ed8419', ink:'#142942'},
    {name:'Yellow', hex:'#f2cc28', ink:'#142942'},
    {name:'Green', hex:'#168747', ink:'#fff'},
    {name:'Blue', hex:'#226dd9', ink:'#fff'},
    {name:'Indigo', hex:'#4937a5', ink:'#fff'},
    {name:'Violet', hex:'#923ec5', ink:'#fff'}
  ];
  const byKey = new Map(api.stations.map(s => [s.key,s]));
  const byColour = new Map(colours.map(c => [c.name,c]));
  const pins = new Map();
  let chosen = 'Red', keepInView = true, autoFit = false, fitSelection = false;
  let markerNodes = [], storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved?.version === 1 && Array.isArray(saved.pins)) {
      for (const pin of saved.pins) {
        if (pin && byKey.has(pin.key) && byColour.has(pin.colour)) pins.set(pin.key,pin.colour);
      }
      keepInView = saved.keepInView !== false;
    }
  } catch { storageAvailable = false; }
  const highlights = document.createElementNS(NS,'g');
  highlights.id = 'trip-highlights';
  highlights.setAttribute('pointer-events','none');
  api.svg.insertBefore(highlights,api.overlay);
  const leaders = document.createElementNS(NS,'svg');
  leaders.classList.add('pin-leaders');
  leaders.setAttribute('aria-hidden','true');
  $('saved-map-pins').append(leaders);

  function status() {
    $('save-status').textContent = storageAvailable ? 'Saved in this browser' : 'Pins last for this visit; browser saving is unavailable.';
  }
  function save() {
    try {
      localStorage.setItem(storageKey,JSON.stringify({version:1,keepInView,pins:[...pins].map(([key,colour])=>({key,colour}))}));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    status();
  }
  function selectionChanged(station) {
    if (!station) return;
    if (pins.has(station.key)) chosen = pins.get(station.key);
    $('colour-name').textContent = chosen;
    for (const button of $('pin-colours').children) button.setAttribute('aria-pressed',String(button.dataset.colour === chosen));
    $('toggle-pin').textContent = pins.has(station.key) ? 'Unpin station' : 'Pin station';
    $('toggle-pin').setAttribute('aria-pressed',String(pins.has(station.key)));
    $('map-pin').hidden = pins.has(station.key);
    const selectionRect = api.overlay.querySelector('rect');
    if (selectionRect) {
      const colour = pins.has(station.key) ? byColour.get(pins.get(station.key)).hex : '#155fd1';
      selectionRect.setAttribute('stroke',colour);
      selectionRect.setAttribute('fill',pins.has(station.key) ? colour : '#d9eaff');
      selectionRect.setAttribute('fill-opacity',pins.has(station.key) ? '.2' : '.8');
    }
  }
  for (const colour of colours) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'colour-swatch';
    button.dataset.colour = colour.name;
    button.style.setProperty('--pin-colour',colour.hex);
    button.style.setProperty('--pin-ink',colour.ink);
    button.setAttribute('aria-label',colour.name);
    button.title = colour.name;
    button.setAttribute('aria-pressed',String(chosen === colour.name));
    button.addEventListener('click',()=>{
      chosen = colour.name;
      const selected = api.getSelected();
      if (selected && pins.has(selected.key)) {
        pins.set(selected.key,chosen);save();redraw();
        api.announce(selected.name+' pin changed to '+chosen+'.');
      }
      selectionChanged(selected);
    });
    $('pin-colours').append(button);
  }
  function remove(key) {
    const station = byKey.get(key);
    pins.delete(key);save();redraw();
    if (autoFit && pins.size) refit();
    else if (!pins.size) autoFit = false;
    api.announce(station.name+' unpinned.');
  }
  $('toggle-pin').addEventListener('click',()=>{
    const station = api.getSelected();
    if (!station) return;
    if (pins.has(station.key)) { remove(station.key);return; }
    pins.set(station.key,chosen);save();redraw();
    if (keepInView) { autoFit = true;fitSelection = false;refit(); }
    api.announce(station.name+' pinned in '+chosen+'. '+pins.size+' pinned stations.');
  });
  $('show-pins').addEventListener('click',()=>{
    autoFit = true;fitSelection = false;refit();
    api.announce('Showing all '+pins.size+' pinned stations.');
  });
  $('keep-pins').checked = keepInView;
  $('keep-pins').addEventListener('change',()=>{
    keepInView = $('keep-pins').checked;save();
    if (keepInView && pins.size) { autoFit = true;fitSelection = true;refit(); }
    else autoFit = false;
  });
  function redraw() {
    highlights.replaceChildren();
    $('pinned-list').replaceChildren();
    for (const node of markerNodes) node.button.remove();
    markerNodes = [];
    let number = 0;
    for (const [key,colourName] of pins) {
      number++;
      const station = byKey.get(key), colour = byColour.get(colourName), box = station.box;
      const rect = document.createElementNS(NS,'rect');
      for (const [attr,value] of Object.entries({x:box.x-7,y:box.y-7,width:box.width+14,height:box.height+14,rx:5,fill:colour.hex,'fill-opacity':.16,stroke:colour.hex,'stroke-width':2})) rect.setAttribute(attr,value);
      highlights.append(rect);
      const marker = document.createElement('button');
      marker.type = 'button';marker.className = 'saved-map-pin';marker.textContent = number;
      marker.style.setProperty('--pin-colour',colour.hex);marker.style.setProperty('--pin-ink',colour.ink);
      marker.title = number+'. '+station.name+' · '+colourName;
      marker.setAttribute('aria-label',marker.title);marker.dataset.key = key;
      marker.addEventListener('click',e=>{e.stopPropagation();api.focusStation(station);});
      $('saved-map-pins').append(marker);markerNodes.push({station,button:marker,colour});
      const li = document.createElement('li'), choose = document.createElement('button'), badge = document.createElement('span'), text = document.createElement('span'), name = document.createElement('span'), note = document.createElement('span'), unpin = document.createElement('button');
      choose.type = 'button';choose.className = 'pinned-station';choose.setAttribute('aria-label','Show '+station.name+', '+colourName+' pin');
      badge.className = 'trip-badge';badge.textContent = number;badge.style.background = colour.hex;badge.style.color = colour.ink;
      name.className = 'pinned-name';name.textContent = station.name;note.className = 'pinned-colour';note.textContent = colourName;
      text.append(name,note);choose.append(badge,text);choose.addEventListener('click',()=>api.focusStation(station));
      unpin.type = 'button';unpin.className = 'remove-pin';unpin.textContent = '×';unpin.setAttribute('aria-label','Unpin '+station.name);
      unpin.addEventListener('click',()=>{const next=li.nextElementSibling||li.previousElementSibling;remove(key);const nextName=next?.querySelector('.pinned-name')?.textContent;const nextButton=[...$('pinned-list').querySelectorAll('.pinned-station')].find(b=>b.querySelector('.pinned-name').textContent===nextName);(nextButton||$('keep-pins')).focus();});
      li.append(choose,unpin);$('pinned-list').append(li);
    }
    $('pinned-count').textContent = pins.size;
    $('pins-empty').hidden = pins.size > 0;
    $('show-pins').disabled = pins.size === 0;
    selectionChanged(api.getSelected());api.repaint();
  }
  function positionPins(scale,tx,ty) {
    const placed = [], width = api.viewport.clientWidth, height = api.viewport.clientHeight;
    leaders.replaceChildren();leaders.setAttribute('viewBox',`0 0 ${width} ${height}`);
    for (const {station,button,colour} of markerNodes) {
      const anchor = {x:station.x*scale+tx,y:(station.box.y-12)*scale+ty};
      let x = anchor.x,y = anchor.y;
      // Keep nearby numbered pins distinguishable, tethered to their label.
      for (let attempt=0;attempt<120 && placed.some(p=>Math.hypot(p.x-x,p.y-y)<35);attempt++) {
        const angle=attempt*2.4,radius=22+Math.sqrt(attempt)*12;
        x=anchor.x+Math.cos(angle)*radius;y=anchor.y+Math.sin(angle)*radius;
      }
      button.style.left=x+'px';button.style.top=y+'px';
      const visible=x>=-20&&x<=width+20&&y>=-20&&y<=height+20;
      button.hidden=!visible;
      if (visible) placed.push({x,y});
      if (visible && Math.hypot(x-anchor.x,y-anchor.y)>1) {
        const line=document.createElementNS(NS,'line');
        for(const [attr,value] of Object.entries({x1:anchor.x,y1:anchor.y,x2:x,y2:y,stroke:colour.hex,'stroke-width':2}))line.setAttribute(attr,value);
        leaders.append(line);
      }
    }
  }
  function refit() {
    if (!autoFit || !pins.size) return false;
    const group = [...pins.keys()].map(key=>byKey.get(key));
    if (fitSelection && api.getSelected() && !pins.has(api.getSelected().key)) group.push(api.getSelected());
    const left=Math.min(...group.map(s=>s.box.x)),right=Math.max(...group.map(s=>s.box.x+s.box.width));
    const top=Math.min(...group.map(s=>s.box.y))-35,bottom=Math.max(...group.map(s=>s.box.y+s.box.height));
    const width=api.viewport.clientWidth,height=api.viewport.clientHeight;
    const cardHeight=$('selection-card').hidden?0:$('selection-card').getBoundingClientRect().height;
    const padX=52,padTop=95,padBottom=cardHeight+75;
    const availableW=Math.max(80,width-padX*2),availableH=Math.max(70,height-padTop-padBottom);
    const scale=Math.min(1.65,availableW/Math.max(100,right-left),availableH/Math.max(100,bottom-top));
    api.setView(width/2-(left+right)/2*scale,padTop+availableH/2-(top+bottom)/2*scale,scale);
    return true;
  }
  function fitWithSelection() {
    if (!keepInView || !pins.size) { autoFit=false;return false; }
    autoFit=true;fitSelection=true;return refit();
  }
  status();redraw();autoFit=pins.size>0;
  return {selectionChanged,positionPins,fitWithSelection,refit,stopAutoFit(){autoFit=false;}};
}
