var http = require('http');

webutils = {
  url_download: function(url, callback) {
    var options = {
      host: '127.0.0.1',
      port: '8000',
      path: '/' + url
    };

    str = ""
    var req = http.get(options, function(response) {
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log("receiv: ", str);
        return callback(null, str);
      });

      response.on('error', function(e) {
        console.log('ERROR: ' + e.message);
        return callback(e.message);
      });
    });
  }
};

module.exports = webutils;
