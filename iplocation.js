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
	
	var replyMsg = "<head>505 Internal Error</head>";
	do {
		if (urlObj.pathname != "/iplocation") {
			break;
		}
		if (urlObj.query.ip) {
			replyMsg = getGeoInfo(urlObj.query.ip);
			break;
		}
		if (urlObj.query.ips) {
			replyMsg = getGeoInfoBatch(urlObj.query.ips);
			break;
		}
	} while (false);
	
	res.write(replyMsg);
	res.end();
}

function getGeoInfo(ip) {
	var location = IPParser.getIpInfo(ipToInt(ip));
	return JSON.stringify(location);
}

function getGeoInfoBatch(ips) {
	var ipsArr = ips.split(',');
	if (ipsArr.length == 0) {
		return "fail to split ips into array " + ips;
	}
	
	var ret = [];
	var MAX_BATCH_COUNT = 100;
	for (var i in ipsArr) {
		var location = IPParser.getIpInfo(ipToInt(ipsArr[i]));
		ret.push(location);
		if (i > MAX_BATCH_COUNT) break;
	}
	return JSON.stringify(ret);
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