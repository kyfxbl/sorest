var path = require("path");
var sep = path.sep;

var Sorest = require("../../../lib/sorest");

var base_dir = path.join(process.cwd(), "test", "dummy") + sep;

var sorest = new Sorest(base_dir);

sorest.init();

console.log(sorest.topo);