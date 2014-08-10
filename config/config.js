
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/ncnlldb',
    root: rootPath,
    notifier: notifier,
    app: {
      name: '牛逼的例子'
    }

  },
  test: {
    db: 'mongodb://182.254.132.226:27017/ncnlldb',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    }
  },
  production: {
      db: 'mongodb://182.254.132.226:27017/ncnlldb',
      dbUserName:"charmyin",
      dbPassword:"ycm199808",
      root: rootPath,
      notifier: notifier,
      app: {
          name: 'Nodejs Express Mongoose Demo'
      }
  }
};
