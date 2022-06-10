const { Router } = require('express')
const express = require('express')
const User = require('../models/user')
const mailer = require('../middleware/confirmation')
const auth = require('../middleware/auth')

const router = new express.Router()

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
let x =0 
router.post('/users/signup', async (req,res)=>{
    req.body.confirmationCode = ''
    for (let i = 0; i < 25; i++) {
        x = Math.floor(Math.random() * characters.length)
        req.body.confirmationCode += characters[x];
    }
    const user = new User(req.body)
    //mailer(req.body.email , req.body.confirmationCode)
    try{
     await user.save()
     const token = await user.generateAuthToken()
     res.status(201).send({user: user , token: token})
    } catch(e){
     res.status(400).send(e)
    }
 })
 router.post('/users/logout', auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token  
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
 })
 router.post('/users/logoutAll',auth,async(req,res)=>{
     try{
        req.user.tokens = []
        req.user.save()
        res.status(200).send()
     }catch(e){
        res.status(500).send()
     }
 })

 router.post('/users/login', async (req,res)=>{
            
   
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)

        if (user.status != "Active") {
            return res.status(401).send({
              message: "Pending Account. Please Verify Your Email!",
            });
          }


        const token = await user.generateAuthToken()
        
        res.send({user: user ,token: token})
        
    }catch(e){
        res.status(400).send()
    }
 })
 
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        updates.forEach( (update)=> req.user[update] = req.body[update] )
        
        await req.user.save()
    
        if (!req.user) {
            return res.status(404).send()
        }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/confirm', async (req,res) => {
    const confirmationCode = req.body.confirmationCode
    
   const x = await User.findOne({ confirmationCode: confirmationCode })
    if(x){
        x.status = "Active"
        x.save()
        res.send(x)
    }
})
router.post('/myTrainings',auth,async(req,res)=>{
    const user = req.user
    res.status(200).send(user.audio)
})
router.post('/coacher',auth,async(req,res)=>{
    //still trying to figure it out
})


module.exports = router


