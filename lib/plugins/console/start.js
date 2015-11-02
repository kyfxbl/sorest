'use strict';

var path = require("path");
var fs = require("fs");
var _  = require("underscore");
var express = require("express");
var bodyParser = require('body-parser');
var compression = require('compression');

module.exports = startServer;

function startServer(args){

    var self = this;

    // 必须指定配置文件
    if (!args.f){
        return this._call('help', {_: ['start']});
    }

    // dev mode by default
    var production = _resolveProductionMode(args);
    this.log.info("running in mode: " + (production ? "production" : "dev"));

    var app = express();

    var modules = {};

    _loadAllMetaData();
    _setupGloablMiddlewares();
    _loadModuleMiddlewares();
    _loadModuleRouters();
    _listen();

    function _loadAllMetaData(){

        var applications = self.topo.applications;

        _.each(applications, function(app_dir){
            var meta_filepath = path.join(self.lib_dir, app_dir, "META-INF.json");
            var meta_data = fs.readFileSync(meta_filepath, "UTF-8");
            modules[app_dir] = JSON.parse(meta_data);
        });
    }

    function _setupGloablMiddlewares(){

        app.use(bodyParser.urlencoded({extended: false}));
        app.use(compression());
    }

    function _loadModuleMiddlewares(){

        _.each(modules, function(value, key){

            if(!value.middlewares){
                return;
            }

            var impl = value.middlewares.impl;

            var filepath = impl.substring(0, impl.lastIndexOf(".")).replace(/\./, "/");
            var implFunctionName = impl.substring(impl.lastIndexOf(".") + 1);

            var file = path.join(self.lib_dir, key, "middleware", filepath);

            require(file)[implFunctionName].call(self, app);// middleware_loader中的函数，this指向sorest实例
        });
    }

    function _loadModuleRouters(){

        _.each(modules, function(value, key){

            var services = value.services;

            if(!services){
                return;
            }

            _.each(services, function(service){

                var router_path = service.path;

                if(self.topo.prefix){
                    router_path = "/" + self.topo.prefix + router_path;
                }

                var router_http_method = service.method;
                var router_impl = service.impl;

                var filepath = router_impl.substring(0, router_impl.lastIndexOf(".")).replace(/\./, "/");
                var implFunctionName = router_impl.substring(router_impl.lastIndexOf(".") + 1);

                var file = path.join(self.lib_dir, key, "service", filepath);
                var router = require(file)[implFunctionName];
                app[router_http_method].call(app, router_path, router);// app.get("/to/path", function(req, res, next){});
            });
        });
    }

    function _listen(){

        var port = self.topo.port || 3000;

        app.listen(port, function(){
            self.log.info("server started, listen on port: " + port);
        });
    }
}

function _resolveProductionMode(args){

    var mode = args._.shift();

    if(!mode){
        return false;
    }

    return (mode === "production" || mode === "p");
}