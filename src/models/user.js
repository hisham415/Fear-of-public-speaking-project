const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { string } = require('sharp/lib/is')


const userSchema = new mongoose.Schema( {
    name:{
        type: String ,
        required: true,
        trim: true
    } , 
    email:{
            type: String ,
            required: true,
            unique:true,
            trim:true,
            lowercase:true,
            validate(value){
               if(!validator.isEmail(value)){
                throw new Error('email is invalid')
               } 
            }

    }, password:{
        type: String ,
        trim: true,
        required: true,
        validate(x){
            if(!validator.isLength(x,{min:6,max:undefined}) || x.includes('password')){
                throw new Error('password is week')
            }
        }
    },
    age:{
        type: Number,
        default: 0 ,
        validate(x){
            if(x<0)
            throw new Error('age must be positive number')
        }
    }, 
    status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
      },
    confirmationCode: { 
        type: String, 
        unique: true, 
        required: true
    },
    
    audio:[{
        audioUrl: {
            type: String
        }

    }],
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})


userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
         user.tokens = user.tokens.concat({token: token})
         await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email: email})
    
    if(!user){
       
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        
        throw new Error('unable to login!')
    }
   
    return  user
}


userSchema.pre('save',async function (next){
    const user = this
    if(user.isModified('password')){

        user.password = await bcrypt.hash(user.password,8) 
       
    }

    next()
})


userSchema.pre('remove',async function(next){
    const user = this
    //await Task.deleteMany({owner: user._id})
    next()
})



const User = mongoose.model('User' ,userSchema)



module.exports= User