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
    Todo.findByIdAndRemove(req.params.todo_id, function(error, todo) {
    var response = {
      message: "Todo successfully deleted",
      id: todo.todo_id
    };
    Todo.find({}, (err, todos) => {
      if (err) {console.error(err); return res.sendStatus(500);}

      res.json(todos)
    })
  });
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

app.put('/edittodos/:todo', function (req, res) {
  console.log("req body", req.body);
  console.log("~~~~~~ req params", req.params);
  Todo.findById(req.body.item._id, function (err, todo) {
 
    if (err) {
        res.status(500).send(err);
    } else {
        todo.name = req.body.item.name || todo.name;
        console.log("todo name is", todo.name);
        todo.save(function (err, todo) {
            if (err) {
                res.status(500).send(err)
            }
            console.log("********todo is", todo)
            res.send(todo);
        });
    }
  });
})

function run_server() {
	app.listen(PORT, HOST, err => {
		if (err) return console.error(err);
		console.log(`Listening on port ${PORT}`);
	});
}

if (require.main === module) run_server();


