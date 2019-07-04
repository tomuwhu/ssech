const fs = require('fs');

const rf = {

    hh: `<meta charset='utf-8' /><script src="vue.js"></script><script src="axios.min.js"></script>`,

    setenv( s, fn='index' ) {
        fs.readFile( `./static/vue.js`, (err,v) => {
            this.vuejs = v.toString() ;
        });
        fs.readFile( `./static/axios.min.js`, (err,v) => {
            this.axiosjs = v.toString() ;
        });
        fs.readFile( `./${ s }/${ fn }.html`, (err,v) => {
            if (v)
                this.html = v.toString() ;
            else
                console.error(`No file found: ./${ s }/${ fn }.html`);
        });
        fs.readFile( `./${ s }/${ fn }.css`, (err,v) => {
            if (v)
                this.css = v.toString() ;
            else
                console.error(`No file found: ./${ s }/${ fn }.css`);
        });
        fs.readFile( `./${ s }/${ fn }.js`, (err,v) => {
            if (v)
                this.js = v.toString() ;
            else
                console.error(`No file found: ./${ s }/${ fn }.js\n\n`);
        });
    },

    file() {
        return `${ this.hh }\n${ this.html }\n<style>${ this.css }</style>\n<script>${ this.js }</script>`;
    }

};

module.exports = rf;