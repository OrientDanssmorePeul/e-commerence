const mongoose = require('mongoose')
const express = require('express')
const productRoutes = require('./routes/productRoutes')

const app = express()
app.use(express.json())

mongoose
    .connect("mongodb://localhost:27017/mongoose-mvc")
    .then(()=>{
        app.listen(3000, ()=>{
            console.log("Connected to MongoDB, Express running now")
        })
    })
    .catch((error)=>{
        console.log(Error, error)
    })

app.use("/manage", productRoutes)