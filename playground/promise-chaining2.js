require('../src/db/mongoose')
const Task = require('../src/models/task')
 
Task.findByIdAndRemove('61c8a65b25fa91111ffa8aff').then((deletedTask)=>{
    console.log(deletedTask)
    return Task.countDocuments({completed:false})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})
