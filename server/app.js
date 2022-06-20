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
const sitesSchema = mongoose.Schema({
  name: String,
})
const sitesRoutesSchema = mongoose.Schema({
  site_id: {type: mongoose.Schema.Types.ObjectId, ref: "sites"},
  route_id: {type: mongoose.Schema.Types.ObjectId, ref: "routes"}
})
const routesSchema = mongoose.Schema({
  name: String,
  html: String
})
const userSitesSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
  site_id: {type: mongoose.Schema.Types.ObjectId, ref: "sites"}
})
const routeElementsSchema = new mongoose.Schema({
  route_id: {type: mongoose.Schema.Types.ObjectId, ref: "routes"},
  element_id: {type: mongoose.Schema.Types.ObjectId, ref: "elements"}
})
const elementsSchema = new mongoose.Schema({
  elements: String
})

Users = mongoose.model('users', usersSchema);
Sites = mongoose.model('sites', sitesSchema);
SitesRoutes = mongoose.model('sites_routes', sitesRoutesSchema);
Routes = mongoose.model('routes', routesSchema);
UsersSites = mongoose.model('users_sites', userSitesSchema);
RoutesElements = mongoose.model('routes_elements', routeElementsSchema)
Elements = mongoose.model('elements', elementsSchema)


const jwtSecretKey = "superSecretKey"

app.listen(port, () => `Server running on 127.0.0.1/${port}`);

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

app.post('/api/websites', async (req, res)=>{
  try{
    const jwt_req = req.body.jwt;
    const user = jwt.verify(jwt_req, jwtSecretKey)
    if(user){ 
      const UserSiteIds = await UsersSites.find({"user_id": user.id})
      var pages = []
      if(UserSiteIds.length > 0){
        for(i=0; i<UserSiteIds.length; i++){
          var page = await Sites.findOne({"_id": UserSiteIds[i].site_id})
          pages.push(page)
        }
      }
      console.log(pages)
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
  try{
    const jwt_req = req.body.jwt;
    const user = jwt.verify(jwt_req, jwtSecretKey)
    if(user){
      const site_name = req.body.site_name;
      new_site = new Sites({name: site_name})
      new_site.save()
      const new_route = new Routes({name: "index", html: ""})
      new_route.save();
      const new_site_route = new SitesRoutes({site_id: new_site.id, route_id: new_route.id})
      new_site_route.save();
      const new_user_sites = new UsersSites({user_id: user.id, site_id: new_site.id})
      new_user_sites.save();
      res.end(JSON.stringify({"result": "success", "site_id": new_site.id}))
    }
    else{
      res.end(JSON.stringify({"result": "failed"}))
    }
  }
  catch(err){
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})

app.post('/api/getUserData', async (req, res)=>{
  try{
    const jwt_req = req.body.jwt;
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

app.post("/api/getSite", async (req, res)=>{
  try{
    const site_id = req.body.site_id;
    const site = await Sites.findOne({"_id": site_id})
    const site_routes = await SitesRoutes.find({"site_id": site_id})
    var routes = []
    for(i=0; i<site_routes.length; i++){
      routes.push(await Routes.findOne({"_id": site_routes[i].route_id}))
    }
    res.end(JSON.stringify({"result": "success", "site": site, "routes": routes}))
  }
  catch(err){
    console.log(err)
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})
app.post("/api/websites/routes/add", async (req, res)=>{
  try{
    const site_id = req.body.site_id
    const route_name = req.body.route_name
    const new_route = new Routes({"name": route_name, "html": ""})
    new_route.save()
    const new_site_routes = new SitesRoutes({"route_id": new_route._id, "site_id": site_id})
    new_site_routes.save()
    res.end(JSON.stringify({"result": "success"}))
  }
  catch(err){
    console.log(err)
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})
app.post("/api/websites/routes/elements", async (req, res) => {
  try{
    const route_id = req.body.route_id;
    const routes_elements = await RoutesElements.find({"route_id": route_id})
    var elements = []
    for(i=0; i<routes_elements.length; i++){
      elements.push(await Elements.findOne({"_id": routes_elements[i].element_id}))
    }
    res.end(JSON.stringify({"result": "success", "elements": elements}))
  }
  catch(err){
    console.log(err);
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})

app.post("/api/websites/routes/elements/add", async (req, res)=>{
  try{
    const cur_route_id = req.body.cur_route_id;
    const element_data = req.body.element_data;

    const new_element = new Elements({"elements": JSON.stringify(element_data)})
    await new_element.save()
    var elements = JSON.parse(new_element.elements)
    elements.db_id = new_element._id
    await Elements.findOneAndUpdate({"_id": new_element.id}, {"elements": JSON.stringify(elements)})

    const new_route_element = new RoutesElements({"route_id": cur_route_id, "element_id": new_element._id})
    await new_route_element.save()

    const cur_element = await Elements.findOne({"_id": new_element._id})

    res.end(JSON.stringify({"result": "success", "element": cur_element}))
  }
  catch(err){
    console.log(err)
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})

app.post("/api/websites/routes/elements/save", async (req, res)=>{
  
  try{
    const elements = req.body.elements;
    for(var i=0; i<elements.length; i++){
      const element = elements[i]
      console.log(element)
      const el_in_db = await Elements.findOne({"_id": element.db_id})
      el_in_db.elements = JSON.stringify(element);
      el_in_db.save()
      res.end(JSON.stringify({"result": "success"}))
    }
    
  }
  catch(err){
    console.log(err)
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})
app.post("/api/websites/routes/elements/remove", async (req, res)=>{
  try{
    const element = req.body.element;
    const el = await Elements.findOne({"_id": element.db_id})
    console.log("ROMOVING: " + el)
    await Elements.deleteOne({"_id": element.db_id})

    await RoutesElements.deleteOne({"element_id": element.db_id})
    res.end(JSON.stringify({"result": "success"}))
  }
  catch(err){
    console.log(err)
    res.end(JSON.stringify({"result": "failed", "error": err}))
  }
})