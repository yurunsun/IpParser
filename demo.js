var IpParser=require('./ipparser.js');


var test = function(){
    var ip = 16813053;
    var d = IpParser.getIpInfo(ip);
    console.log('ip info for:%s - %s',ip, JSON.stringify(d));
}
// IpParser.init('resources/ips.dat', test);
IpParser.init('/etc/voice/IP2LOCATION-LITE-DB11.CSV.cpp.txt', test);
