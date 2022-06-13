const express = require('express');
const mongoose = require('mongoose');
const List = require('../../model/list');
const router = express.Router();
const Task = require('../../model/task')
const Authentication = require('../../middleware/Authentication')

//all task routes
router.get('/', Authentication, async (req, res) =>{
    try {
        const task = await Task.find()
        res.json({
            task
        })
    } catch (error) {
        res.json({message: error.message})        
    }
})

//getting task by id
router.get('/:taskId', Authentication, async (req, res) =>{
    const { taskId } = req.params;
    try {
        const task = await Task.findById({_id : taskId})
        res.json({
            task
        })
    } catch (error) {
        res.json({message: error.message})        
    }
})

//adding task
router.post('/addTask', Authentication, async (req, res) =>{
    const list = List.findById({_id : req.body.todoId})
    if(list){
        try {
            const task = await new Task({
            name: req.body.name,
            description: req.body.description,
            todo: req.body.todoId
        })
        task.save();
        res.json({
            task
        })
    } 
    catch (error) {
    
        res.json({message: error.message})        
    }}
    else{
        return res.status(404).json({
            message: "task not found"
        })

    }
})

//updating routes by id
router.patch('/update/:taskId', Authentication, async (req, res) =>{
    const { taskId } = req.params;
    try {
        const task = await Task.findOneAndUpdate({_id : taskId},{...req.body}, {new: true})
        res.json({
            task
        })
    } catch (error) {
        res.json({message: error.message})
    }
})

//delete task by id
router.delete('/delete/:taskId', Authentication, async(req, res) =>{
    const { taskId } = req.params;
    try {
        const task = await Task.deleteOne({_id : taskId})
        res.json({
            task
        })
    } catch (error) {
        res.json({
            message: error.message
        })        
    }
})

//delete all task
router.delete('/deleteAll', Authentication, async (req, res) =>{
    try {
        const task = await Task.deleteMany();
        res.json({
            task
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = router;