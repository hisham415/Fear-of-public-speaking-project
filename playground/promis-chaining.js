require('../src/db/mongoose')
const Task = require('../src/models/tasks')
const User = require('../src/models/user')

// User.findByIdAndUpdate('6276a474b45a3aab48820026', { age: 100}).then((x)=>{
//     console.log(x)
//     return User.countDocuments({age:0})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeAndCount = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('6276a722dd8958772fd1a2d1',5).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})