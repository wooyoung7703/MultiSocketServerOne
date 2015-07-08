/**
 * New node file
 */
var http = require('http'); 
var fs = require('fs');
var ip2 = "192.168.0.3";

exports.server_ip = function (){
	return ip2;
};

exports.server = function (){
	var returnvalue = http.createServer(function(request,response){
	    // HTML 파일을 로딩
		var filePath = request.url;
		if (filePath == '/')
		  filePath = '/index.html';
		filePath = __dirname+filePath;
		
		var path = filePath.split('?');
		log.debug(path[0]);
	    if(filePath.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'
		    fs.readFile(path[0], function(error, data){
		        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
		        response.write(data);
		        response.end();
		    });
	    }
	    if(filePath.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
		    fs.readFile(path[0], function(error, data){
		        response.writeHead(200, {'Content-Type':'text/javascript'});
		        response.write(data);
		        response.end();
		    });
	    }
	    if(filePath.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'
		    fs.readFile(path[0], function(error, data){
		        response.writeHead(200, {'Content-Type':'text/css'});
		        response.write(data);
		        response.end();
		    });
	    }
	    if(filePath.indexOf('.jpg') != -1 || filePath.indexOf('.png') != -1){ //req.url has the pathname, check if it conatins '.css'
		    fs.readFile(path[0], function(error, data){
		        response.writeHead(200, {'Content-Type':'image'});
		        response.write(data);
		        response.end();
		    });
	    }
	    
	    }).listen(3000,ip2, function(){
//	    console.log('Server running at http:/127.0.0.1:52273');
		  var host = returnvalue.address().address;
		  var port = returnvalue.address().port;

		  console.log('Example app listening at http://%s:%s', host, port);
	})
	return returnvalue;
};

exports.createGenerateUUID = function (){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

