const mongoose = require('mongoose');

//list schema 
const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    pathImage : {
        type: String,
        required: true
    }
},{ timestamps: true })
//timestamps for createdAt and updatedAt
module.exports = mongoose.model("list", ListSchema);