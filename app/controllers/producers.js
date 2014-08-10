var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('producers/index', { title: '生产展示' });
});

/* GET page date. */
router.get('/data', function(req, res) {

    //res.render('producers/index', { title: '生产展示' });
});


/* GET home page. */
router.get('/single', function(req, res) {
    res.render('producers/producerTemplate', { title: '农户展示' });
});

module.exports = router;
