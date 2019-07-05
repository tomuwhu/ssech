let next="X", rak=0, base='/', es = new EventSource(base+"sse");
// base='/u/tnemeth_4/'; // inf-en
var app = new Vue({
  el: '#app',
  data: {
    arr: Array(10).fill(0).map( v => Array(10).fill(' ') ),
    nyert: false
  },
  mounted() {
    es.onmessage = e => {
        if (--rak<0) rak=0;
        let [x,y,p]=e.data.split('-') ;
        this.$set( this.arr[y],x,p );
        next=p==="X"?"O":"X";
        [[1,1],[1,0],[0,1],[-1,1]]
            .forEach( v => {
                let xp=Number(x), yp=Number(y), maxh=0;
                while (this.arr[yp] && this.arr[yp][xp]===p) {
                  xp+=v[0];
                  yp+=v[1];
                  maxh++;
                }
                xp=Number(x);
                yp=Number(y);
                while (this.arr[yp] && this.arr[yp][xp]===p){
                  xp-=v[0];
                  yp-=v[1];
                  maxh++;
                }
                if ( maxh>5) this.nyert = `Nyert: <b>${ p }</b>`;
            });
    };
    es.onerror = e => {
      this.nyert="Kapcsolat megszakadt!";
      es.close() ;
    };
  },
  methods: {
      f(i,j) {
        if (!this.nyert && this.arr[j][i]===" " && rak===0) {
            rak=2;
            axios.get(base+`${i}-${j}-${next}`);
        }
      }
  }
});