var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var settings = require('../settings.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {});
});

router.get('/anime', function(req, res) {
  Post.getAll(function(err, images) {
    Post.filterCategory(images, 'anime', function(err, filterImages) {
      console.log(filterImages);
      res.render('gallery', { title: 'Anime',
                              images: filterImages}); 
    });
  }); 
});

router.get('/scenery', function(req, res) {
  Post.getAll(function(err, images) {
    Post.filterCategory(images, 'scenery', function(err, filterImages) {
      console.log(filterImages);
      res.render('gallery', { title: 'Scenery',
                              images: filterImages}); 
    });
  }); 
});

router.get('/daily', function(req, res) {
  Post.getAll(function(err, images) {
    Post.filterCategory(images, 'daily', function(err, filterImages) {
      console.log(filterImages);
      res.render('gallery', { title: 'Daily',
                              images: filterImages}); 
    });
  });  
});


router.get('/anime/delete', function(req, res) {
  Post.getAll(function(err, images) {
    Post.filterCategory(images, 'anime', function(err, filterImages) {
      console.log(filterImages);
      res.render('delete', { title: 'Anime',
                              images: filterImages}); 
    });
  }); 
});
router.get('/scenery/delete', function(req, res) {
  Post.getAll(function(err, images) {
    Post.filterCategory(images, 'scenery', function(err, filterImages) {
      console.log(filterImages);
      res.render('delete', { title: 'Scenery',
                              images: filterImages}); 
    });  
  }); 
});
router.get('/daily/delete', function(req, res) {
  Post.getAll(function(err, images) {
    Post.filterCategory(images, 'daily', function(err, filterImages) {
      console.log(filterImages);
      res.render('delete', { title: 'Daily',
                             images: filterImages}); 
    });  
  }); 
});


router.post('/anime/api/delete', function(req, res) {
  console.log(req.body.delete);
  Post.removeItem(req.body.delete, function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/anime/delete');
  });
});
router.post('/scenery/api/delete', function(req, res) {
  console.log(req.body.delete);
  Post.removeItem(req.body.delete, function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/scenery/delete');
  });
});
router.post('/daily/api/delete', function(req, res) {
  console.log(req.body.delete);
  Post.removeItem(req.body.delete, function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/daily');
  });
});


router.post('/scenery/api/photo', function(req, res) {
  if (req.files && req.files.fileUploaded) {
    var mimetype = req.files.fileUploaded.mimetype;
    if (mimetype === 'image/jpeg' ||
        mimetype === 'image/png') {
      var post_filename = req.files.fileUploaded.name;
      console.log(post_filename);
      var post = new Post(post_filename, 'scenery', ['scenery']);
      post.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/scenery'); 
        }
        console.log('success');
        res.redirect('/scenery');
      });
    }
  }
});
router.post('/anime/api/photo', function(req, res) {
  if (req.files && req.files.fileUploaded) {
    var mimetype = req.files.fileUploaded.mimetype;
    if (mimetype === 'image/jpeg' ||
        mimetype === 'image/png') {
      var post_filename = req.files.fileUploaded.name;
      console.log(post_filename);
      var post = new Post(post_filename, 'anime', ['anime']);
      post.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/anime'); 
        }
        console.log('success');
        res.redirect('/anime');
      });
    }
  }
});
router.post('/daily/api/photo', function(req, res) {
  if (req.files && req.files.fileUploaded) {
    var mimetype = req.files.fileUploaded.mimetype;
    if (mimetype === 'image/jpeg' ||
        mimetype === 'image/png') {
      var post_filename = req.files.fileUploaded.name;
      console.log(post_filename);
      var post = new Post(post_filename, 'daily', ['daily']);
      post.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/daily'); 
        }
        console.log('success');
        res.redirect('/daily');
      });
    }
  }
});

module.exports = router;
