const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    Description : String,
    todo:{
        type : mongoose.Types.ObjectId,
        ref : 'list',
        required: true
    } 
}, {timestamps: true})

module.exports = mongoose.model('task', TaskSchema);