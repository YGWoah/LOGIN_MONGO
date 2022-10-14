const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

require('dotenv').config();

const conn = process.env.DB_STRING;
const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  hash: String,
  salt: String,
});

const User = connection.model('User', UserSchema);

const ImageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

// const Image = connection.model('image', ImageSchema);

let gfs;

connection.once('open', () => {
  // Init stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });
});
module.exports.gfs = gfs;
module.exports.connection = connection;
