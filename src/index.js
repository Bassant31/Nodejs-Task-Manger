const express = require('express')
const res = require('express/lib/response')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

/*app.use((req,res,next)=>{
    res.status(503).send("WE ARE AT MINTANINCE MODE")

})*/
/*

const multer = require('multer')
const upload = multer({
  dest:'images', 
  limits:{
    fileSize:1000000 //in bytes
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(doc|docx)$/)){
      return cb(new Error('Please upload a Word documents'))
    }
    cb(undefined,true)

  }
})

app.post('/upload',upload.single('upload'),(req,res)=>{

  res.send()
},(error,req,res,next)=>{ 
    // must have this call signture (error,req,res,next)
    //to make express 
    //understand this is for handel coming errors
    res.status(400).send({error:error.message})
})
*/

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port , ()=>{
    console.log("Server listen on "+ port)
})


const Task = require('./models/task')

const main = async ()=>{
  const task = await Task.findById('61cc2b251e6ac4e681dcfe06').populate('owner').exec()
  console.log(task.owner)
}

main()