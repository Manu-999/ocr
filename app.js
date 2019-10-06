const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const worker = createWorker();

// Storage
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads');
  },
  filename: (req, res, cb) => {
    cb(null, req.file);
  }
});
const upload = multer({ storage: storage }).single('test');

app.set('vew engine', 'ejs');

//ROUTES

app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Start Up our server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log('Server up and running on ' + PORT));
