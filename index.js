var SSE  = require('sse'),
    http = require('http'),
    svc  = require('singlevue'),
  { parse } = require('querystring'),
    ct   = [],
    port = 3004,
    base = '/' ;

svc.read_vue('amoba');

var server = http.createServer( (req, res) => {
  if (req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let w = JSON.parse ( Object.keys( parse(body) )[0] );
        //console.log( w );
        ct.map( v => v.c.send( `${w.x}-${w.y}-${w.f}` ) );
        res.end(JSON.stringify({x: 'ok'}));
    });
  }
  if (req.method === 'GET') { 
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url===base) res.end( svc.vue({ title: 'Amőba' }) );
    else if (req.url.replace( base, '' ) === 'clients') {
      res.end( 'Clientlist: ' + ct.map( v => v.ts ).join(', ') );
    }
    else {
      //console.log('Kezeletlen get kérés: ', decodeURI( req.url.replace( base, '' ) ) );
      res.end(null);
    }
  }
  else res.end(null);
});

server.listen(port, '0.0.0.0', () => 
  new SSE(server)
        .on('connection', c => ct.push({c, ts: Number(new Date()) }) )
);

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);
