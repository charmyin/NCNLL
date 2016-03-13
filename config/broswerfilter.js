var UAParser = require('ua-parser-js');
module.exports = function(req, res, next) {
  var parser = new UAParser();
  var ua = req.headers['user-agent'];
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var browserVersion = fullBrowserVersion.split(".",1).toString();
  var browserVersionNumber = Number(browserVersion);
  //Log to database
  console.log(browserName)
  console.log(fullBrowserVersion)
  console.log(browserVersion)
  console.log(browserVersionNumber)


  if (browserName == 'IE' && browserVersion <= 9)
    res.redirect('/unsupportedbs');
  else if (browserName == 'Firefox' && browserVersion <= 24)
    res.redirect('/unsupportedbs');
  else if (browserName == 'Chrome' && browserVersion <= 40)
    res.redirect('/unsupportedbs');
  else if (browserName == 'Canary' && browserVersion <= 32)
    res.redirect('/unsupportedbs');
  else if (browserName == 'Safari' && browserVersion <= 5)
    res.redirect('/unsupportedbs');
  else if (browserName == 'Opera' && browserVersion <= 16)
    res.redirect('/unsupportedbs');
  else{
     return next();
  }
}