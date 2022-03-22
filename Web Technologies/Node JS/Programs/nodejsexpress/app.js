const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

app.post('/user/add', (req, res) => {
    const existUsers = getUserData()

    const userData = req.body

    if(userData.fullname == null || userData.age == null || userData.username == null || userData.password == null){
        return res.status(401).send({error: true,msg: 'User data missing'})
    }

    const findExist = existUsers.find( user => user.username === userData.username)
    if(findExist){
        return res.status(409).send({error: true, msg: 'username already exist'})
    }

    existUsers.push(userData)

    saveUserData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})
})

//Read - Get Method
app.get('/user/list', (req, res) => {
    const users = getUserData()
    res.send(users)
})

//Update - Patch method
app.patch('/user/update/:username', (req, res) => {

    const username = req.params.username

    const userData = req.body

    const existUsers = getUserData()

    const findExist = existUsers.find(user => user.username === username )
    if(!findExist){
        return res.status(409).send({error: true,msg: 'username not exist'})
    }

    const updateUser = existUsers.filter( user => user.username !== username)

    updateUser.push(userData)

    saveUserData(updateUser)

    res.send({success: true, msg: 'User data updated Successfully'})
})

//Delete -delete method
app.delete('/user/delete/:username', (req, res) => {
    const username = req.params.username
    
    const existUsers = getUserData()

    const filterUser = existUsers.filter( user => user.username !== username )

    if( existUsers.length === filterUser.length){
        return res.status(409).send({error: true,msg: 'username does not exist'})
    }

    saveUserData(filterUser)

    res.send({success: true, msg: 'User removed successfully'})

})

//Read the user data from json file
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('user.json', stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync('user.json')
    return JSON.parse(jsonData)
}


//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})