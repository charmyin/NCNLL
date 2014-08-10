var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('photographers/index', { title: '分类' });
});

/* GET home page. */
router.get('/single', function(req, res) {
    res.render('photographers/photographersTemplate', { title: '摄影师' });
});

module.exports = router;
