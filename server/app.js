const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const random_token = require('random-token')
const port = 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));
app.use(cors({origin: '*'}))

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');
}
var db = mongoose.connections

const usersSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
});
const pagesSchema = mongoose.Schema({
  name: String,
  html: String,
})
const userWebsitesSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
  page_id: {type: mongoose.Schema.Types.ObjectId, ref: "pages"}
})

Users = mongoose.model('users', usersSchema);
Pages = mongoose.model('pages', usersSchema);
UsersPages = mongoose.model('users_pages', usersSchema);

const jwtSecretKey = "superSecretKey"

app.listen(port, () => `Server running on 127.0.0.1/${port}`);

app.get('/testApi', (req, res) => {
  res.send("Token: ")
})

app.post('/api/allUsers', (req, res)=>{
  let users_array = []
  const query = Users.find({}, (err, users)=>{
    if(err) console.log(err)
    users.forEach(user => {
      console.log(user.name)
    });
    
  })
  console.log(users_array)
  res.end(JSON.stringify({"users": users_array}))
})
app.post('/login', (req,res)=>{

  console.log("Login: Recieving request!") 
  try{
    const username = req.body.username;
    const password = req.body.password;

    Users.findOne({username: username}, async (err, user)=>{
      if(user){
        const success = await bcrypt.compare(password, user.password)
        if(err) console.log(err)
        if(success){
          
          const data = {"id": user.id, "name": user.name, "username": user.username, "password": user.password, "email": user.email}
          const token = jwt.sign(data, jwtSecretKey)          

          res.end(JSON.stringify({"logged_in": true, "token": token}))
        }
        else{
          res.end(JSON.stringify({"logged_in": false, "error":"Invalid Password"}))
        }
      }
      else
      {
        res.end(JSON.stringify({"logged_in": false, "error":"Invalid Username"}))
      }
    })
  }
  catch(err)
  {
    console.log(err);
    res.end(JSON.stringify({"created_user": true, "error": err}))

  }
})

app.post('/register', async (req, res)=>{
  console.log("Register: Recieving request!") 
  try{
    const name = req.body.name;
    const username = req.body.username;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;

    new_user = new Users({name: name, username:username, password:password, email:email})
    new_user.save()
    res.end(JSON.stringify({"created_user": true}))
  }
  catch(err)
  {
    console.log(err);
    res.end(JSON.stringify({"created_user": true, "error": err}))

  }
})

app.post('/api/getUserData', async (req, res)=>{
  const jwt_req = req.body.jwt;
  try{
    const user = jwt.verify(jwt_req, jwtSecretKey)
    if(user){
      res.end(JSON.stringify({"result": "success", "user": {"name": user.name, "username": user.username, "password": user.password, "email": user.email}}))
    }
    else{
      res.end(JSON.stringify({"result": "failed"}))
    }    
  }
  catch(err){
    res.end(JSON.stringify({"result": "failed", "error": err["message"]}))
  }
})

app.post('/api/websites', (req, res)=>{
  const jwt_req = req.body.jwt;
  var pages = []
  try{
    const user = jwt.verify(jwt_req, jwtSecretKey)
    if(user){ 
      const UserPageIds = UsersPages.find({id: user.id})
      if(UserPageIds.length > 0)
        UserPageIds.forEach((pageId)=>{
          const page = Pages.find({id: pageId.page_id})
          pages.append(page)
        })
      res.end(JSON.stringify({"result": "success", "pages": pages}))
    }else{
      res.end(JSON.stringify({"result": "failed"}))
    }
  }
  catch(err){
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})

app.post('/api/websites/add', (req, res)=>{
  const jwt_req = req.body.jwt;
  try{
    const user = jwt.verify(jwt_req, jwtSecretKey)
    if(user){
      const page_name = req.body.page_name;
      new_page = new Pages({name: page_name, html: ""})
      new_page.save()
      const page_id = new_page.id
      const user_id = user.id
      new_users_page = new UsersPages({user_id: user_id, page_id: page_id})
      new_users_page.save()
    }
    else{
      res.end(JSON.stringify({"result": "failed"}))
    }
  }
  catch(err){
    res.end(JSON.stringify({"result": "failed", "error": err[message]}))
  }
})