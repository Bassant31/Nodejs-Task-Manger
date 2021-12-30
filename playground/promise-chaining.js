require('../src/db/mongoose')
const User = require('../src/models/user')





/*User.findByIdAndUpdate('61c9a7de48ff4fc11de7662d',{age:27}).then((user)=>{
    console.log(user)
    return User.countDocuments({age:27})
}).then((num)=>{
    console.log(num)
}).catch((e)=>{
    console.log(e)
})
*/
const updateAgeAndCount = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('61c9a7de48ff4fc11de7662d',70).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)

})