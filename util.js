var http = require('http');
var https = require('https');
var iconv = require('iconv-lite');
var htmlToJson = require('html-to-json');
var querystring = require('querystring');

var toUTF8promise =function(res) {
    return new Promise(function(resolve, reject) {

        //process
        var str = [];
        res.on('data', function(chunk) {
            str.push(chunk);
        });

        res.on('end', function() {
            var total = 0;
            for(var i=0;i<str.length;i++) {
                total+=str[i].length;
            }
            var content = Buffer.concat(str,total);
            var utf8st=iconv.decode(content,'win874');
            //cb(utf8st);
            var x =1;
            if(x == 0) reject("Error")
            else resolve(utf8st)
        });
    })
};

var getUTF8 = function(url_path,cb) {
    http.get(url_path , function(res) {
        var str = [];
        res.on('data', function(chunk) {
            str.push(chunk);
        });

        res.on('end', function() {
            var total = 0;
            for(var i=0;i<str.length;i++) {
                total+=str[i].length;
            }
            var content = Buffer.concat(str,total);
            var utf8st=iconv.decode(content,'win874');
            cb(utf8st); //utf8st
        });
    });
};

var toUTF8 = function(res,cb) {
    var str = [];
    res.on('data', function(chunk) {
        str.push(chunk);
    });

    res.on('end', function() {
        var total = 0;
        for(var i=0;i<str.length;i++) {
            total+=str[i].length;
        }
        var content = Buffer.concat(str,total);
        var utf8st=iconv.decode(content,'win874');
        cb(utf8st);
    });
};

exports.callItemData =function(inventory_code,cb) {


    var postData = querystring.stringify({
        'Item_id':inventory_code
    });

    console.log(postData);

    var options = {
        hostname:'inventory.nu.ac.th',
        port: 443,
        path:'/ShowCate1.asp',
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };


    var req = https.request(options, function(res) {
        //console.log("http.request :");
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);


        cb(res);

    }); // var reg

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();

}

exports.test =function(code,cb) {


    var postData = querystring.stringify({
        'Item_id':code
    });

    var options = {
        hostname:'inventory.nu.ac.th',
        port: 443,
        path:'/ShowCate1.asp',
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };



    var req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

        /*res.on('data', (d) => {
            process.stdout.write(d);
        });*/

        toUTF8(res,function(utf8str) {
            console.log("toUTF8 :");
            //console.log(utf8str);

            htmlToJson.parse(utf8str, {
                'output': ['td', function($tr) {
                    //console.log("query_section :"+$tr.text());
                    var tmp = {
                        'text':$tr.text()
                    };
                    return tmp;
                }]
            }, function(err, result) {

                var section_info =[];

                /*for(var i=0;i<result.output.length;i++) {

                    section_info.push();
                }*/


                //console.log("section_info :"+tmpSchedule);
                cb(result);//section_info
            });

        });

    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();

}