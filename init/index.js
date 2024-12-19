const mongoose = require("mongoose");
const initdata= require("./data.js");
const Listing=require("../models/listing.js");

mongo_url='mongodb://127.0.0.1:27017/wonderlust';

main()
.then((res)=>{
    console.log("connection successull");
}).catch((err)=>{
    console.log(err)
})



async function main (){
    await mongoose.connect(mongo_url);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>
    ({...obj, owner:"6759ca27d45aa5a9f1ddcec9"}));
    await Listing.insertMany(initdata.data);
    console.log("data saved");
}

initDB();