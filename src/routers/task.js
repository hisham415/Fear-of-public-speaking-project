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
    /*const data = await axios({
        method: 'post',
        url: "machinelink.com",
        data: {
         file : "/audio/"+ req.file.filename
        }
      });
      */
    //res.send(data)
    req.user.audio = [...req.user.audio , {audioUrl : "/audio/" + req.file.filename }]
    await req.user.save()

    res.send()
})


module.exports = router