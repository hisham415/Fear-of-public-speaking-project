const express = require('express')
var bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs')
const path = require('path')
const axios = require('axios')
require('./db/mongoose')


const User = require('./models/user')
const userRouter = require('../src/routers/user')
const taskRouter = require('./routers/task');
const request = require('request');

const app = express()
const port =  4000

app.use("/audio", express.static(path.join(__dirname, "../audio")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.get('/',(req,res)=> res.json({message: 'hello world!'}))

app.listen(port , ()=>{
    console.log('server is up and running on port '+ port)
    
})












// const Task = require('./models/task')
// const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('6288184276d453abfd50e82d')
    // await task.populate('owner')
    // console.log(task.owner)

    // const user = await User.findById('6288182976d453abfd50e825')
    //  await user.populate('tasks')
    //  console.log(user.tasks)
}

main()