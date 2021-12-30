const express = require('express')
const User  = require('../models/user')
const auth = require('../middleware/auth')
const { send } = require('express/lib/response')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

router.post('/users',async(req,res)=>{
   const user = new User(req.body)
   try{
       await user.save()
       const token  = await user.generateAuthToken()
       res.status(201).send({user,token})

   }catch(e){
       res.status(400).send(e)

   }
    
})

// to fetch my profile 

router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})


// upload profile pic

const upload = multer({
  //dest:'avatars', remove it to inforece throw file to the post function
  limits:{
      fileSize:1000000
  },
  fileFilter(req,file,cb){
      if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
          return cb(new Error('Only PNG JPG JPEG'))
      }
      cb(undefined,true)

  }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer() 
    // use sharp to resize and edit img before save it
    req.user.avatar= buffer
     await req.user.save()
        res.send()

    
    
},(error,req,res,next)=>{ 
    // must have this call signture (error,req,res,next)
    //to make express 
    //understand this is for handel coming errors
    res.status(400).send({error:error.message})
})
// delete avatar
router.delete('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
     req.user.avatar=undefined
     await req.user.save()
        res.send()

    
    
},(error,req,res,next)=>{ 
    // must have this call signture (error,req,res,next)
    //to make express 
    //understand this is for handel coming errors
    res.status(400).send({error:error.message})
})

// get user avatra

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png') // set header of res
        res.send(user.avatar)

    }catch(e){
        res.status(400).send()
    }
})




// update one user
router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperator = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperator){
        return res.status(400).send({error:'Invalid UpdateS'})
    }
  
    try{
        //const user = await User.findById(req.params.id)
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()
      //update in db that is why i give it runValidators:true 
      //it donot use middleware 
      // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
      
       res.send(req.user)

    }catch(e){
        res.status(400).send(e)

    }

})

// delete user

router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)

    }catch(e){
        res.status(500).send()

    }
})

// user login

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})

    }catch(e){
        res.status(400).send()
    }
})

// user logout

router.post('/users/logout',auth,async(req,res)=>{
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

// logouALll
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send("loged out all")

    }catch(e){
        res.status(500).send()


    }
})

module.exports = router