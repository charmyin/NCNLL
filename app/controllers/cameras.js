var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('cameras/index', { title: '摄影设备' });
});

module.exports = router;
