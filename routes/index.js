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

function uploadPhoto(category) {
  return function(req, res) {
          if (req.files && req.files.fileUploaded) {
            var mimetype = req.files.fileUploaded.mimetype;
            if (mimetype === 'image/jpeg' ||
                mimetype === 'image/png') {
              var post_filename = req.files.fileUploaded.name;
              console.log(post_filename);
              var post = new Post(post_filename,
                                  category.toLowerCase(),
                                  [category.toLowerCase()]);
              post.save(function(err) {
                if (err) {
                  req.flash('error', err);
                  return res.redirect('/' + category.toLowerCase()); 
                }
                console.log('success');
                res.redirect('/' + category.toLowerCase());
              });
            }
          }
         };
};
router.post('/anime/api/photo', uploadPhoto('Anime'));
router.post('/scenery/api/photo', uploadPhoto('Scenery'));
router.post('/daily/api/photo', uploadPhoto('Daily'));

module.exports = router;
