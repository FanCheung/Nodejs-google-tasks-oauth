var router = (require('express')).Router();
var path = require('path');
var Auth = require('../model/Auth');
var Task = require('../model/Task');

router.all('/*', function (req, res, next) {
    var userId = req.cookies.userId;
    Auth.authorize(userId)
        .then(function (userId) {
            console.log('pass auth, userId:', userId);
            next();
        })
        .catch(function (err) {
            console.log('route task auth error', err);
            res.status(403).json({error: err});
        });
});

//get all tasks
router.get('/', function (req, res) {
    Task.getAll()
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            console.log('router get tasks error',err);
            res.status(400).json({error: err});

        });
});

//delete task
router.delete('/task/:id', function (req, res) {
    //console.log('delete:',req.params.id);
    Task.delete(req.params.id).then(function (data) {
        res.status(200).json(data);
    })
    .catch(function (err) {
            console.log('router delete task error',err);
            res.status(400).json({error: err});
    });
    //res.send('hello');
});

//add task
router.post('/', function (req, res) {
    Task.add(req.body)
        .then(function (data) {
            res.status(200).json({data: data, message: 'Task Added'});
        })
        .catch(function (err) {
            console.log('router add task error',err);
            res.status(400).json({error: err});
        });
});


module.exports = router;

