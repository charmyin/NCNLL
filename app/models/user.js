/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * User Schema
 username,email,userrole,phonenumber,birthday,introduction,website,address
 */

var UserSchema = new Schema({
  /*  name: { type: String, default: '' },*/
  username: { type: String, default: '' },
  email: { type: String, default: '' },
  //producer, comsumer, manager
  userrole:{type:Number},
  //浏览次数
  browseCount:{type:Number, defalult:0},
  //电话号码
  phonenumber: { type: String, default: '' },
  //生日
  birthday:{ type: String, default: '' },
  //介绍
  introduction: { type: String, default: '' },
  website: { type: String, default: '' },
  //地址
  address : { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  //用户头像地址
  userPhotoID:{type:String}
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

/*UserSchema.path('name').validate(function (name) {
  if (this.doesNotRequireValidation()) return true
  return name.length
}, 'Name cannot be blank')*/

UserSchema.path('email').validate(function (email) {

  return email.length;
}, '邮箱地址不能为空');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, '该邮箱已经被注册！');

UserSchema.path('username').validate(function (username) {

  return username.length;
}, '用户名不能为空！');

UserSchema.path('hashed_password').validate(function (hashed_password) {

  return hashed_password.length;
}, '密码不能为空！');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password))
    next(new Error('密码无效！'));
  else
    next();
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred
    } catch (err) {
      return ''
    }
  },

};

UserSchema.statics = {
  /**
  *更新用户信息
  *sessionUser: req中的user
  **/
  updateUserInfo: function(userUpdate, sessionUser, callback){
    this.findOne({ email: sessionUser.email }, function (err, user) {
      if (err){
        res.json({success:false, message:err});
        return;
      }
      //Update fields
      user.username=userUpdate.username;
      user.userrole=userUpdate.userrole;
      user.phonenumber=userUpdate.phonenumber;
      user.birthday=userUpdate.birthday;
      user.introduction=userUpdate.introduction;
      user.website=userUpdate.website;
      user.address =userUpdate.address;
      user.save(callback);
    });
  }
};

mongoose.model('User', UserSchema);
