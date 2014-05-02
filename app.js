var http = require("http");
var request = require("request");
var prompt = require("prompt");

var port = 1337;
var fanpage="yangyayu0115";
var photourl = "http://graph.facebook.com/"+fanpage+"/photos?type=uploaded";
var loadurl;

var data = '<html><head><meta charset="utf-8"><title>Beauty</title>';
var style='<style type="text/css">#photo{height:100%;} #photo .carousel-inner{height:100%;} #photo .carousel-inner img{height:100%; margin:auto;}</style>';

var i = 0;

prompt.start();

prompt.get(['fanpage'], function (err, result) {
//
// Log the results.
//
fanpage = result.fanpage;
photourl = "http://graph.facebook.com/"+fanpage+"/photos?type=uploaded";

console.log('Set fanpage: ' + fanpage);
console.log("Server started!")

//
// start server
//

http.createServer(function(req,res){


    var query = require('url').parse(req.url,true).query;
    console.log("Request from: " + req.connection.remoteAddress + "\n" + query.fn + "\n");

    if(query.fn){

        fs = require('fs');
        // provide requested css, js, images, while preventing directory traversal
        fs.readFile('tools/'+ query.fn.replace(/\.\./g,""), 'utf8', function (err,a) {
          if (err) {
            res.writeHeader(404, {"Content-Type": "text/html"});
            res.end("404 - Not Found");
            return console.log(err);
          }
          res.end(a);
        });

    }else{
    res.writeHeader(200, {"Content-Type": "text/html"});

    data+='<link rel="stylesheet" href="?fn=bootstrap.min.css">';
    data+='<script type="text/javascript" src="?fn=jquery-1.11.0.min.js"></script>';
    data+='<script src="?fn=bootstrap.min.js"></script>';
    data+='<script>$(document).ready(function(){$(".item:eq(0)").addClass("active");$("#photo").carousel();alert("Loading Complete!");})</script>';
    data+=style;
    data+='</head><body><div id="photo" class="carousel slide" data-ride="carousel"><div class="carousel-inner">';

    loadurl = photourl;
    getphoto(loadurl,res);
    }
        
 }).listen(port);

});



function getphoto(next,res){   	

        request.get(loadurl, function(err,body,result){
        	
            console.log(i+" "+loadurl);
        	i++;
            result = JSON.parse(result);
        	if(result&&result.data){
        		result.data.forEach(function(val,idx){
                data += "<div class='item'><img src='" + val.images[1].source + "'></div>";
            	});
        	}
            
            if(result.paging.next != undefined){

            	loadurl = result.paging.next;
            	getphoto(loadurl,res);		
    			
    			res.write(data);
    			data="";
    		
            }else{
            	console.log(i);
                data+='</div><!-- Controls --><a class="left carousel-control" href="#photo" data-slide="prev"></a><a class="right carousel-control" href="#photo" data-slide="next"></span></a></div></div></body></html>';
            	res.end(data);
            }

        })
}
