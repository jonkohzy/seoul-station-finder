/* No dependencies; shared by the website and its search checks. */
(function(root){
  'use strict';
  const aliases={
    'Hongik Univ.':['hongdae','hongik university','hongdae ipgu'],
    'Seoul Station':['seoul'], 'Myeong-dong':['myeongdong','myongdong'],
    'Gangnam':['kangnam'],
    'Dongdaemun History & Culture Park':['ddp','dongdaemun history culture park','dongdaemun stadium'],
    'Gimpo Int\'l Airport':['gimpo airport','gmp'],
    'Incheon Int\'l Airport Terminal 1':['incheon airport','icn','incheon airport t1','terminal 1'],
    'Incheon Int\'l Airport Terminal 2':['incheon airport','icn','incheon airport t2','terminal 2'],
    'Express Bus Terminal':['gosok terminal'], 'Seoul Nat\'l Univ.':['snu','seoul national university'],
    'Seoul Nat\'l Univ. of Education':['gyodae','seoul national university of education'],
    'Konkuk Univ.':['konkuk university','kondae'], 'Ewha Womans Univ.':['ewha','ewha university','ewha womans university'],
    'Chongshin Univ. (Isu)':['isu','chongshin university'], 'Gyeongbokgung':['gyeongbok palace'],
    'Samseong':['coex'], 'Jamsil':['lotte world'], 'Jayang':['ttukseom park'], 'Buramsan':['danggogae']
  };
  function normalize(s){return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\([^)]*\)/g,'').replace(/\bstation\b/g,'').replace(/\buniversity\b/g,'univ').replace(/\bnational\b/g,'natl').replace(/\binternational\b/g,'intl').replace(/[^a-z0-9]/g,'');}
  function distance(a,b){const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=0;i<=a.length;i++)d[i][0]=i;for(let j=0;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]!==b[j-1]));if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);}return d[a.length][b.length];}
  function terms(name){return [name,name.replace(/\(([^)]*)\)/g,'$1'),...(aliases[name]||[])].map(normalize).filter(Boolean);}
  function rank(query,stations){const q=normalize(query);if(!q)return [];return stations.map(station=>{let score=Infinity;for(const term of station.terms||terms(station.name)){if(term===q)score=Math.min(score,0);else if(term.startsWith(q))score=Math.min(score,10+(term.length-q.length)/100);else if(term.includes(q))score=Math.min(score,20+term.indexOf(q)/100);else if(q.length>=3){const tolerance=q.length<5?1:q.length<9?2:3;const d=distance(q,term);const p=distance(q,term.slice(0,q.length));if(d<=tolerance)score=Math.min(score,30+d);else if(q.length>=5&&p<=Math.min(2,tolerance))score=Math.min(score,40+p+(term.length-q.length)/100);}}return {station,score};}).filter(r=>Number.isFinite(r.score)).sort((a,b)=>a.score-b.score||a.station.name.localeCompare(b.station.name));}
  root.StationSearch={normalize,distance,terms,rank};
  if(typeof module!=='undefined')module.exports=root.StationSearch;
})(typeof window!=='undefined'?window:globalThis);
