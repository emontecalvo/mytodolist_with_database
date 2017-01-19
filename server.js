//NOTE: ES6 'import' statements cannot be used in the server - just use ES5
//syntax instead ('require'). Other ES6 features should all be available.
const express = require('express');

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static("build"));

const bodyParser = require('body-parser')
const mongoose   = require('mongoose')

const Todo = require('./models/todo')

mongoose.connect('mongodb://localhost:27017/todoapp');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())





app.get("/hello", (req, res) => {
	res.json({message: "Hello, world!"});
});





app.get('/todos', (req, res) => {
  Todo.find({}, (err, todos) => {
    if (err) {console.error(err); return res.sendStatus(500);}

    res.json(todos)
  })
})

app.delete('/todos/:todo_id', (req, res, next) => {
  console.log("delete from express");
  console.log("REQ dot BODY", req.body);
  console.log("* * * * * req PARAMS:",  req.params);
    Todo.findByIdAndRemove(req.params.todo_id, function(error, todo) {
    // if (error) return next(error);
    // if (count !==1) return next(new Error('Something went wrong.'));
    // console.info('Deleted task %s with id=%s completed.', req.body.name, req.task._id);
    // res.send(200);
    console.log("todo is", todo);
    var response = {
      message: "Todo successfully deleted",
      id: todo.todo_id
    };
    // res.send(response);
    Todo.find({}, (err, todos) => {
      if (err) {console.error(err); return res.sendStatus(500);}

      res.json(todos)
    })
  });
   // Todo.find({name: req.body.name}, function(err, data){
   //     console.log(data);
   //     Todo.remove

})


app.post('/create-todo', (req, res) => {
  let todo = new Todo()
  todo.name = req.body.name
  todo.createdAt = Date.now()

  todo.save(err => {
    if (err) {console.error(err); return res.sendStatus(500);}

      Todo.find(function(err, todos) {
        if(err) {
          res.send(err)
        } else {
          res.send(todos)
        }
      })
  })
})




function run_server() {
	app.listen(PORT, HOST, err => {
		if (err) return console.error(err);
		console.log(`Listening on port ${PORT}`);
	});
}

if (require.main === module) run_server();


