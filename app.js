const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { createWorker } = require('tesseract.js');
const worker = createWorker({
  logger: m => console.log(m)
});

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage }).single('test');

app.set('vew engine', 'ejs');

//ROUTES

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/upload', (req, res) => {
  upload(req, res, err => {
    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const {
        data: { text }
      } = await worker.recognize(`./uploads/${req.file.originalname}`);
      console.log(text);

      const { data } = await worker.getPDF('Tesseract OCR Result');
      fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(data));

      const fileName = req.body.file;

      const stat = fs.statSync('./tesseract-ocr-result.pdf');
      const file = fs.createReadStream('./tesseract-ocr-result.pdf');

      res.setHeader('Content-Length', stat.size);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName}.pdf`
      );
      file.pipe(res);

      await worker.terminate();
    })();
  });
});

// Start Up our server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log('Server up and running on ' + PORT));
