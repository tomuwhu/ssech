var SSE  = require('sse'),
    http = require('http'),
    svc  = require('singlevue'),
    ct   = [],
    port = 3004,
    base = '/' ;

svc.read_vue('amoba');

var server = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url===base) res.end( svc.vue({ title: 'Amőba' }) );
  else {   
    let w = req.url.slice( 1 );
    if ( w.includes('-') ) ct.map( v => v.c.send( w ) );
    res.end(null);
  }
});

server.listen(port, '0.0.0.0', () => 
  new SSE(server)
        .on('connection', c => ct.push({c, ts: Number(new Date()) }) )
);

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);
