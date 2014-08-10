var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('category/index', { title: '分类' });
});

/* GET home page. */
router.get('/single', function(req, res) {
    res.render('category/categoryTemplate', { title: '植物摄影' });
});

module.exports = router;
