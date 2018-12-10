let jwt = require('jsonwebtoken');
let config = require('../config');
const redis = require("redis");
const redis_client = redis.createClient();

redis_client.on("error", function (err) {
    console.log("Error " + err);
});

let mockedUsername = 'admin';
let mockedPassword = 'admin';
let mockedId = "122a";

class HandlerGenerator {

    login(req, res) {
        let {username, password} = req.body;
        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                //header chứa 2 thứ: kiểu của token và phương thức mã hóa ví dụ RSA
                let token = jwt.sign({
                        username: username,
                        id: mockedId //payload
                    }, config.secret, { //secretOrPrivateKey
                        expiresIn: '24h' // [options, callback]
                    }
                );
                // return the JWT token for the future API calls
                redis_client.set(mockedId, token, redis.print);
                redis_client.get(mockedId, function (err, replies) {
                    console.log(replies);
                });
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.json({
                success: false,
                message: 'Authentication failed! Please check the request',
                name: req.username
            });
        }
    }

    index(req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }

    logout(req, res) {
        if (redis_client.del(req.decoded.id)) {
            redis_client.get(req.decoded.id, function (err, replies) {
                // reply is null when the key is missing
                console.log(replies);
                redis_client.quit();
            });
            res.json({
                success: true,
                message: 'Logout successfull'
            });
        }
    }

    getUser(req, res) {
        redis_client.get(req.decoded.id, function (err, replies) {
                // reply is null when the key is missing
                console.log(replies);
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: replies
                });
        });
    }
}

module.exports = HandlerGenerator;
