'use strict';

var abbrev = require('abbrev');

function Console(){
    this.store = {};
    this.alias = {};
}

Console.prototype.get = function(name) {
    name = name.toLowerCase();
    return this.store[this.alias[name]];
};

Console.prototype.list = function() {
    return this.store;
};

Console.prototype.register = function(name, desc, options, fn) {

    if(!name){
        throw new TypeError('name is required');
    }

    // resolve parameter
    if (!fn) {
        if (options) {
            if (typeof options === 'function') {
                fn = options;

                if (typeof desc === 'object') { // name, options, fn
                    options = desc;
                    desc = '';
                } else { // name, desc, fn
                    options = {};
                }
            } else {
                throw new TypeError('fn must be a function');
            }
        } else {
            // name, fn
            if (typeof desc === 'function') {
                fn = desc;
                options = {};
                desc = '';
            } else {
                throw new TypeError('fn must be a function');
            }
        }
    }

    var f = this.store[name.toLowerCase()] = fn;
    f.options = options;
    f.desc = desc;

    this.alias = abbrev(Object.keys(this.store));
};

module.exports = Console;