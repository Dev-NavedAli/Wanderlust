const mongoose = require("mongoose");
const initData = require('./data.js');
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
    .then(()=>{
    console.log("connected to Db")
    })
    .catch(err =>{
        consol.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"65bdf41a00626d17fc954c76"})); //iski madad se har ek object ke andar hum owner property lo add kr lenge
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDB();