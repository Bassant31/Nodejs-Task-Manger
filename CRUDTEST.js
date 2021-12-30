 
 MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("Unable to connect to database")
    }
    const db = client.db(databaseName)
    db.collection('users').findOne({_id:new ObjectID("61c84b6e45edd998dcc72506")},(error,user)=>{
        if ((error)) {
            return console.log("unable find the  user")
            
        }
        else{
            console.log(user)
        }
    })
  
})
 
 db.collection('users').find({name:"Bassant"}).toArray((error,users)=>{
        if (error) {
            return console.log("unable to find useres")
        }
        console.log(users)
    })
    db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
        if (error) {
            return console.log("unable to find useres")
        }
        console.log(tasks)
    })
   /* db.collection('users').insertOne({
        name:'Bassant',
        age:23
    },(error,result)=>{
        if(error){
            return console.log("Unable to insert user")
        }
        console.log(result)
    })*/
  /* db.collection('users').insertMany([
        {
            name:"Ahmed",
            age:24
        },
        {
            name:"Mostafa",
            age:25
        }
    ],(error,result)=>{
        if(error){
            return console.log("Unable to insert users")
        }
        console.log(result.ops)
    })*/
   /* db.collection('tasks').insertMany([
        {
            description:"Clean the house",
            completed:true
        },
        {
            description:"Renew inspection",
            completed:false
        },
        {
            description:"Pot plants",
            completed:false
        }
    ],(error,result)=>{
        if (error) {
            return console.log("Unable to insert users")
        }
        console.log(result.insertedCount)
    })*/