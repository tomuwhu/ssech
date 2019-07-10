var SSE     = require('sse'),
  { Svc, 
    app }   = require('singlevue'),
    amoba   = new Svc('amoba'),
    reversi = new Svc('reversi'),
    main    = new Svc(),
    ct      = [],
    port    = 3005;

app.get( '/amoba/' , (req,res)=> {
  res.send(amoba.vue({ title: `Amőba` } ) ) ;
});

app.get( '/' , (req,res)=> {
  res.send(main.vue({})) ;
});

app.get( '/reversi/' , (req,res)=> {
  res.send(reversi.vue({ title: `Reversi` } ) ) ;
});

app.post( '/' ,(req,res) => {
  ct.map( (v,i) => {
    if ( v.id == req.body.id1 ||  
         v.id == req.body.id2 )
      v.c.send( `${
        req.body.x
      }-${
        req.body.y
      }-${
        req.body.f
      }-${
        req.body.id1
      }-${
        req.body.id2
      }` )
  });
  res.sendJSON( {x: ct.length } );
});

app.listen(port, server => {
  console.log('server is runnning on http://localhost:'+port);
  new SSE(server)
        .on('connection', c => {
          let cs = {
            c, 
            ts: Number(new Date()), 
            id: Math.round(Math.random()*8999)+1000 
          }
          ct.push(cs); 
          c.send('id-'+cs.id.toString());
        } )
});

setInterval( () =>  
  ct = ct.filter( v => 
    (Number( new Date() ) - v.ts < 1000000) 
  ), 1000000 
);
