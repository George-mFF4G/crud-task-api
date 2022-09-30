const express=require('express');
const app=express();
const mongoose=require('./database/mongoose');
const TaskList=require('./database/models/taskList');
const Task = require('./database/models/task');
const { response } = require('express');
/*
cors -cross origin request security
backend-http://localhost:3000
frontend-http://localhost:4200
*/
//3rd party library ,app.use(cors());
//add headers
app.use((req,res,next)=>{
//website you wish to allow to connect 
// res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
res.setHeader('Access-Control-Allow-Origin','*');
//request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
//request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers','Origin','X-Requested-With,content-type');
//set to true if you need the website to include cookies in the requests sent
//to the API{e.g. in case you use sessions}
// res.setHeader('Access-Control-Allow-Credentials',true);
//pass to next layerof middleware
next();
});
//examples of middleware
app.use(express.json());// or 3rd party body parser

//routes of rest api end points or restfulwebservices end points
/** 
 * tasklist - create ,update ,read task list by id ,read all task list
 * task - create ,update ,read task  by id ,read all task 
 */
//routes of api end points for task list model 
//get all tasklists 
//http://localhost:3000/tasklists =>[{},{}]
app.get('/tasklists',(req,res)=>{
TaskList.find({})
.then((lists)=>{res.status(200).send(lists);})
.catch((error)=>{console.log(error);
  res.status(500);});
});
// get one tasklist by id
app.get('/tasklists/:tasklistId',(req,res)=>{
  let taskLsitId=req.params.tasklistId;
  TaskList.find({_id:taskLsitId})
  .then((taskList)=>{res.status(200).send(taskList);})
  .catch((error)=>{console.log(error);
    res.status(500);});
  });
//route or end point for creating tasklist
app.post('/tasklists',(req,res)=>{
let taskListObj={'title':req.body.title};
TaskList(taskListObj).save()
.then((taskList)=>{
  res.status(201).send(taskList);
})
.catch((error)=>{console.log(error);
res.status(500);});
  // TaskList= new TaskList({taskListObj});
});
// put is full update of object
app.put('/tasklists/:tasklistId',(req,res)=>{
  let taskLsitId=req.params.tasklistId;
  TaskList.findOneAndUpdate({_id:taskLsitId},{$set:req.body})
  .then((taskList)=>{res.status(200).send(taskList);})
  .catch((error)=>{console.log(error);
    res.status(500);});
  });
// patch is partial update of one field of an object
  app.patch('/tasklists/:tasklistId',(req,res)=>{
    let taskLsitId=req.params.tasklistId;
    TaskList.findOneAndUpdate({_id:taskLsitId},{$set:req.body})
    .then((taskList)=>{res.status(200).send(taskList);})
    .catch((error)=>{console.log(error);
      res.status(500);});
    });
  // delete a tasklist
  app.delete('/tasklists/:tasklistId',(req,res)=>{
    let taskLsitId=req.params.tasklistId;
    // delete all tasks withing a tasklist if that tasklist is deleted
    const deletAllContainigTask =(taskList)=>{
Task.deleteMany({_taskListId:taskLsitId})
.then(()=>{
return taskList
})
.catch((error)=>{
console.log(error);
});
    };
    const responseTaskList=TaskList.findByIdAndDelete(taskLsitId)
    .then((taskList)=>{
      deletAllContainigTask(taskList);
      })
    .catch((error)=>{console.log(error);
      res.status(500);});
      res.status(200).send(responseTaskList);
    });
/*
crud operation for task, a task should always belong to a tasklist
*/
// get all tasks for 1 tasklist, http://localhost:3000/tasklists/:taskistId/tasks
app.get("/tasklists/:tasklistId/tasks",(req,res)=>{
Task.find({_taskListId:req.params.tasklistId})
.then((tasks)=>{
res.status(200).send(tasks);
})
.catch((error)=>{console.log(error)});
});
// create a task inside a particular tasklist
app.post('/tasklists/:tasklistId/tasks',(req,res)=>{
  let taskObj={'title':req.body.title,'_taskListId':req.params.tasklistId};
  Task(taskObj).save()
  .then((task)=>{
    res.status(201).send(task);
  })
  .catch((error)=>{console.log(error);
  res.status(500);});
    // TaskList= new TaskList({taskListObj});
  });
// http://localhost:3000/tasklists/:taskistId/tasks/:taskId
// get 1 task inside 1 tasklist
app.get("/tasklists/:tasklistId/tasks/:taskId",(req,res)=>{
  Task.findOne({_taskListId:req.params.tasklistId,_id:req.params.taskId})
  .then((task)=>{
  res.status(200).send(task);
  })
  .catch((error)=>{console.log(error)});
  });
// update 1 task belonging to 1 tasklist
app.patch('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
  let taskLsitId=req.params.tasklistId;
  Task.findOneAndUpdate({_taskListId:taskLsitId, _id:req.params.taskId},{$set:req.body})
  .then((task)=>{res.status(200).send(task);})
  .catch((error)=>{console.log(error);
    res.status(500);});
  });
  // delete 1 task belong to 1 tasklist
  app.delete('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
    let taskLsitId=req.params.tasklistId;
    Task.findByIdAndDelete({_taskListId:taskLsitId, _id:req.params.taskId})
    .then((task)=>{res.status(201).send(task);})
    .catch((error)=>{console.log(error);
      res.status(500);});
    });
app.listen(3000,()=>{
  console.log("server started on port 3000!");
});