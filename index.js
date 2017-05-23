var Wherewolf = require('wherewolf');
var us = require('us');

exports.handler = function(event, context, callback) {
    var geojson;
    if(typeof(event.queryStringParameters.state) != 'undefined'){
        var fips = us.lookup(event.queryStringParameters.state).fips;
        geojson = require('./geojson/cb_2016_us_cd115_500k_STATEFP_' + fips + '.json');
    } else {
        geojson = require('./geojson/500k.json');
    }

    var wolf = Wherewolf();
    wolf.add("districts",geojson);
    var boundary = new Promise((resolve,reject) => {
        var response = wolf.find([parseFloat(event.queryStringParameters.lon), parseFloat(event.queryStringParameters.lat)]);
        console.log(response)
        resolve(response);
    });

    return boundary.then((result) => {
        if(result.districts == null){
            return callback(null,'error: error')
        }
        return callback(null, 
                {
                    'statusCode': 200,
                    'headers': { 
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin" : "*"
                     },
                    'body': JSON.stringify(result)
                    
                }
            );
        
    });

};