var SSE  = require('sse'),
    http = require('http'),
    fs   = require('fs'),
    rf   = require('./static'),
    clients = [],
    echo = '',
//  myip = '192.168.1.103', //set your public ip
    myip = 'localhost',     //or localhost to test in locale
    port = 3000 ;           //set your port number (http://192.168.1.103:8080/)

rf  .setenv('frontend');

var server = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  switch (req.url) {
    case '/': res.end(rf.file());
    case '/favicon.ico': res.end(null);
    default: {
        echo=req.url.slice(1);
        clients.forEach( v => v.send( echo ) );
        res.end(null);
    }
  }
});
 
server.listen(port, myip, () => {
  var sse = new SSE(server);
  sse.on('connection', (client) => {
    clients.push(client);
  });
});