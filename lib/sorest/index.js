'use strict';

var tildify = require('tildify');
var chalk = require('chalk');
var pkg = require('../../package.json');
var createLogger = require('./create_logger');
var extend = require('../extend');
var pathFn = require('path');
var sep = pathFn.sep;

module.exports = Sorest;

function Sorest(base, args){

    base = base || process.cwd();
    args = args || {};

    this.base_dir = base + sep;
    this.conf_dir = pathFn.join(base, 'conf') + sep;
    this.lib_dir = pathFn.join(base, 'lib') + sep;
    this.webapps_dir = pathFn.join(base, 'webapps') + sep;

    this.env = {
        args: args,
        debug: Boolean(args.debug),
        silent: Boolean(args.silent),
        env: args.mode,
        version: pkg.version,
        init: false
    };

    this.extend = {
        console: new extend.Console()
    };

    this.log = createLogger(this.env);
}

Sorest.prototype.init = function(){

    this.log.debug('Sorest version: %s', chalk.magenta(this.version));
    this.log.debug('Working directory: %s', chalk.magenta(tildify(this.base_dir)));

    // Load internal plugins
    require('../plugins/console')(this);

    // Load config
    require("./load_config")(this);
};

Sorest.prototype._call = function(name, args){

    var c = this.extend.console.get(name);

    if(!c){
        this.log.error("Console \'" + name + "\' has not been registerd yet!");
        return;
    }

    c.call(this, args);
};


