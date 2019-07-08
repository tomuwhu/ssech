<template>
  <div id="app">
      <h1 v-html="`${ template.title } (ID: ${ id })`">dd</h1>
      <div class="mini">
        Aktív játékosok száma belépéskor: {{ conn }}
      </div>
      <table>
          <tr :key="j" v-for="(row,j) in arr">
              <td :key="i" v-for="(e,i) in row" @click="f(i,j)" :class="e" >{{e}}</td>
          </tr>
      </table>
      <hr>
      <input value="Ellenfél" disabled>
      <input placeholder="ID" 
             v-model="opponent"
             :disabled="opponent==='-----'" />
      <hr>
      <span v-if="nyert" >
        <div v-html="nyert" ></div>
        <br><br>
        <button v-if="nyert!='Kapcsolat megszakadt!'" @click="uj()">Új játék</button>
        <a href="/" v-else>Új játék</a>
        <br>
      </span>
  </div>
</template>

<script>
//let base='/u/tnemeth_5/'; // inf-en
let base='/';
let next="X", rak=0, es = new EventSource(base+"sse");
function ures() {
  return Array(10).fill(0).map( v => Array(10).fill(' ') );
} 
export default {
  data: {
    arr: ures(),
    nyert: false,
    conn: 0,
    id: 0,
    opponent: ''
  },
  mounted() {
    es.onmessage = e => {
        let [x,y,p,id1,id2]=e.data.split('-') ;
        if (x==='uj') {
          this.arr=ures() ;
          this.nyert='' ;
        } 
        else if (x==='id') {
          this.id=y;
        }
        else {
          if (--rak<0) rak=0;
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
    };
    es.onerror = e => {
      this.nyert="Kapcsolat megszakadt!";
      this.id='-'
      this.opponent='-----'
      es.close() ;
    };
  },
  methods: {
      uj() {
        axios
              .post( base, { x: 'uj', y: 0, f: "!", id1: this.opponent, id2: this.id } );
      },
      f(i,j) {
        if (!this.nyert && this.arr[j][i]===" " && this.opponent!=this.id &&
            rak===0 && this.opponent.length===4 ) {
            rak=2;
            axios
              .post( base, { x: i, y: j, f: next, id1: this.opponent, id2: this.id } )
              .then(resp => this.conn = resp.data.x );
        }
      }
  }
};
</script>

<style>
h1 {
  height: 20px;
}
#app, h1, input {
    text-align: center;
}
button {
    font-size: 17px;
    cursor: pointer;
}
input {
    font-size: 20px;
    width: 75px;
}
.mini{
    font-size: 14px;
    height: 20px;
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