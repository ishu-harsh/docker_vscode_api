const express = require("express")
const chalk = require("chalk")
// var db = require("./config/db")
const os = require("os")
const { exec } = require('child_process');
var cors = require('cors')
const jwt = require("jsonwebtoken")
const key = require('./config/keys');
const { jwtSecret } = require("./config/keys");
const { json } = require("express");


const app = express()
const port = 5000


app.use(express.json())
app.use(express.urlencoded({extended : false ,limit : "2m" }))
app.use(cors())


app.get('/getAuth/:userName', (req, res) =>{
    console.log(req.params.userName)
     let  token =  jwt.sign({userName  : req.params.userName},key.jwtSecret )
     
    res.status(200).json({
        token : token
    })
})

var checkAuth =  function (req , res , next) {
    jwt.verify(req.body.token, jwtSecret ,function(err, decoded) {

        if (err){
            res.status(401).json({
                message : "Unauthorized"
            })
        }
        if(decoded.userName === req.body.userName){
            next()

        }else{
        res.status(401).json({
            message : "Unauthorized1"
        })}
        console.log(decoded.userName) 
        console.log(req.body.userName) 
      }) 
}


app.post("/createVscode",checkAuth , (req , res)=>{
    console.log(req.body)
    let dataObj = {
        vscodePort : req.body.vscodePort,
        extraPort1 : req.body.extraPort1,
        extraPort2 : req.body.extraPort2,
        userPassword : req.body.userPassword, 
        userName :  req.body.userName
    }


    var cmd = `docker run  --rm -d -p ${dataObj.vscodePort}:8080 -p ${dataObj.extraPort1}:${dataObj.extraPort1} -p ${dataObj.extraPort2}:${dataObj.extraPort2}  -v ${dataObj.userName}:/home/coder/work:rw --name ${dataObj.userName} -e PASSWORD=${dataObj.userPassword}  --hostname ${dataObj.userName} ishu0824/vscode:1v`
    exec(cmd, (err, stdout, stderr) => {
        if (stdout) {
          return res.status(200).json({
             containerId : stdout,
             message : "Successfully Created"
          })
        }
        if (stderr){
            return res.status(500).json({
                error : stderr
             })
            
        } else {
         res.status(500).json({
            error : err,
            message : "Error from server end"
         })
         console.error(err)
         return
        }
      });

})


app.post('/removeVscode',checkAuth, (req,res)=>{
    console.log(req.body)
    let dataObj  = {
        userName : req.body.userName
    }  

    var cmd = `docker rm -f ${dataObj.userName}`
    exec(cmd, (err, stdout, stderr) => {
        if (stdout) {
          //some err occurred
          return res.status(200).json({
             containerId : stdout,
             message : "Successfully Removed Container"
          })
        }
        if (stderr){
            return res.status(500).json({
                error : stderr
             })
            
        } else {
         // the *entire* stdout and stderr (buffered)
         res.status(500).json({
            error : err,
            message : "Error from server end"
         })
         console.error(err)
         return
        }


      });

     
})








app.listen(port , ()=>{
    console.log(chalk.blue(`Server listening on ${port}`))
})