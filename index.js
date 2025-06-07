const express = require("express");
const app = express();
const port = process.env.PORT||8000
const con = require("./db/conn")
const cors = require("cors")
const route = require("./routes/route")

app.use(cors())
app.use(express.json())
app.use(route)

app.listen(port,()=>{
    console.log(`Connected to port ${port}`)
})
con()