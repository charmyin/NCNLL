process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var flow = require('../../lib/flow-node.js')('tmp');




// Handle uploads through Flow.js
exports.uploadPostedFile = function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {
        console.log('------POST', status, original_filename, identifier);
        res.send(200, {
          success:true
            // NOTE: Uncomment this funciton to enable cross-domain request.
            //'Access-Control-Allow-Origin': '*'
        });
    });
};


// Handle uploads through Flow.js
/*app.post('/upload', multipartMiddleware, function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {
        console.log('POST', status, original_filename, identifier);
        res.send(200, {
            // NOTE: Uncomment this funciton to enable cross-domain request.
            //'Access-Control-Allow-Origin': '*'
        });
    });
});*/

// Handle cross-domain requests
// NOTE: Uncomment this funciton to enable cross-domain request.
/*
  app.options('/upload', function(req, res){
  console.log('OPTIONS');
  res.send(true, {
  'Access-Control-Allow-Origin': '*'
  }, 200);
  });
*/

// Handle cross-domain requests
exports.uploadGetStatus = function(req, res) {
    flow.get(req, function(status, filename, original_filename, identifier) {
        console.log('GET', status);
        res.send(200, (status == 'found' ? 200 : 404));
    });
};

// Handle status checks on chunks through Flow.js
exports.downloadFile = function(req, res) {
   flow.write(req.params.identifier, res);
};

/*// Handle status checks on chunks through Flow.js
app.get('/upload', function(req, res) {
    flow.get(req, function(status, filename, original_filename, identifier) {
        console.log('GET', status);
        res.send(200, (status == 'found' ? 200 : 404));
    });
});

app.get('/download/:identifier', function(req, res) {
    flow.write(req.params.identifier, res);
});*/
