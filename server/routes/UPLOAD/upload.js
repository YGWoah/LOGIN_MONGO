const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
// const gfs = require('../../config/database').gfs;
const router = require('express').Router();
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
const connection = require('../../config/database').connection;
const mongoose = require('mongoose');
const objID = mongoose.Types.ObjectId;
require('dotenv').config();
const mongoURI = process.env.DB_STRING;
const { isAuth } = require('../../Middleware/authMiddleware');

//setting Stoage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename =
          buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });
let gridfsBucket;
let gfs;
connection.once('open', () => {
  // Init stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });

  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

router.use(isAuth);

//to get image by id
router.get('/', (req, res) => {
  let { id } = req.query;
  console.log(id);

  gfs.files.find({ _id: new objID(id) }).toArray((err, files) => {
    console.log(files);
    if (!files || files.length === 0)
      return res.send('no images found');
    res.writeHead(200, {
      'Content-Type': files[0].contentType,
      'Content-Length': files[0].length,
    });
    const readstream = gridfsBucket.openDownloadStream(files[0]._id);
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });

    readstream.pipe(res);
  });
});

//routes
router.get('/images', (req, res) => {
  let gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads');
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0)
      return res.send('no images found');

    res.writeHead(200, {
      'Content-Type': files[0].contentType,
      'Content-Length': files[0].length,
    });
    const readstream = gridfsBucket.openDownloadStream(files[0]._id);
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });

    readstream.pipe(res);
  });
});
router.post('/imagespost', (req, res) => {
  console.log('g\n');
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0)
      return res.send('no images found');
    console.log(files[0]);
    res.writeHead(200, {
      'Content-Type': files[0].contentType,
      'Content-Length': files[0].length,
    });
    const readstream = gridfsBucket.openDownloadStream(files[0]._id);
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });

    readstream.pipe(res);
  });
});

router.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  console.log(req.body);
  res.send('image uploaded');
});

router.get('/count', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (err) throw err;
    if (!files || files.length === 0)
      return res.send('no images found');
    let fileNames = files.map((file) => {
      return file._id;
    });
    res.status(200).json({
      fileNames: fileNames,
    });
  });
});

router.post('/delete', (req, res) => {
  let { filename } = req.body;
  gridfsBucket.delete(new objID(filename));
  res.send('deleted');
});

router.get('/chichi', (req, res) => {
  console.log(req.session.passport.user);
  User.findOne((arr) => {
    console.log(arr);
  });
  res.send('Succes');
});

module.exports = router;
