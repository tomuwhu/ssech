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
  switch (req.url) {
    case base: res.end(rf.file()); break;
    case base+'vue.js': res.end(rf.vuejs); break;
    case base+'axios.min.js': res.end(rf.axiosjs); break;
    case base+'axios.min.map': res.end(null); break;
    case base+'favicon.ico': res.end(null); break;
    default: {
        ct.forEach( v => {
          v.c.send( req.url.slice(1) )
        });
        res.end(null);
    }
  }
});
 
server.listen(port, myip, () => {
  let sse =new SSE(server);
  sse.on('connection', c => {
    ct.push({c, ts: Number( new Date() ) });
  } );
} );

setInterval( () => {
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) );
}, 1000000 );