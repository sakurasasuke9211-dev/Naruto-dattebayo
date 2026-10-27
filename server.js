const http=require('node:http');
const fs=require('node:fs');
const game=require('./game');
const rooms=new Map();
const codeFor=value=>String(value||'LEAF').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,12)||'LEAF';
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data))}
function snapshot(r){return {...r,clients:undefined}}
const server=http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(req.method==='GET'&&u.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html'});return res.end(fs.readFileSync(__dirname+'/index.html'))}
 if(req.method==='GET'&&u.pathname==='/events'){
  const code=codeFor(u.searchParams.get('room')),r=rooms.get(code),id=u.searchParams.get('id');
  if(!r?.players[id])return send(res,404,{error:'Join a room first'});
  if(r.clients.has(id))return send(res,409,{error:'Player already connected'});
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write('data: '+JSON.stringify(snapshot(r))+'\n\n');r.clients.set(id,res);
  req.on('close',()=>{r.clients.delete(id);game.removePlayer(r,id);if(!Object.keys(r.players).length)rooms.delete(code)});return
 }
 if(req.method==='POST')try{
  let raw='';for await(const c of req){raw+=c;if(raw.length>4096)return send(res,413,{error:'Request too large'})}
  const b=JSON.parse(raw);if(!b||typeof b!=='object')throw Error('Invalid request');const code=codeFor(b.room);
  if(u.pathname==='/join'){if(!rooms.has(code))rooms.set(code,{...game.createRoom(),clients:new Map()});const r=rooms.get(code),id=game.addPlayer(r,b);return send(res,200,{id,room:code})}
  if(u.pathname==='/action'){const r=rooms.get(code),p=r?.players[b.id];if(!p)return send(res,404,{error:'Player not found'});game.act(r,p,b);return send(res,200,{ok:true})}
 }catch(e){return send(res,400,{error:e.message})}
 send(res,404,{error:'Not found'})
});
setInterval(()=>{for(const r of rooms.values()){game.tick(r);const data='data: '+JSON.stringify(snapshot(r))+'\n\n';for(const c of r.clients.values())c.write(data)}},50).unref();
if(require.main===module)server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Shinobi Missions listening on port '+(process.env.PORT||3000)));
module.exports=server;
