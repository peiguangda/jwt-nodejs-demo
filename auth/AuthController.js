let jwt = require('jsonwebtoken');
const config = require('../config.js');
const redis = require("redis");
const redis_client = redis.createClient({host: 'redis'});

redis_client.on('connect', function() {
    console.log('Redis client connected');
});

redis_client.on("error", function (err) {
    console.log("Error " + err);
});

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                redis_client.get(decoded.id, function (err, reply) {
                    // reply is null when the key is missing
                    // console.log(reply);
                    if (reply === token) {
                        req.decoded = decoded;
                        next(); //sau khi next thi req lai dc truyen qua cho ben file index or logout
                    } else {
                        return res.json({
                            success: false,
                            message: 'Auth token is not supplied'
                        });
                    }
                });
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Auth token is not supplied'
                    });
                }
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = checkToken;
