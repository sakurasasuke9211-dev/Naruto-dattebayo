const {randomUUID}=require('node:crypto');
const techniques={
 'Naruto Uzumaki':{name:'Rasengan',range:145,damage:38,cost:30,cooldown:2200,color:'#65cfff'},
 'Sasuke Uchiha':{name:'Chidori',range:190,damage:32,cost:30,cooldown:2400,color:'#b6a8ff'},
 'Sakura Haruno':{name:'Cherry Blossom Impact',range:110,damage:28,heal:22,cost:35,cooldown:3500,color:'#ff9dc8'},
 'Ino Yamanaka':{name:'Mind Transfer',range:220,damage:12,stun:2400,cost:35,cooldown:4500,color:'#d7acff'},
 'Shikamaru Nara':{name:'Shadow Possession',range:180,damage:10,stun:2000,area:true,cost:30,cooldown:4000,color:'#9ca5bd'},
 'Choji Akimichi':{name:'Human Boulder',range:135,damage:30,area:true,cost:35,cooldown:3000,color:'#e5b06b'}
};
function createRoom(){return {players:{},phase:'waiting',winner:null,round:1,effects:[],votes:[]}}
function reset(r){Object.values(r.players).forEach(p=>{p.hp=100;p.chakra=100;p.x=p.team==='Leaf'?170:790;p.y=150+p.slot*150;p.lastAttack=0;p.lastJutsu=0;p.stunnedUntil=0;p.lastMove=Date.now()});r.phase=Object.keys(r.players).length===6?'active':'waiting';r.winner=null;r.votes=[];r.effects=[]}
function addPlayer(r,b){if(r.phase!=='waiting')throw Error('This match has already started');const team=b.team==='Sand'?'Sand':'Leaf';const members=Object.values(r.players).filter(p=>p.team===team);if(members.length>=3)throw Error('That team already has three players');const character=String(b.character||'Naruto Uzumaki').slice(0,32);const allowed=team==='Leaf'?['Naruto Uzumaki','Sasuke Uchiha','Sakura Haruno']:['Ino Yamanaka','Shikamaru Nara','Choji Akimichi'];if(!allowed.includes(character))throw Error('Choose a character from your fixed team');if(members.some(p=>p.character===character))throw Error('Your team already has that character');const id=randomUUID();const slot=[0,1,2].find(n=>!members.some(p=>p.slot===n));r.players[id]={id,name:String(b.name||'Shinobi').slice(0,24),character,team,slot};reset(r);return id}
function opponents(r,p){return Object.values(r.players).filter(q=>q.team!==p.team&&q.hp>0)}
function finish(r){if(r.phase!=='active')return;for(const team of ['Leaf','Sand'])if(!Object.values(r.players).some(p=>p.team===team&&p.hp>0)){r.phase='finished';r.winner=team==='Leaf'?'Sand':'Leaf';break}}
function removePlayer(r,id){const p=r.players[id];if(!p)return;delete r.players[id];if(r.phase==='active'){r.phase='finished';r.winner=p.team==='Leaf'?'Sand':'Leaf'}r.votes=r.votes.filter(x=>x!==id)}
function act(r,p,b,now=Date.now()){
 if(b.type==='rematch'){if(r.phase!=='finished')throw Error('The match is not finished');if(!r.votes.includes(p.id))r.votes.push(p.id);if(r.votes.length===Object.keys(r.players).length){r.round++;reset(r)}return}
 if(!['move','attack','jutsu'].includes(b.type))throw Error('Unknown action');
 if(r.phase!=='active'||p.hp<=0||p.stunnedUntil>now)return;
 if(b.type==='move'){const dx=Number(b.dx),dy=Number(b.dy);if(!Number.isFinite(dx)||!Number.isFinite(dy))throw Error('Invalid movement');const dt=Math.max(0,Math.min((now-p.lastMove)/1000,.1)),n=Math.max(1,Math.hypot(dx,dy));p.lastMove=now;p.x=Math.max(24,Math.min(936,p.x+dx/n*210*dt));p.y=Math.max(24,Math.min(576,p.y+dy/n*210*dt));return}
 const special=b.type==='jutsu',t=techniques[p.character]||{name:'Chakra Burst',range:120,damage:25,cost:30,cooldown:2500,color:'#ffffff'};
 if(now-(special?p.lastJutsu:p.lastAttack)<(special?t.cooldown:400)||special&&p.chakra<t.cost)return;
 if(special){p.lastJutsu=now;p.chakra-=t.cost}else p.lastAttack=now;
 const targets=opponents(r,p).filter(q=>Math.hypot(q.x-p.x,q.y-p.y)<=(special?t.range:65)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
 for(const q of special&&t.area?targets:targets.slice(0,1)){q.hp=Math.max(0,q.hp-(special?t.damage:12));if(special&&t.stun)q.stunnedUntil=now+t.stun}
 if(special&&t.heal)for(const q of Object.values(r.players))if(q.team===p.team&&q.hp>0&&Math.hypot(q.x-p.x,q.y-p.y)<=150)q.hp=Math.min(100,q.hp+t.heal);
 r.effects.push({id:randomUUID(),x:p.x,y:p.y,range:special?t.range:65,color:special?t.color:'#ffffff',label:special?t.name:'Strike',until:now+550});finish(r)
}
function tick(r,now=Date.now()){r.effects=r.effects.filter(e=>e.until>now);if(r.phase==='active')for(const p of Object.values(r.players))if(p.hp>0)p.chakra=Math.min(100,p.chakra+.15);finish(r)}
module.exports={techniques,createRoom,addPlayer,removePlayer,act,tick};
