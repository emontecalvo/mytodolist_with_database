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


app.post('/create-todo', (req, res) => {
  console.log('create-todo called')
  console.log(req.body)
  let todo = new Todo()
  todo.name = req.body.name
  todo.createdAt = Date.now()

  todo.save(err => {
    if (err) {console.error(err); return res.sendStatus(500);}

      res.json({msg: 'Todo added successfully to the database'})
  })
})







function run_server() {
	app.listen(PORT, HOST, err => {
		if (err) return console.error(err);
		console.log(`Listening on port ${PORT}`);
	});
}

if (require.main === module) run_server();


