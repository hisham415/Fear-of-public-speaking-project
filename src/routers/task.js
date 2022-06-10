const express = require('express')
const User = require('../models/user')
const multer  =   require('multer');
const router = new express.Router()
const auth = require('../middleware/auth')
const req = require("request");
const fs = require("fs");
const path = require('path')
const axios = require('axios')
const multiparty = require("multiparty");
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname + `../../../audio`));
    },
    filename: function (req, file, cb) {
      cb(null, `user-${req.user.id}-${Date.now()}.mp3`);
    },
  });

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000000
    }
})

router.post('/tasks/me/audio',auth, upload.single('audio'), async (req, res) => {
    const data = await axios({
        method: 'get',
        url: "http://127.0.0.1:5000/",
        data: {
         file : "C:/Users/Hassn Hamada/Desktop/New folder (2)/Fear-of-public-speaking-projects/audio/" + req.file.filename
        }
      });

      res.send(data.data)

        req.user.result = [...req.user.result , {Sentence : data.data.Sentence, Fillers : data.data.fillers, FillersPercentage: data.data.FillersPercentage, WordCount:data.data.WordCount}]
        req.user.audio = [...req.user.audio , {audioUrl : "/audio/" + req.file.filename }]
        console.log(req.user)
    req.user.save()

})

module.exports = router

