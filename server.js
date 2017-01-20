const express = require('express');

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static("build"));

const bodyParser = require('body-parser')
const mongoose   = require('mongoose')

// auth

const bcrypt = require('bcryptjs');
const passport = require('passport');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/user');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

dotenv.load();

console.log(`Server running in ${process.env.NODE_ENV} mode`);
//

const Todo = require('./models/todo')

mongoose.connect('mongodb://localhost:27017/todoapp');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// ****************************************** AUTHENTICATION

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//// START GOOGLE AUTH STRAT ////
console.log({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth-google-callback'
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth-google-callback'
},
(accessToken, refreshToken, profile, callback) => {
    User.find({ googleId: profile.id }, (err, user) => {
            // once we authorize, populate the todos array for user
            if (!user.length) {
                const todosArray = [];
                Todo.find((err, todos) => {
                    todos.forEach((todo) => {
                        todosArray.push({
                            todoId: todo._id,
                            name: todo.name,
                            createdAt: todo.createdAt
                        });
                    })

                    User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        accessToken: accessToken,
                        todos: todosArray
                    }, (err, user) => {
                        // console.log(user);
                        return callback(err, user);
                    });
                });
            } else {
                return callback(err, user[0]);
            }
        })
    }
));
//// END GOOGLE AUTH STRAT ////

//// START BEARER STRAT ////
passport.use(new BearerStrategy(
    (token, done) => {
        User.findOne({accessToken: token}, (err, user) => {
            if (err) {
                console.log(err);
                return done(null, false);
            }          
            return done(null, user);
        });
    }
));
//// END BEARER STRAT ////

//// START AUTH REQUESTS ////
app.get('/auth/google', passport.authenticate('google', {scope:['profile']}));
    
app.get('/auth-google-callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }), (req, res) => {
    fs.readFile('./client/index.html', (err, html) => {
        if (err) {
            return res.status(400).json(err);
        }
        console.log("I AM HERE");
        html = html.toString().replace('<!--auth_token-->', 
            `<script>
                const TOKEN="${req.user.accessToken}";
                history.replaceState(null, null, "/#/todos");
             </script>`);
        res.send(html);
    });
  }
);
//// END AUTH REQUESTS ////

//// START USERS ////
app.get('/users', (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.status(200).json(users);
    });
});

app.delete('/:userId', (req, res) => {
    const userId = req.params.userId;
    User.findByIdAndRemove(userId, (err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.status(200).json(user);
    });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
//// END USERS ////




// ****************************************** END OF AUTHENTICATION





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


