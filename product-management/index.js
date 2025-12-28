const mongoose = require('mongoose')
const express = require('express')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')

const app = express()
app.use(express.json())

mongoose
    .connect("mongodb://localhost:27017/e-commerence")
    .then(()=>{
        app.listen(3000, ()=>{
            console.log("Connected to MongoDB, Express running now")
        })
    })
    .catch((error)=>{
        console.log(Error, error)
    })

const cors = require('cors')

const corsHandler = cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true
})

app.use(corsHandler)

app.use("/manage", productRoutes)
app.use("/categories", categoryRoutes)
app.use("/user", userRoutes)
app.use("/order", orderRoutes)
app.use("/cart", cartRoutes)