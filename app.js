const express=require('express');
const cors=require('cors')
const mongo=require('mongodb')
const bcrypt=require('bcryptjs')
const mongoclient=mongo.MongoClient
const app=express()
app.use(express.json())
app.use(cors({
  orgin:"*"
}))

url="mongodb+srv://bhavy:bhavya2000@cluster0.0bfdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
app.get('/',function(req,res){
  res.json({
    msg:"success"
  })
})
app.post('/user/register',async function(req,res){
  try{
    //console.log("&&&",req.body)
    let conn=await mongoclient.connect(url)
    let db=conn.db("userdb");
    let salt=await bcrypt.genSalt(10)
    let hash=await bcrypt.hash(req.body.password,salt)
    req.body.password=hash
    await db.collection("user").insertOne(req.body)
    await conn.close()
    res.json({
      msg:"registration success"
    })
  }
  catch(err)
  {
    res.status(404).json({
      msg:"error"
    })
  }
})

app.post('/user/login',async function(req,res){
  let conn=await mongoclient.connect(url);
  let db=conn.db("userdb")
  console.log(req.body)
  let user=await db.collection("user").findOne({email:req.body.email})
  console.log(user)
  if(user==null){
    console.log("user not found")
    res.status(401).json({
      msg:"user not found"
    })
  }
  else{
    let resu=await bcrypt.compare(req.body.password,user.password)
    console.log(resu)
    if(resu)
    {console.log("loggedin")
      res.json({
        msg:"logged in successfully"
      })
    }
    else{
      console.log("invalid password")
      res.status(401).json({
        msg:"invalid password"
      })
    }
  }
})

var port=process.env.PORT||3000
app.listen(port,function(){
  console.log(`server running at port ${port}`)
})
