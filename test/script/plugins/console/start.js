var path = require("path");
var sep = path.sep;

var Sorest = require("../../../../lib/sorest");

var base_dir = path.join(process.cwd(), "test", "dummy") + sep;
var args = {
    debug: true,
    mode: "dev"
};

var sorest = new Sorest(base_dir, args);

sorest.init();

sorest._call("start", args);