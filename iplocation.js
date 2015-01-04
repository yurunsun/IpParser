/**
 * yurunsun@agoravoice.io
 * 2015-1-4 21:14:18
 */

var http = require('http');
var url = require('url');
var IPParser = require('./ipparser.js');
IPParser.init('/etc/voice/IP2LOCATION-LITE-DB11.CSV.cpp.txt', onInit);

function onInit() {
	var server = http.createServer().listen(8082, "0.0.0.0");
	server.on('request', onRequest);
}

function onRequest(req, res) {
	var urlObj = url.parse(req.url, true);
	console.log("request " + urlObj.href + " from " + req.connection.remoteAddress);
	
	if (urlObj.pathname == "/iplocation") {
		return onIPLocationRequest(urlObj.query, res);
	} 
	res.write("T______T... WTF");
	res.end();
}

function onIPLocationRequest(query, res) {
	var ip = query.ip;
	if (!ip) {
		console.log("incomplete query parameter");
		res.write("T______T... WTF");
		res.end();
		return;
	}
	var intIP = ipToInt(ip);
	var location = IPParser.getIpInfo(intIP);
	res.write(JSON.stringify(location));
	res.end();
}

function ipToInt(ip) {
	var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}

function intToIP(num) {
	var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}