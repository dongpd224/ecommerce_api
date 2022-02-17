const express = require('express')
const morgan = require('morgan')
const app = express()



const fs = require("fs")
const path = require('path')
const pathToFile = path.resolve("./items.json")

const getItems =()=> JSON.parse(fs.readFileSync(pathToFile))

// HTTP logger
app.use(morgan('combined'));
// Phiên dịch json được đổ về từ API 
app.use(express.json())

// Set route
app.get("/api/items",(req,res)=>{
  const items = getItems()
  res.send(items)
})
app.get("/",(req,res)=>{
  res.send("Hello World")
})

// Route to path
app.get("/api/items/:id",(req,res)=>{
  const items = getItems()
  const {id} = req.params
  const item = items.find( item => item.id === id )
  res.send(item)
})
// post request
app.post("/api/items",(req,res)=>{
  const items = getItems()
  const item = req.body
  item.id = Date.now().toString()
  items.push(item)

  fs.writeFile(pathToFile, JSON.stringify(items,null,2),(error) =>{
      if(error){
          return res.status(422).send("Cannot store data in the file!")
      }
      return  res.send(items) 
  })

 
})
app.listen(process.env.PORT || 3001, () => {
  console.log(`listening at`, this.address().port, app.settings.env)
})