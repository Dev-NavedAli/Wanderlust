const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,       //joining backend to cloudinary 
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',   //ye naam ka folder chaiye cloudinary pr
        allowedFormats: ["png","jpg","jpeg"],  //ye type supported rahe hamare
    },
});

module.exports = {
    cloudinary,
    storage          //yha se ham dono files ko export kr dnge joki use hongi listing.js me 
}