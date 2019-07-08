var SSE    = require('sse'),
  { Svc, 
    app } = require('singlevue'),
    amoba  = new Svc('amoba'),
    ct     = [],
    base='/u/tnemeth_5/',
    port   = 3005;

app.get( base, (req,res)=> {
  res.send(amoba.vue({title: `Amőba: ${ ct.length + 1 }`}));
});

app.post( base ,(req,res) => {
  ct.map( v => v.c.send( `${req.body.x}-${req.body.y}-${req.body.f}` ) );
  res.sendJSON( {x: ct.length } );
});

app.listen(port, server => 
  new SSE(server)
        .on('connection', c => ct.push({c, ts: Number(new Date()) }) )
);

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);
