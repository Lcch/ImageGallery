var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var settings = require('../settings.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {});
});

function getGallery(category) {
  return function(req, res) {
            Post.getAll(function(err, images) {
              Post.filterCategory(
                images,
                category.toLowerCase(),
                function(err, filterImages) {
                  console.log(filterImages);
                  res.render('gallery', { title: category,
                                          images: filterImages });
                });
            });
          };
};
router.get('/anime', getGallery('Anime'));
router.get('/scenery', getGallery('Scenery'));
router.get('/daily', getGallery('Daily'));
router.get('/funny', getGallery('Funny'));
router.get('/pretty', getGallery('Pretty'));

function deletePhotoPage(category) {
  return function(req, res) {
          Post.getAll(function(err, images) {
            Post.filterCategory(
              images, 
              category.toLowerCase(),
              function(err, filterImages) {
                console.log(filterImages);
                res.render('delete', { title: category,
                                       images: filterImages}); 
            });
          }); 
         };
};
router.get('/anime/delete', deletePhotoPage('Anime'));
router.get('/scenery/delete', deletePhotoPage('Scenery'));
router.get('/daily/delete', deletePhotoPage('Daily'));
router.get('/funny/delete', deletePhotoPage('Funny'));
router.get('/pretty/delete', deletePhotoPage('Pretty'));

function deletePhoto(category) {
  return function(req, res) {
           Post.removeItem(req.body.delete, function(err) {
             if (err) {
               console.log(err);
             }
             res.redirect('/' + category.toLowerCase() + '/delete');
           });
         };
};
router.post('/anime/api/delete', deletePhoto('Anime'));
router.post('/scenery/api/delete', deletePhoto('Scenery'));
router.post('/daily/api/delete', deletePhoto('Daily'));
router.post('/funny/api/delete', deletePhoto('Funny'));
router.post('/pretty/api/delete', deletePhoto('Pretty'));

function uploadPhoto(category) {
  return function(req, res) {
          if (req.files && req.files.fileUploaded) {
            console.log(req.files.fileUploaded);

            var caption = req.body.caption;
            var description = req.body.description;
            var mimetype = req.files.fileUploaded.mimetype;
            if (mimetype === 'image/jpeg' ||
                mimetype === 'image/png' ||
                mimetype === 'image/jpg' ||
                mimetype === 'image/gif') {
              var post_filename = req.files.fileUploaded.name;
              console.log(post_filename);
              var post = new Post(post_filename,
                                  category.toLowerCase(),
                                  [category.toLowerCase()],
                                  caption,
                                  description);
              post.save(function(err) {
                if (err) {
                  req.flash('error', err);
                  return res.redirect('/' + category.toLowerCase()); 
                }
                console.log('success');
                res.redirect('/' + category.toLowerCase());
              });
            }
          } else {
            console.log('upload fail');
            res.redirect('/' + category.toLowerCase());
          }
         };
};
router.post('/anime/api/photo', uploadPhoto('Anime'));
router.post('/scenery/api/photo', uploadPhoto('Scenery'));
router.post('/daily/api/photo', uploadPhoto('Daily'));
router.post('/funny/api/photo', uploadPhoto('Funny'));
router.post('/pretty/api/photo', uploadPhoto('Pretty'));

module.exports = router;
