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
                //7450-010-5429 cutoff



                //section_info.push(tmp);

                if(result.output.length==65){
                    // item in use
                    for(var i=0;i<result.output.length;i++) {

                        var tmp = {
                            'item-code' : result.output[2].text.trim(),
                            'item-type' : result.output[4].text.trim(),
                            'length' : result.output[6].text.trim(),
                            'kind' : result.output[8].text.trim(),
                            'name' : result.output[10].text.trim(),
                            'brand' : result.output[12].text.trim(),
                            'model' : result.output[14].text.trim(),
                            'serial' : result.output[16].text.trim(),
                            'warranty' : result.output[18].text.trim(),
                            'price' : ((result.output[20].text.replace(/\n|\r/g, "")).trim()).replace(/บาท/, ""),
                            'unit' : (result.output[22].text.replace(/\n|\r/g, "")).trim(),
                            'organization' : result.output[26].text.trim(),
                            'room' : result.output[32].text.trim(),
                            'procurement' : [{
                                'method':result.output[34].text.trim(),
                                'source':result.output[36].text.trim(),
                                'year':result.output[38].text.trim().trim(),
                                'docno_withdraw':result.output[40].text.trim(),
                                'owner_withdraw':result.output[42].text.trim(),
                                'contact_no':result.output[44].text.trim(),
                                'contact_date':result.output[46].text.trim(),
                                'received_date':result.output[48].text.trim(),
                                'vender':result.output[50].text.replace(/\n|\r/g, "").trim(),
                                'doc_invoice':result.output[52].text.trim()
                            }],
                            'status' : result.output[54].text.trim(),
                            'appearance' : result.output[56].text.trim(),
                            'holder' : result.output[58].text.trim(),
                            'reference' : result.output[60].text.trim()
                        }


                    }
                    section_info.push(tmp);
                }else if(result.output.length==76){
                    // item discharge

                    for(var i=0;i<result.output.length;i++) {

                        var tmp = {
                            'item-code' : result.output[2+1].text.trim(),
                            'item-type' : result.output[4+1].text.trim(),
                            'length' : result.output[6+1].text.trim(),
                            'kind' : result.output[8+1].text.trim(),
                            'name' : result.output[10+1].text.trim(),
                            'brand' : result.output[12+1].text.trim(),
                            'model' : result.output[14+1].text.trim(),
                            'serial' : result.output[16+1].text.trim(),
                            'warranty' : result.output[18+1].text.trim(),
                            'price' : ((result.output[20+1].text.replace(/\n|\r/g, "")).trim()).replace(/บาท/, ""),
                            'unit' : (result.output[22+1].text.replace(/\n|\r/g, "")).trim(),
                            'organization' : result.output[26+1].text.trim(),
                            'room' : result.output[32+1].text.trim(),
                            'procurement' : [{
                                'method':result.output[34+1].text.trim(),
                                'source':result.output[36+1].text.trim(),
                                'year':result.output[38+1].text.trim().trim(),
                                'docno_withdraw':result.output[40+1].text.trim(),
                                'owner_withdraw':result.output[42+1].text.trim(),
                                'contact_no':result.output[44+1].text.trim(),
                                'contact_date':result.output[46+1].text.trim(),
                                'received_date':result.output[48+1].text.trim(),
                                'vender':result.output[50+1].text.replace(/\n|\r/g, "").trim(),
                                'doc_invoice':result.output[52+1].text.trim()
                            }],
                            'status' : result.output[54+1].text.trim(),
                            'appearance' : result.output[56+1].text.trim(),
                            'holder' : result.output[58+1].text.trim(),
                            'reference' : result.output[60+1].text.trim()
                        }


                    }
                    section_info.push(tmp);
                }

                //cb({'length':result.output.length});

                //console.log("section_info :"+tmpSchedule);
                //cb(result);//section_info
                cb(section_info);
            });

        });

    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();

}