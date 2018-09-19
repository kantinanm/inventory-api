var express = require('express');
var bodyParser = require('body-parser');
var htmlToJson = require('html-to-json');
var http = require('http');
var util = require('./util');
var app = express();
var path = require('path');
var iconv = require('iconv-lite');

app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function(req, res) {
    res.sendFile('public/index.html', { root: __dirname });
});

app.get('/api/item/:code', function (req, res) {
    //for test
    console.log("code:"+req.params.code);
    util.callItemData(req.params.code,function(result) {

        //res.json(result);
        console.log(result);
    });

});

app.get('/test/:code', function (req, res) {
    //for test

    util.test(req.params.code,function(result) {

        res.json(result);
        //console.log(result);
    });

});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});