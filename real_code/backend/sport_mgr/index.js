// For more CORS information: https://stackabuse.com/handling-cors-with-node-js/ 
// 
const express = require("express")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 9000

const cors = require('cors');

app.use(cors());

app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})

app.get("/",(req,res)=>{
    return res.status(200).json({service : "gh-sport-mgr"})
})

app.get("/api/v1/healthz",(req,res)=>{
    acceptHeader = req.header('Accept')
    if (acceptHeader.includes('json')) {
        res.status(200).json({status : "Ok"})
    } else if (acceptHeader.includes('plain')) {
        res.set('Content-Type', 'text/html')
        res.status(200).send("Health: Ok")
    } else {
        res.status(412).json({error : "Invalid Accept Header"})
    }
    return
})

const databaseSeeds = [
    {
        sport: 'volleyball',
        location: 'CMRC'
    },
    {
        sport: 'basketball',
        location: 'CRMC'
    },
    {
        sport: 'soccer',
        location: 'YMCA'
    }
]

// Api request to receive all events
app.get("/api/v1/db", (req,res) => {
    console.log("got db request - processing")
    acceptHeader = req.header('Accept')
    if (acceptHeader.includes('json')) {
        res.status(200).json(databaseSeeds)
    } else if (acceptHeader.includes('plain')) {
        res.set('Content-Type', 'text/html')
        res.status(200).send(databaseSeeds)
    } else {
        res.status(412).json({error : "Invalid Accept Header"})
    }
    return
})
