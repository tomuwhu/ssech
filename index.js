var SSE  = require('sse'),
    http = require('http'),
    rf   = require('./static'),
    ct   = [],
//  myip = '192.168.1.103', //set your public ip
    myip = '0.0.0.0',     //or localhost to test in locale
    port = 3004,            //set your port number (http://192.168.1.103:8080/)
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
        ct.forEach( v => v.send( req.url.slice(1) ) );
        res.end(null);
    }
  }
});
 
server.listen(port, myip, () => 
  (new SSE(server)).on('connection', c => ct.push(c) )
);