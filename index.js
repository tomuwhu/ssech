var SSE     = require('sse'),
    http    = require('http'),
  { Svc, 
    rest } = require('singlevue'),
    amoba   = new Svc('amoba'),
    ct      = [],
    port    = 3004,
    base    = '/' ;

var server = http.createServer( (req, res) => {
  if (req.method === 'POST') {
    rest.postparse( req, w => {
      ct.map( v => v.c.send( `${w.x}-${w.y}-${w.f}` ) );
      rest.sendJSON( res, {x: 'ok'} );
    } )
  }
  else if (req.method === 'GET') { 
    if (req.url===base) rest.send( res, amoba.vue({ title: `Amőba: ${ ct.length + 1 }` }) );
    else if (req.url.replace( base, '' ) === 'clients') {
      rest.sendJSON( res, ct.map(v => v.c.req.headers['user-agent'] ) )
    }
    else {
      //rest.getparse(req, w => console.log('Kezeletlen GET kérés: ', w) );
      rest.send( res );
    }
  } else {
    console.log(`Kezeletlen ${ req.method } kérés!`);
    rest.send( res );
  }
});

server.listen(port, '0.0.0.0', () => 
  new SSE(server)
        .on('connection', c => ct.push({c, ts: Number(new Date()) }) )
);

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);
