var createTree = require("functional-red-black-tree")
var fs = require('fs'),
readline = require('readline'),
stream = require('stream');

var ipsTree = undefined;

var init = function(path, callback){
    var instream = fs.createReadStream(path);
    var outstream = new stream;
    outstream.readable = true;
    outstream.writable = true;

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

        var args = line.split(" ");
        if (args.length !== 10){
            console.log("malformed ip data:", line);
        };

        var data = {
            startIp: Number(args[0]),
            endIp: Number(args[1]),
            countrySht: args[2],
            country: args[3],
            province: args[4],
            city: args[5],
            long: Number(args[6]),
            lat: Number(args[7])
        }
        t1 = t1.insert(data.startIp, data);
        t1 = t1.insert(data.endIp, data);
    });

    rl.on('close', function(){
        var elapsed = new Date().getTime() - started;
        console.log('IP data loaded, items:%s elapsed:%sms', t1.length, elapsed);
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
    return v1 !== v2 ? null: v1;
}

module.exports.init = init;
module.exports.getIpInfo = getIpInfo;
