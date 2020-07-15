var db = require('./db');
// var cors = require('cors');
var bodyParser = require('body-parser');
global.__root = __dirname + '/';

var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var User = require('./User');
var bcrypt = require('bcryptjs');
var http = require('http').createServer(app);

var io = require('socket.io')(http);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api', function (req, res) {
    res.status(200).send('API works.');
});

app.post('/register', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        fullname: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username
    },
        function (err, user) {
            if (err) return res.status(500).send({status: "Error"});

            return res.status(200).send({status:"Success"});

        });
});

async function checkUsername(userObject, id, callback) {
    var response;

    try {
        var user = await User.findOne({ username: userObject.username });

        response = {
            username: userObject.username,
            available: !!!user
        }

    }
    catch (err) {
        console.log("error occurred", err.message);
        response = {
            error: err.message
        }
    }
    callback(null, { response, receiverId: id });

}

io.use(
    function (socket, next) {
        socket.on('username_check', (userObject) => {
            checkUsername(userObject, socket.id, (err, result) => {
                io.to(result.receiverId).emit('username_check', result.response);
            })

        });
        next();
    })

io.on('connection', (socket, next) => {
    console.log('a user connected ');
});

http.listen(4000, () => {
    console.log('listening on *:4000');
});