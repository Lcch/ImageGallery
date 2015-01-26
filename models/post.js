var mongodb = require('./db');

function Post(filename, tag, time) {
  this.filename = filename;
  if (tag) {
    this.tag = "anime";
  } else {
    this.tag = tag;
  }
  if (time) {
    this.time = time;
  } else {
    this.time = new Date();
  }
};

module.exports = Post;

Post.removeItem = function removeItem(filename, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    db.collection('images', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      
      collection.remove({'filename': filename}, function(err) {
        mongodb.close();
        return callback(err);
      });
      console.log(filename);
    });
  });
}

Post.prototype.save = function save(callback) {
  var post = {
    filename: this.filename,
    tag: this.tag,
    time: this.time
  };

  mongodb.open(function(err, db) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    db.collection('images', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.insert(post, {safe:true}, function(err, post) {
        mongodb.close();
        callback(err, post);
      });
    });  
  });
};

Post.get = function get(callback) {
  mongodb.open(function(err, db) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    db.collection('images', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};

      collection.find(query).sort({time:-1}).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          callback(err, null);
        }
        var images = [];
        docs.forEach(function(doc, index) {
          var image = new Post(doc.filename, doc.tag, doc.time);
          images.push(image);
        });
        callback(null, images);
      });
    });
  });
};

