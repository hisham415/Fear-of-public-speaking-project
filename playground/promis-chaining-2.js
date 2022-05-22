require('../src/db/mongoose')
const e = require('express')
const Task = require('../src/models/tasks')


// Task.findByIdAndDelete('6276a8cb9524f6ac6bc2589a').then(()=>{
//     return  Task.countDocuments({completed: false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('627803f8b0644064c137e27c').then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})