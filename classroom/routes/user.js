const express = require("express");
const router = express.Router();

//Index -users
router.get("/",(req,res)=>{
    res.send("GET users");
})

//Show -users
router.get("/:id",(req,res)=>{
    res.send("GET for show  users");
})

//Post -users
router.post("/",(req,res)=>{
    res.send("Post for users");
})

//Delete for -users
router.delete("/:id",(req,res)=>{
    res.send("delete for users");
});

module.exports = router;