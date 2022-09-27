const mongoose =require('mongoose');
const TaskListSchema=new mongoose.Schema({
title:{
    type:String,
    trim:true,
    minLength:3
}
// ,name:{
//     type:String,
//     trim:true,
// }
});
const TaskList =mongoose.model('TaskList',TaskListSchema);

module.exports =TaskList;