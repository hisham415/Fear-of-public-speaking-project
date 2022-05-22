const express = require('express')
//const Task = require('../models/tasks')
const User = require('../models/user')
const multer  =   require('multer');
const router = new express.Router()
const auth = require('../middleware/auth')
const req = require("request");
const fs = require("fs");
var http = require('http')
const path = require('path')
const axios = require('axios')
const multiparty = require("multiparty");

var bodyParser = require('body-parser');
//const { remove } = require('../models/tasks');
const { object } = require('sharp/lib/is');

router.use(bodyParser.urlencoded({ extended: true }));


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname + `../../../avatars`));
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

router.post('/tasks/me/avatar',auth, upload.single('avatar'), async (req, res) => {
    /*const data = await axios({
        method: 'post',
        url: "machinelink.com",
        data: {
         file : "/avatars/"+ req.file.filename
        }
      });
      */ 
    //res.send(data)
    req.user.audio = [...req.user.audio , {audioUrl : "/avatars/" + req.file.filename }]
    console.log(req.user)
    await req.user.save()

    res.send()
})


router.post('/tasks',auth, async (req,res)=>{

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch{
        res.status(400).send(e) 
    }
})
router.get('/tasks',auth, async (req,res)=>{
    try{
        const tasks = await Task.find({owner:req.user._id})
        res.send(tasks)
    } catch{
        res.status(500).send(e)
    }
})
router.get('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['TaskName','completed']
    const isValidOperation = updates.every((updates)=> allowedUpdates.includes(updates))
    if(!isValidOperation){
        return res.status(400).send({error:'invalid updates!'})
    }
    try{
        const task = await Task.findOne({ id: req.params.id , owner: req.user._id })
        if(!task){
            return res.status(404).send
        }
        updates.forEach( (update)=> task[update] =  req.body[update] )
        await task.save()
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id , owner: req.user.id})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router