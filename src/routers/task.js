const express = require('express')
const Task  = require('../models/task')
const auth = require("../middleware/auth")
const User = require('../models/user')
const router = new express.Router()


// to create task
router.post('/tasks',auth,async(req,res)=>{
   // const task = new Task(req.body)
   const task = new Task({
       ...req.body,
       owner:req.user._id
   })
    try{
         await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)

    }
})




// to fetch all tasks

router.get('/tasks',auth,async(req,res)=>{
    try{
      // const tasks =  await Task.find({owner:req.user._id})
      // await req.user.populate('tasks').execPopulate() 
       //res.status(200).send(req.user.tasks)
       const match ={}
       const sort={}
       if(req.query.completed){
           match.completed = req.query.completed
       }
       if(req.query.sortBy){
           const parts = req.query.sortBy.split(':')
           sort[parts[0]] = parts[1] === 'desc'? -1 : 1
       }
       const myUser = await User.findOne({_id:req.user._id}).populate({
           path:'tasks',
           match,
           options:{
               limit:parseInt(req.query.limit),
               skip:parseInt(req.query.skip),
               sort
           }
       }).exec()
      
       res.status(200).send(myUser.tasks)

    }catch{
        res.status(500).send()
    }
    
})

// to fetch one task
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner:req.user._id})
         if(!task){
            return res.status(404).send()
        }
        res.send(task)

    }catch(e){
        res.status(500).send()

    }
})


// update one task
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperator = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperator){
        return res.status(400).send({error:'Invalid UpdateS'})
    }
  
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        
       //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       if(!task){
           return res.status(404).send()
       }
       updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
       res.send(task)

    }catch(e){
        res.status(400).send(e)

    }

})


// delete task

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task) {
            return res.status(404).send()

            
        }
        res.send(task)

    }catch(e){
        res.status(400).send(e)

    }
})

module.exports = router
