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
      serve.send( res, JSON.stringify({x: 'ok'}));
    } )
  }
  if (req.method === 'GET') { 
    if (req.url===base) serve.send( res, amoba.vue({ title: 'Amőba' }) );
    else if (req.url.replace( base, '' ) === 'clients') {
      serve.send( res, 'Clientlist: ' + ct.map( v => v.ts ).join(', ') )
    }
    else {
      serve.getparse(req, w => console.log('Kezeletlen GET kérés: ', w) );
      serve.send( res );
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
