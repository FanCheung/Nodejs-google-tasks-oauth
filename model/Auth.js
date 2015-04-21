var fs = require('fs');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var path = require('path');
var config=require('../config');
var http = require('http');

/**
 * Create an OAuth2 client with the given credentials
 */
var oauth2Client = new OAuth2(config.CLIENT_ID, config.CLIENT_SECRET,config.CALLBACK_URL);
google.options({auth: oauth2Client}); // set auth as a global default

Auth={};
/**
 * Generate a url that asks permissions for google calendar
 * @returns {string}
 * @returns {string}
 */
Auth.getConsentUrl = function () {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
        scope: config.SCOPE // If you only need one scope you can pass it as string
    });
};

/**
 * Authorize user by checking if there are existing token file stored then add it to googles credential
 * if it doesn't exist reject promise which will trigger frontend redirect to auth page
 * @param userId
 * @returns {promise} resolve to userId to save as cookie
 */
Auth.authorize = function (userId) {
    // Check if we have previously stored a token.
    return Q.Promise(function (resolve, reject) {
        if (!userId)
            return reject('userId not found');
        var tokenJson = config.TOKEN_DIR + '/' + userId + '.json';
        fs.readFile(tokenJson, function (err, token) {
            if (err) {
                return reject({message: 'Cannot Read file'});
            } else {
                try {
                    var tokenObj = JSON.parse(token);
                } catch (error) {
                    return reject({message: 'Json parse file Fail'});
                }
                oauth2Client.credentials = tokenObj;
                return resolve(userId);
            }
        });
    });
};


/**
 * Get a new token from googleapi then store it in /token folder
 * @param code The authenticated code return from google to generate a access token
 * @returns {promise} resolve to storeToken promise
 */
Auth.getNewToken = function (code) {
    return Q.Promise(function (resolve, reject) {
        oauth2Client.getToken(code, function (err, token) {
            oauth2Client.credentials = token;
            if (err) {
                reject({message: 'Get Token Error'});
            }
            oauth2Client.credentials = token;
                resolve(Auth.storeToken(token));
        });
    });
};

/**
 * Store token to disk be used in later program executions
 * Fetch the userinfo and use userId as filename to store it in /token folder
 * return {promise} resolve to userId to save as cookie
 */
Auth.storeToken = function (token) {
    return Q.Promise(function (resolve, reject) {
        (require('https')).get(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token.access_token
            , function (res) {
                var res_data = '';
                res.on('data', function (chunk) {
                    res_data += chunk;
                });
                res.on('end', function (data) {
                    //do a try catch here
                    user = JSON.parse(res_data);
                    fs.writeFile(config.TOKEN_DIR + '/' + user.id + '.json', JSON.stringify(token), function (err) {
                        if (err) return reject({message: 'Json write file Fail'});
                    });
                     resolve(user);
                });
            });
    });
};
module.exports = Auth;
