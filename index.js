var SSE  = require('sse'),
    http = require('http'),
    fs   = require('fs'),
    clients = [],
    counter = 0,
    frontend;

fs.readFile( './frontend.html', (err,s) => {
    frontend = s.toString() ;
});

setInterval( () => {
    clients.forEach( v => v.send('X-'+counter++) );
}, 5000);

var server = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(frontend);
});
 
server.listen(8080, 'localhost', () => {
  var sse = new SSE(server);
  sse.on('connection', (client) => {
    clients.push(client);
    client.send('hi there!');
  });
});