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
        sport: 'Volleyball',
        location: 'CMRC'
    },
    {
        sport: 'Basketball',
        location: 'CRMC'
    },
    {
        sport: 'Soccer',
        location: 'YMCA'
    }
]

// Api request to receive all events
app.get("/api/v1/sport", async (req,res) => {
    console.log("got db request - processing")
    acceptHeader = req.header('Accept')
    if (acceptHeader.includes('json')) {
        e = await db_Handler()
        if (e) {
            res.status(200).json(databaseSeeds)
        } else {
            res.status(500).json(e)
        }
    } else if (acceptHeader.includes('plain')) {
        res.set('Content-Type', 'text/html')
        res.status(200).send(databaseSeeds)
    } else {
        res.status(412).json({error : "Invalid Accept Header"})
    }
    return
})

const { Open, Close } = require('./docs/db/connection')
const { Read } = require('./docs/db/db')

async function db_Handler(){
    db_host = process.env.db_host
    db_name = process.env.db_name
    db_conn = process.env.db_conn
    db_user = process.env.db_user
    db_pwd = process.env.db_pwd

    console.log(`opening DB connection to ${db_name} under username ${db_user}`)
    try {
        //  connect to postgres DB here
        const pool = await Open(db_conn, db_host, db_name, db_user,db_pwd)
        
        console.log('sending query')
        const response = await Read(pool)
        console.log('response of query:', response)

        Close(pool)
        console.log("finished!")
        return pool
    } catch (e) {
        return e
    }
}
