const fs = require('fs');

const rf = {

    hh: `<meta charset='utf-8' />`,

    setenv( s, fn='index' ) {
        fs.readFile( `./static/vue.js`, (err,v) => this.vuejs = v.toString() );
        fs.readFile( `./static/axios.min.js`, (err,v) => this.axiosjs = v.toString() );
        fs.readFile( `./${ s }/${ fn }.vue`, (err,v) => {
            if (v) this.html = v.toString() ;
            else console.error(`No file found: ./${ s }/${ fn }.html`);
        });
    },

    file() {
        return `
            ${ this.hh }
            <script>${ this.axiosjs }</script>
            <script>${ this.vuejs }</script>
            ${ this.html
                    .replace('<template>','')
                    .replace('<div', '<div id="app"')
                    .replace('</template>','')
                    .split('').reverse().join('')
                    .replace(';}', ';)}')
                    .split('').reverse().join('')
                    .replace( 'export default {',"var app = new Vue({ el: '#app'," )
            }`;
    }

};

module.exports = rf;