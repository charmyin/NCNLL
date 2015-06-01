/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
  var keys = Object.keys(errors)
  var errs = []

  // if there is no validation error, just display a generic error
  if (!keys) {
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    errs.push(errors[key].message)
  })

  return errs
}

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.indexof = function (arr, obj) {
  var index = -1; // not found initially
  var keys = Object.keys(obj);
  // filter the collection with the given criterias
  var result = arr.filter(function (doc, idx) {
    // keep a counter of matched key/value pairs
    var matched = 0;

    // loop over criteria
    for (var i = keys.length - 1; i >= 0; i--) {
      if (doc[keys[i]] === obj[keys[i]]) {
        matched++;

        // check if all the criterias are matched
        if (matched === keys.length) {
          index = idx;
          return idx;
        }
      }
    };
  });
  return index;
}

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = function (arr, obj, cb) {
  var index = exports.indexof(arr, obj)
  if (~index && typeof cb === 'function') {
    return cb(undefined, arr[index])
  } else if (~index && !cb) {
    return arr[index]
  } else if (!~index && typeof cb === 'function') {
    return cb('not found')
  }
  // else undefined is returned
}

/**
*  Get user info in session, exclude sensitive info
**/
exports.trimSensitiveUserInfo = function(user){
   user.authToken="";
   user.salt="";
   user.hashed_password="";
   user.provider="";
   return user;
}

exports.cloneObject = function(target) {
        var buf;
        if (target instanceof Object){
            buf = {};  //创建一个空对象
            for (var k in target) {  //为这个对象添加新的属性
                buf[k] = target[k];
            }
            return buf;
        }else{
            return target;
        }
};






/***************************************WEB UTILS********************************************/
/**
*
*请求的参数格式：search_eq_amount, search_gt_date
*
**/
exports.setCriteriaParam = function(requestBody){
  var criteria = {};
    for(var prop in requestBody){
      //过滤空值
      if(!requestBody[prop]){
         continue;
      }
      if(prop.indexOf("search_")===0){
        //search_eq_amount
        var expreStr= prop.substring(7,prop.length);//eq_amount
        var operator = expreStr.substring(0,expreStr.indexOf('_'));
        var field = expreStr.substring(expreStr.indexOf('_')+1,expreStr.length);
        criteria[field]={};
        if(operator=="eq"){
          criteria[field] = requestBody[prop];
          continue;
        }
        criteria[field]['$'+operator]=requestBody[prop];
      }
    }

  return criteria;
};

/**
*
*请求的参数格式：order_desc_amount, order_asc_date
*
**/
exports.setSortParam = function(requestBody){
  var sortObj = {};
    for(var prop in requestBody){
      if(prop.indexOf("order_")===0){
        //search_eq_amount
        var expreStr= prop.substring(6,prop.length);//eq_amount
        var sortOrder = expreStr.substring(0,expreStr.indexOf('_'));
        var field = expreStr.substring(expreStr.indexOf('_')+1,expreStr.length);
        sortObj[field]= sortOrder;
      }
    }
  return sortObj;
};

/***Generate save or update response***/
exports.setSaveResponse = function(err, res, obj){
  if (err) {
      res.json({
          "success": false,
          "error":err,
          "msg": "保存过程中出错!"
      });
  } else {
      res.json({
          "success": true,
          "object":obj,
          "_id": obj._id
      });
  }
};
/***Generate delete response***/
exports.setDeleteResponse = function(err, res){
  if(err){
      res.json({
        "success":false,
        "error":err,
        "msg":"删除失败!"});
    }else{
        res.json({success:true});
    }
};
/***Generate query response***/
exports.setQueryListResponse = function(errs, req, res, result, count){
   if(errs){
        res.json({
          "success":false,
          "error":errs,
          "msg":"查询过程中出错！"
        });
      }else{
        res.json({"success":true,
                "total":count,
                "rowsCount":req.body.rows,
                "page":req.body.page,
                "rows":result});
      }

};
