const router = require('express').Router();
const connection = require('../../config/database').connection;
const multer = require('multer');
const image = connection.models.image;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
var upload = multer({ storage: storage });

router.post('/uploadimage', upload.single('image'), (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString('base64');
  var final_img = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_img, 'base64'),
  };
  const newImage = new image({
    name: req.file.mimetype,
    data: new Buffer(encode_img, 'base64'),
  });

  newImage.save((img) => {
    console.log(img);
  });
  console.log(req.body);
  res.send('hello');
  //   image.create(final_img, function (err, result) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(result.img.Buffer);
  //       console.log('Saved To database');
  //       res.contentType(final_img.contentType);
  //       res.send(final_img.image);
  //     }
  //   });
});

router.post('/upload', (req, res) => {
  if (req.files) {
    var { img } = req.files;
  }
  console.log(img);
  var encode_img = img.toString('base64');
  var data = Buffer.from(encode_img, 'base64');
  console.log(data);
  const newImage = new image({
    name: img.name,
    data: data,
  });
  console.log(newImage);
  newImage.save(() => {
    res.send('image uploaded');
  });
});

module.exports = router;
