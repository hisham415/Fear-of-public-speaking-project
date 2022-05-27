const mongoose = require('mongoose')

//mongodb://127.0.0.1:27017/task-api

mongoose.connect('mongodb+srv://root:toor@cluster0.4v6ca.mongodb.net/test',{
    useNewUrlParser: true,
    //useCreateIndex: true
})

   