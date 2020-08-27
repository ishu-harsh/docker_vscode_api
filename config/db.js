const mongoose = require("mongoose")
const chalk = require("chalk")
const keys = require("./keys") 


mongoose.connect(keys.mongodb.dbURL, {useNewUrlParser: true, useUnifiedTopology: true 
}).catch(error => console.log(error));

mongoose.connection.on("error", (err)=>{
    console.log(chalk.red("Error While connecting to DB"))
})


mongoose.connection.on("connected", (err)=>{
    console.log(chalk.green("DB connected successfully"))
})
 
mongoose.connection.on("disconnect", (err)=>{
    console.log(chalk.yellow("DB Disconnected"))
})