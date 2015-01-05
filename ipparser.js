var createTree = require("functional-red-black-tree")
var fs = require('fs'),
readline = require('readline'),
stream = require('stream');

var ipsTree = undefined;

var init = function(path, callback){
    var instream = fs.createReadStream(path);

    var rl = readline.createInterface({
        input: instream,
        output: null,
        terminal: false
    });

    //Create a tree
    var t1 = createTree();
    var started = new Date().getTime();

    rl.on('line', function(line) {
        if (!line || line.length === 0){
            return;
        }

        var idx = line.indexOf(" ");
        var startIp = Number(line.substring(0,idx));

        var idx2 = line.indexOf(" ", idx+1);
        var endIp = Number(line.substring(idx+1,idx2));
        line = line.substring(idx2+1);
        // var data = {
        //     countrySht: args[2],
        //     province: args[4],
        //     city: args[5]
        // };

        t1 = t1.insert(startIp, line);
        t1 = t1.insert(endIp, line);
    });

    rl.on('close', function(){
        instream.close();
        var elapsed = new Date().getTime() - started;
        console.log('IP data loaded, items:%s elapsed:%sms', t1.length /2, elapsed);
        ipsTree = t1;
        if (callback){
            callback();
        }
    });
}


var getIpInfo = function(ipInt){
    if (!ipsTree){
        console.error('ip data not loaded');
        return null;
    }

    var v1 = ipsTree.ge(ipInt).value;
    var v2 = ipsTree.le(ipInt).value;
    console.log(v1, v2);
    return v1 !== v2 ? null: parseInfo(v1);
}

var parseInfo = function(ipInfo){
    var args = ipInfo.split(" ");
    if (args.length<8){
        console.log("malformed ip info:", ipInfo);
        return null;
    }
    var res = {
        countrySht: args[0],
        country: args[1],
        province: args[2],
        city: args[3],
        long: args[4],
        lat: args[5]
    }
    return res;
};

module.exports.init = init;
module.exports.getIpInfo = getIpInfo;