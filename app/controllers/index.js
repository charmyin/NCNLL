var express = require('express');

/* GET home page. */
exports.index =function(req, res) {
    res.render('index', { title: 'ncnll' });
};


/* GET home page. */
exports.indexData = function(req, res) {
    var data = [
    {
      "title": "生产展示",
      "items":[{
        "imgs":['/images/index/1.jpg'],
        "name":"好吃的1",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/3.jpg'],
        "name":"好吃的2",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/2.jpg'],
        "name":"好吃的3",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      }
    ]},
    {
      "title": "分类精选",
      "items":[{
        "imgs":['/images/index/22.jpg'],
        "name":"好吃的4",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/11.jpg'],
        "name":"好吃的5",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/33.jpg'],
        "name":"好吃的6",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      }
    ]},
    {
      "title":"摄影设备",
      "items":[{
        "imgs":['/images/index/44.jpg'],
        "name":"好吃的",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/55.jpg'],
        "name":"好吃的",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/66.jpg'],
        "name":"好吃的",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      }
    ]}
    ];
    res.json(data);
};


/* GET home page. */
exports.userProducts = function(req, res) {
    var data = [{
        "imgs":['/images/index/33.jpg'],
        "name":"好吃的4",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/33.jpg'],
        "name":"好吃的5",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/33.jpg'],
        "name":"好吃的6",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      },{
        "imgs":['/images/index/33.jpg'],
        "name":"好吃的6",
        "from":"Charmyin",
        "fromUrl":"http://www.baidu.com",
        "readTimes":122
      }];
    res.json(data);
};
