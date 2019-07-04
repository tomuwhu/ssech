let next="X", rak=0, es = new EventSource("/sse");
var app = new Vue({
  el: '#app',
  data: {
    arr: Array(15).fill(0).map( v => Array(15).fill(' ') ),
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
                let xp=Number(x), yp=Number(y), maxh=0
                while (this.arr[yp] && this.arr[yp][xp]===p) 
                    xp+=v[0], yp+=v[1], maxh++;
                xp=Number(x), yp=Number(y)
                while (this.arr[yp] && this.arr[yp][xp]===p) 
                    xp-=v[0], yp-=v[1], maxh++;
                maxh>5 ? this.nyert = p : null
            });
    };
  },
  methods: {
      f(i,j) {
        if (!this.nyert && this.arr[j][i]===" " && rak===0) {
            rak=2;
            axios.get(`/${i}-${j}-${next}`)
        }
      }
  }
});