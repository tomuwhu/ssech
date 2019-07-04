var SSE  = require('sse'),
    http = require('http'),
    fs   = require('fs'),
    clients = [],
    echo = '',
    frontend;
fs.readFile( './frontend.html', (err,s) => {
  frontend = s.toString() ;
});
var server = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url==='/')
    res.end(frontend);
  else if (req.url==='/favicon.ico')
    res.end(null);
  else {
    echo=req.url.slice(1);
    clients.forEach( v => v.send( echo ) );
    res.end(null);
  }
});
 
server.listen(8080, 'localhost', () => {
  var sse = new SSE(server);
  sse.on('connection', (client) => {
    clients.push(client);
  });
});