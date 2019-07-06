<template>
  <div id="app">
      <h1>{{ template.title }}</h1>
      <table>
          <tr :key="j" v-for="(row,j) in arr">
              <td :key="i" v-for="(e,i) in row" @click="f(i,j)" :class="e" >{{e}}</td>
          </tr>
      </table>
      <hr>
      <div v-if="nyert" v-html="nyert" ></div>
  </div>
</template>

<script>
let next="X", rak=0, base='/', es = new EventSource(base+"sse");
// base='/u/tnemeth_4/'; // inf-en
export default {
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
            axios.post(base, { x: i, y: j, f: next } );
        }
      }
  }
};
</script>

<style>
#app, h1 {
    text-align: center;
}
table {
    margin: 0 auto;
}
td {
    text-shadow: 0 0 2px black;
    user-select: none;
    width: 28px;
    height:28px;
    cursor:pointer;
    border: solid 1px rgb(89, 109, 108);
    text-align:center;
    border-radius:3px;
    background-color: #d7daa7;
    color: snow;
    box-shadow: 0 0 3px black;
}
td.O {
    color: rgb(240, 239, 199);
    background-color: #197596;
}
td.X {
    color: rgb(192, 237, 159);
    background-color: #982907;
}
</style>