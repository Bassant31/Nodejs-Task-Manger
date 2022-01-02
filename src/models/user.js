const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sharp  =require('sharp')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("THIS IS NOT EMAIL")

            }
        }

    }
    ,
    age:{
        type:Number,
        default:0,
        validate(value){
            if (value<0) {
                throw new Error('Age must be > 0')
                
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:7,
        validate(value){
          
            if (value.toLowerCase().includes('password')) {
                throw new Error('mustnot contain  password')
                
            }

        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:"Task",
    localField:'_id',
    foreignField:'owner'
})

//get public profile
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}
// methods to call by instance
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRETE)
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}
// statics to call by model
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('unable to login')
    }
    const isMatch = bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error ('unable to login')
    }
    return user
}
//midleware to hash plain  our password
userSchema.pre('save',async function(next){
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }


    next()
    //must call to inform pre to go to next step as there is no thing more to do

})

//midleware to delete tasks when user deleted 
userSchema.pre('remove',async function(next){
    const user = this 
    await Task.deleteMany({owner:user._id})


    next()

})




const User = mongoose.model('User',userSchema)

module.exports = User


/*




const me = new User({
    name:"   Bassant   ",
    email:"baSSSSa@gmail.com",
    age:27,
    pass:'Passwordkokooko'
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log("ERROR==>",error)
})*/