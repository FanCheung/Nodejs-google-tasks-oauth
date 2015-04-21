var router = (require('express')).Router();
var path = require('path');
var Auth = require('../model/Auth');

/**
 * Return the authentication Url from google
 */
router.get('/consent-url', function (req, res) {
        res.json({consentUrl: Auth.getConsentUrl()});
    }
);

/**
 * Callback Url for googleapi
 * set cookie and sent user to task page
 */
router.get('/access-token', function (req, res) {
    Auth.getNewToken(req.query.code)
        .then(function (user) {
            console.log('set cookie');
            //set userId cookie
            res.cookie('userId', user.id, {maxAge: 900000, httpOnly: false});
            res.redirect('/#/tasks');
        })
        .catch(function (err) {
            //redirect to auth page
            res.redirect('/#/auth');
        });
});

module.exports = router;

