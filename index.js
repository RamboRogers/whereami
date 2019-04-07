
/*

TITLE: WHERE AM I

PURPOSE: This tool is designed to give quick information about current network location and local subnet.

AUTHOR: Matthew Rogers
DATE: 2019-03-17
VERSION: 1.0
EMAIL: matt@matthewrogers.org
LICENSE: GPLv3

*/

var oui = require('oui');
const find = require('local-devices');
var network = require('network');
var colors = require('colors');

//fetch DB for macs
oui.update();

console.log("Where Am I?\n");
console.log(" -- Attempting to Fetch IP Information --")

//Learning about Callback Hell here. Neat!
network.get_public_ip(function(err, ip) {
    console.log(("PublicIP:  " + (err || ip)).green); // should return your public IP address

    network.get_private_ip(function(err, ip) {
      console.log(("PrivateIP: " + (err || ip)).red.bold); // err may be 'No active network interface found'.

             network.get_gateway_ip(function(err, ip) {
                console.log(("GatewayIP: " + (err || ip)).yellow); // err may be 'No active network interface found.'

                console.log("\n -- ARP Scanning --")
                //This is the network scan that returns the objects...

                find().then(devices => {
                  //jsome(devices);
                  var counter = 0;
                  for (var device in devices){
                    counter++;

                    //pad IP for column spacing 15
                    while(devices[device].ip.length < 15){
                      devices[device].ip += " ";
                    }
                    //PAD DNS
                    while(devices[device].name.length < 40){
                      devices[device].name += " ";
                    }

                    //Address problem/missing MAC decode
                    var vendor="UNKNOWN";
                    if(oui(devices[device].mac)){
                        vendor = oui(devices[device].mac).split('\n')[0];
                    }
                   

                    var output = "IP:" + "->" + devices[device].ip + " MAC->" + devices[device].mac + "   DNS->" + devices[device].name + "  VENDOR->" + vendor;

                    if(counter % 2 === 0){
                      console.log(output);
                    } else {
                      console.log(output.cyan);
                    }
                  }
                })
              })
    })
})
