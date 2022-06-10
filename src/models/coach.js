const schema = require('mailgun-js/lib/schema')
const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const coachSchema = new mongoose.Schema({
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
    },  tokens:[{
        token:{
            type: String,
            required: true
        }
    }] , 
        trainees:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
})


coachSchema.methods.toJSON = function (){
    const coach = this
    const coachObject = coach.toObject()
    delete coachObject.password
    delete coachObject.tokens

    return coachObject
}

coachSchema.methods.generateAuthToken = async function(){
    const coach = this
    const token = jwt.sign({ _id: coach._id.toString() }, 'thisismynewcourse')
         coach.tokens = coach.tokens.concat({token: token})
         await coach.save()
    return token
}

coachSchema.statics.findByCredentials = async (email,password)=>{
    const coach = await coach.findOne({email: email})
    
    if(!coach){
       
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        
        throw new Error('unable to login!')
    }
   
    return  coach
}


coachSchema.pre('save',async function (next){
    const coach = this
    if(coach.isModified('password')){

        coach.password = await bcrypt.hash(coach.password,8) 
       
    }

    next()
})


coachSchema.pre('remove',async function(next){
    const coach = this
    //await Task.deleteMany({owner: user._id})
    next()
})



const Coach = mongoose.model('Coach' ,coachSchema)



module.exports= Coach