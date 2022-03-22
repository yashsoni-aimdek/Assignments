const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

app.post('/user/add', (req, res) => {
    const existUsers = getUserData()

    const userData = req.body

    if(userData.age == null || userData.name == null || userData.password == null || userData.id == null || userData.gender == null || userData.birthdate == null || userData.country == null || userData.phone == null){
        return res.status(401).send({error: true,msg: 'User data missing'})
    }

    const findExist = existUsers.find( user => user.name === userData.name)
    if(findExist){
        return res.status(409).send({error: true, msg: 'name already exist'})
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
app.patch('/user/update/:name', (req, res) => {

    const name = req.params.name

    const userData = req.body

    const existUsers = getUserData()

    const findExist = existUsers.find(user => user.name === name )
    if(!findExist){
        return res.status(409).send({error: true,msg: 'name not exist'})
    }

    const updateUser = existUsers.filter( user => user.name !== name)

    updateUser.push(userData)

    saveUserData(updateUser)

    res.send({success: true, msg: 'User data updated Successfully'})
})

//Delete -delete method
app.delete('/user/delete/:name', (req, res) => {
    const name = req.params.name
    
    const existUsers = getUserData()

    const filterUser = existUsers.filter( user => user.name !== name )

    if( existUsers.length === filterUser.length){
        return res.status(409).send({error: true,msg: 'name does not exist'})
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