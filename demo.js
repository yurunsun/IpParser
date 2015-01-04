var IpParser=require('./ipparser.js');


var test = function(){
    var ip = 16778240;
    var d = IpParser.getIpInfo(ip);
    console.log('ip info for:%s - %s',ip, JSON.stringify(d));
}
IpParser.init('resources/ips.dat', test);
