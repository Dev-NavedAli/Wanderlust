const express = require("express");
const router = express.Router();

//Post
//Index
router.get("/",(req,res)=>{
    res.send("GET posts");
})

//Show 
router.get("/:id",(req,res)=>{
    res.send("GET for show  posts");
})

//Post
router.post("/",(req,res)=>{
    res.send("Post for posts");
})

//Delete 
router.delete("/:id",(req,res)=>{
    res.send("delete for posts");
})

module.exports = router;
