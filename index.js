var SSE  = require('sse'),
    http = require('http'),
    rf   = require('./static'),
    ct   = [],
    myip = '0.0.0.0',
    port = 3004,
    base = '/' ;

rf  .setenv('frontend');

var server = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url===base) res.end( rf.file() );
  else {   
    w = req.url.slice( 1 );
    if ( w.includes('-') ) ct.map( v => v.c.send( w ) );
    res.end(null);
  }
});
 
server.listen(port, myip, () => {
  let sse =new SSE(server);
  sse.on('connection', c => ct.push({c, ts: Number(new Date()) }) );
} );

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);