var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var settings = require('../settings.js');

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.originalUrl);
  Post.get(function(err, images) {
    console.log(images);
    res.render('index', { title: 'Anime Images',
                          images: images}); 
  }); 
});

router.get('/delete', function(req, res) {
  Post.get(function(err, images) {
    console.log(images);
    res.render('delete', { title: 'Anime Images',
                           images: images}); 
  }); 
});

router.post('/api/delete', function(req, res) {
  console.log(req.body.delete);
  Post.removeItem(req.body.delete, function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/delete');
  });
});


router.post('/api/photo', function(req, res) {
  if (req.files && req.files.fileUploaded) {
    var mimetype = req.files.fileUploaded.mimetype;
    if (mimetype === 'image/jpeg' ||
        mimetype === 'image/png') {
      var post_filename = req.files.fileUploaded.name;
      
      console.log(post_filename);

      var post = new Post(post_filename, 'anime');
      post.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/'); 
        }
        console.log('success');
        res.redirect('/');
      });
    }
  }
});

module.exports = router;
