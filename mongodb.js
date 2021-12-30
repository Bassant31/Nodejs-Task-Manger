/*const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient*/

const {MongoClient,ObjectID} = require('mongodb')
const id = new ObjectID()
/*console.log(id)
console.log(id.getTimestamp())*/

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("Unable to connect to database")
    }
    const db = client.db(databaseName)
    db.collection('users').updateOne(
       {_id:new ObjectID("61c847f750fb2d72fd6b2e20")},
       {
           $set:{
               name:"LiLi"
           }
       }
       ).then((result)=>{
           console.log(result)
       }).catch((error)=>{
           console.log(error)
       })
  
})