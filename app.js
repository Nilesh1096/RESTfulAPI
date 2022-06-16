const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const { Schema, Types } = mongoose;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://cluster0.fqzlw.mongodb.net/NewTestDB");

const date = new Date

const arr = []

const taskSchema = {

  Title : String,
  Message : String,
  Timestamp : String,
  categoryName : String
};

const categorySchema = {
  categoryName : String,
  tasks : [taskSchema]
};

const Task = mongoose.model("Task", taskSchema);
const Category = mongoose.model("Category", categorySchema);

app.route("/tasks")

.get(function(req,res){
  Category.find(function(err,foundTask){
    if(!err){
      res.send(foundTask);
    } else {
      res.send(err);
    }

  });
})

.post(function(req,res){

  const newTask = new Task({
    Title : req.body.title,
    Message : req.body.message,
    Timestamp : date,
    categoryName : req.body.categoryName
  });

  newTask.save();

  const newCategory = new Category({

    categoryName : newTask.categoryName,
    tasks : newTask
  });



  newCategory.save(function(err){
    if(!err){
      res.send("Successfully added a new Task")
      console.log(newTask)
    }else{
      res.send(err)
    }
  });
})

.delete(function(req,res){
  Task.deleteMany(function(err){
    if (!err){
      res.send("Deleted all Tasks")
    } else{
      res.send(err)
    }
  });
  Category.deleteMany(function(err){
    if (!err){
      res.send("Deleted all Tasks")
    } else{
      res.send(err)
    }
  });
});

 ////targetting a specific Task////

 app.route("/task/:taskTitle")

 .get(function(req,res){
   Task.findOne({Title: req.params.taskTitle},function(err,foundTask){
     if(foundTask){
       res.send(foundTask)
     }
     else{
       res.send("no task found")
     }
   });
 })

.put(function(req,res){
  Task.findOneAndUpdate(
    {Title: req.params.taskTitle},
    {Title: req.body.title, Message: req.body.message, Timestamp: date, categoryName:req.body.categoryName},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated Task.");
      }else {
        console.log(err);
      }
    }
  )
})

.patch(function(req,res){
  Task.findOneAndUpdate(
    {Title: req.params.taskTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated Task.");
      }else {
        console.log(err);
      }
    }
  )
})

.delete(function(req,res){
  Task.findOneAndDelete(
    {Title: req.params.taskTitle},
    function(err,foundArticle){
      if(foundArticle){
        res.send("Task deleted")
      }else{
        res.send(err)
      }
    }
  )
});

// app.get("/getallcategories",function(req,res){
//   Task.countDocuments().then((count_documents) => {
//   var count = count_documents;
//   }).catch((err) => {
//     console.log(err.Message);
//   })
//   var id = JSON.stringify(Category)
//   console.log(id);
// })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


// Felix Omuok1:05 PM
// Task :
//
// A basic to-do app where we can
// - Create a new task*
// - Edit task
// - Delete task
// - See list of all created tasks
//
// *Creating new task
// Title : ABC
// Message : Hello world.
// Timestamp : new Date(),
// categoryName : note, todo, plan,
//
// There should be 2 collections
// tasks, Categories,
// which should be connected through the key categoryName.
//
// Q. Also get count of all categories wise tasks from db. (from both collections)
// Felix Omuok2:02 PM
// [
//   {
//     id: "Categor 1",
//     taskCount: 12
//   },
//   {
//     id: "Categor 2",
//     taskCount: 7
//   },
// ];
// getallcategories
