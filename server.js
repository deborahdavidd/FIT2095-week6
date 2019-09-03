let express = require('express');
let app = express();

//setting up the view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("img"));

var filePath = __dirname + "/views/";

//setting up mongo db
//let mongodb = require('mongodb');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('fi2095week6');
    }
});

app.get("/", function(req, res){
    let fileName = filePath + "index.html";
    res.sendFile(fileName);
});

app.get("/addTask", function(req, res){
    let fileName = filePath + "addtask.html";
    res.sendFile(fileName);
})

app.get("/listTask", function(req, res){
    //let fileName = filePath + "listtasks.html";
    //res.sendFile(fileName);
    db.collection('tasks').find({}).toArray(function(err, data){
        res.render('listtasks.html', {database:data});
    })
    
})
app.get("/deleteTask", function(req, res){
    let fileName = filePath + "deletetask.html";
    res.sendFile(fileName);
})

app.get('/deleteAllTasks', function(req, res){
    db.collection('tasks').deleteMany({}, function(err, obj){
        console.log(obj.result);
    })
    res.redirect('/listTask');

})

app.get('/update', function(req, res){
    let fileName = filePath + "update.html";
    res.sendFile(fileName);
})

app.post('/updateStatus', function(req,res){
    let taskDetails = req.body;
    console.log(taskDetails.ID);
    let newStatus = taskDetails.status;
    db.collection('tasks').updateOne({taskid: parseInt(taskDetails.ID)}, {$set:{status:newStatus}});
    res.redirect('/listTask');
})

//saving the data to the database
app.post('/addNewTask', function (req, res) {
    let taskDetails = req.body;
    //let arrlength = taskIDs.length;
    let taskID =  Math.floor(Math.random()*1000000) + 1;
    db.collection('tasks').insertOne({taskid:taskID, name: taskDetails.taskname, duedate: taskDetails.duedate, desc: taskDetails.description, assignedto: taskDetails.assignto, status: taskDetails.status});
    res.redirect('/listTask');
})

app.post('/deleteSpecifiedTask', function(req, res){
    let taskDetails = req.body;
    console.log(taskDetails.ID);
    db.collection('tasks').deleteOne({taskid: parseInt(taskDetails.ID)});
    res.redirect('/listTask');
})

app.listen(8080);

