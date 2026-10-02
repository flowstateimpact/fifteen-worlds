// taant-nav.js · Taant's chapters and its door. The chapter control itself (chalk tally marks on the loom beam) waits on a
// photograph of a real beam; until then the chapters answer the keyboard (1 to 6, n, b) and the index opens with I.
import {nav} from './lib/nav.js';
const N = nav({drv:'#loom'});
N.on(i => document.body.classList.toggle('at-door', i === N.list.length - 1));
N.door(document.getElementById('door'), {verb:'Throw the shuttle'});
window.__nv = N;
