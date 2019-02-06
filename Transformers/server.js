var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

http.createServer(function (req, res) {

    var pathname = url.parse(req.url).pathname;
    var dataToSend = "";

    console.log("Request Coming Through......", pathname);

    if (pathname == "/") {
        pathname = "/Transformers.html";
        console.log("Home Page: ", pathname)
    }

    if (pathname == "/battle") {

        var response = {};

        if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    req.connection.destroy();
                }
            });
            req.on('end', function () {

                var temp = JSON.parse(body);

                let autobots = temp.autobots;
                let decepticons = temp.decepticons;

                if(autobots.length<=0 || decepticons.length<=0){
                    response.status = -1;
                    response.message = INCORRECTINPUT;
                }

                res.write(response.toString());
                res.end();
            });
        }
    } else {
        fs.open(pathname.substr(1), 'r+', function (err, fd) {

            if (err) {
                console.log(err);
            }
            else {
                fs.readFile(fd, function (err, data) {
                    console.log("Fetch File: ", pathname.substr(1))
                    dataToSend = data.toString();
                    if (pathname.toString().indexOf("css") >= 0) {
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                    }
                    res.write(dataToSend);
                    res.end();
                })
            }
        });
    }
}).listen(8080);

var INCORRECTINPUT="Incorrect input provided,Please provide correct Input";