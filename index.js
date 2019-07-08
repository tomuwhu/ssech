var SSE    = require('sse'),
  { Svc, 
    rest } = require('singlevue'),
    amoba  = new Svc('amoba'),
    ct     = [],
    port   = 3004;

rest.get('/', (req,res)=> {
  rest.send(amoba.vue({title: `Amőba: ${ ct.length + 1 }`}));
});

rest.post( '/' ,(req,res) => {
  ct.map( v => v.c.send( `${req.body.x}-${req.body.y}-${req.body.f}` ) );
  rest.sendJSON( {x: 'ok'} );
});

rest.listen(port, server => 
  new SSE(server)
        .on('connection', c => ct.push({c, ts: Number(new Date()) }) )
);

setInterval( () =>  
  ct = ct.filter( v => (Number( new Date() ) - v.ts < 1000000) ), 1000000 
);
