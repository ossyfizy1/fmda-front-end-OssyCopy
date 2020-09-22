// require request
var request = require("request");

// require baseUrl
var baseUrl = require("../baseUrl");

// bluebird promises
var Promise = require("bluebird");




// object consumeAPIs
var consumeAPIs = {

    api_call : function(queryParam){
        
        var options = {
            url: baseUrl.baseUrl+"graphql",
            headers: {
                'Content-Type': 'application/json'
            },
            body: queryParam,
        };

        // Return new promise 
        return new Promise(function(resolve, reject) {
            // Do async job
            request.post(options, function(err, resp, body) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(body));
                    }
                })
        }) // end of Return new promise 

    },
    // seperate each function by ","

}


module.exports = consumeAPIs;