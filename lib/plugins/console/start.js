'use strict';

var express = require("express");

module.exports = startServer;

function startServer(args){

    var self = this;

    var app = express();

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    var server = app.listen(3000, function(){

        var host = server.address().address;
        var port = server.address().port;

        self.log.info("Example app listening at http://%s:%s", host, port);
    });
}