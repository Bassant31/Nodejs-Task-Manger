const { TestWatcher } = require('jest')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,setupDatabase} = require('./fixtures/db')



beforeEach(setupDatabase)

test('should signup a new user',async()=>{
    const response = await request(app).post('/users').send({
        name:"Ailaa",
        email:"ailaaa@example.com",
        password:"pass123456"

    }).expect(201)

    //Assert that the database was changed correctly
   const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
   expect(response.body).toMatchObject({
        user:{
              name:"Ailaa",
              email:"ailaaa@example.com",
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('pass123456')

})

test('Should log in existing user ', async()=>{
    const response = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password

    }).expect(200)
    const user = await User.findById(response.body.user._id)

    expect(response.body).toMatchObject({
        token:user.tokens[1].token
    })

})

test('Shouldnot log in existing user ', async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:"123456789"

    }).expect(400)
})

test('Should get profile for unAthenticared user',async()=>{
    await request(app).get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unAthenticared user',async()=>{
    await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('Should delete authenticate for user',async()=>{
    await request(app).delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)

    expect(user).toBeNull()

})

test('Should  not delete Unauthenticate for user',async()=>{
    await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image',async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/1.jpg')
    .expect(200)
    const user =await User.findById(userOneId)
    expect(user.avatar).toEqual((expect.any(Buffer)))
})

test('Should update Authenticated user',async()=>{
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'jess'
    }).expect(200)
    const user =  await User.findById(userOneId)
    expect(user.name).toEqual('jess')
})

test('Should update Authenticated user',async()=>{
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        loacation:"'oiuoiu"
    }).expect(400)
})