'use strict';

var path = require("path");
var fs = require("fs");

module.exports = loadConfiguration;

function loadConfiguration(ctx){

    var conf_filepath = path.join(ctx.conf_dir, "topo.json");
    var data = fs.readFileSync(conf_filepath, "UTF-8");
    ctx.topo = JSON.parse(data);
}