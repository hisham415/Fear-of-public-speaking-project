const mongoose = require('mongoose')

//mongodb://127.0.0.1:27017/task-api

mongoose.connect('mongodb+srv://hisham:07Mghm8JE9I2Ifaa@cluster0.h3njj.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    //useCreateIndex: true
})

    