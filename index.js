var SSE     = require('sse'),
    http    = require('http'),
  { Svc, 
    serve } = require('singlevue'),
    amoba   = new Svc('amoba'),
    ct      = [],
    port    = 3004,
    base    = '/' ;

var server = http.createServer( (req, res) => {
  if (req.method === 'POST') {
    serve.postparse( req, w => {
      ct.map( v => v.c.send( `${w.x}-${w.y}-${w.f}` ) );
      res.end(JSON.stringify({x: 'ok'}));
    } )
  }
  if (req.method === 'GET') { 
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url===base) res.end( amoba.vue({ title: 'Amőba' }) );
    else if (req.url.replace( base, '' ) === 'clients') {
      res.end( 'Clientlist: ' + ct.map( v => v.ts ).join(', ') );
    }
    else {
      //console.log('Kezeletlen get kérés: ', decodeURI( req.url.replace( base, '' ) ) );
      res.end(null);
    }
  }
});

server.listen(port, '0.0.0.0', () => 
  new SSE(server)
        .on('connection', c => ct.push({c, ts: Number(new Date()) }) )
);

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);
