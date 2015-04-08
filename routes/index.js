var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var settings = require('../settings.js');
var webutils = require('../models/webutils.js');

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

function uploadPhotoByURL(category) {
  return function(req, res) {
          console.log(req.body.img_url);
          img_url = req.body.img_url;
          if (img_url !== undefined && img_url.length > 5) {
            if (img_url.substring(0, 4) !== "http") {
              img_url = "http://" + img_url;
            }

            img_format = img_url.split('.')
            img_format = img_format[img_format.length - 1].toLowerCase()
            console.log(img_format)
            if (img_format !== 'jpeg' && img_format !== 'png' &&
                img_format !== 'jpg' && img_format !== 'gif') {
              return res.redirect('/' + category.toLowerCase());
            }

            webutils.url_download(img_url, function(err, img_file) {
              if (err) {
                console.log("err: ", err);
                return res.redirect('/' + category.toLowerCase());
              } else {
                if (img_file.length > 2) {
                  console.log(img_file);

                  var caption = undefined;
                  var description = req.body.description;
                  var post = new Post(img_file,
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
                } else {
                  return res.redirect('/' + category.toLowerCase());
                }
              }
            });
          } else {
            return res.redirect('/' + category.toLowerCase());
          } 
         };
};
router.post('/anime/api/url_photo', uploadPhotoByURL('Anime'));
router.post('/scenery/api/url_photo', uploadPhotoByURL('Scenery'));
router.post('/daily/api/url_photo', uploadPhotoByURL('Daily'));
router.post('/funny/api/url_photo', uploadPhotoByURL('Funny'));
router.post('/pretty/api/url_photo', uploadPhotoByURL('Pretty'));


module.exports = router;
