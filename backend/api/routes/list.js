const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const List = require('../../model/list');
const Authentication = require('../../middleware/Authentication');

const multer = require('multer');
const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, './uploads')
    },
    filename : function (req, file, cb) {
        // cb(null, new Date().toISOString() + file.originalname)
        cb(null, file.originalname)
    }
})

const filterFile = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits:{
        fileSize : 1024 * 1024 * 5
    },
    filterFile: filterFile
})

//getting all todos
router.get('/', Authentication, async (req, res) =>{
    try {
        const todo = await List.find({},{"name": "$title", "detail" : "$description", "request" : {"type" : "GET"}})
        res.status(200).json({
                count : todo.length,
                todo
        })
    } catch (error) {
        res.status(300).json({message: error.message})
    }
})

//getting todos by id
router.get('/:listId', Authentication, async (req, res) =>{
    const id = req.params.listId;
    try{
        //change schema objects to different object name
        const result = await List.findById(id,{"name": "$title", "detail" : "$description"});
        res.json(result)
    }
    catch(error){
        res.status(404).json({message: 'Invalid ID'})
    }
})

//update todos by id
router.patch('/:listId', Authentication, async (req, res) =>{
    const { listId } = req.params;
    try {
        const result = await List.findOneAndUpdate({_id : listId},{...req.body}, {new : true});
        res.status(200).json({
            result,
            message: "Todo Updated"
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})

//adding todos route
router.post('/addTodo', upload.single('pathImage'), Authentication, async (req, res, next) =>{
    const { title, description } = req.body;
    const pathImage  = req.file.path;
    // console.log(req.file);
    try {
        const todo = await List({title, description, pathImage}).save();
        res.send(todo);
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete todo by id route
router.delete('/:listId', Authentication, async (req, res) =>{
   const { listId } = req.params;
   try {
       const result = await List.deleteOne({_id : listId})
       res.status(200).json({
           message: "Todo Deleted"
        })
   } catch (error) {
       res.status(404).json({message: error.message})
   }
})

//deleting all todos
router.delete('/deleteAll', Authentication,async (req, res) =>{
    try{
        const result = await List.deleteMany()
        res.status(200).json({
            result,
            message: "All todos Deleted"
        })
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

module.exports = router;