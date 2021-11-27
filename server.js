const express = require('express');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt")

const app = express();
const port = process.env.PORT || 3000;


const saltRounds = 10;

const connection = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    port: 3306,
    database: 'testDB',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')))

app.use(session({
    secret: 'TUY8PCnx6R%ZMv2eXLzxaEK6FiKFVugzBMxYwSXfjKhkoufpVfPX9UJ&CsqQa7j6',
    resave: true,
    saveUninitialized: true
}));

/*
//Route to homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

//Route to login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

//Route to register page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
});

//Route to home page
app.get('/home', function(req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});
*/


//Handle post for login
app.post("/login", (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;

    const query = "Select password FROM users where username = " + mysql.escape(username) + ";";

    connection.query(query, function (err, result){
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.compare(password, (result[0])["password"], function (err, result) {
                if (err) throw err;
                if (result) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    return res.json({
                        status: 200,
                        redirect: "/home"
                    });
                } else {
                    return res.json({
                        status: 400,
                        errors: "Incorrect Username or Password!"
                    });
                }
            });
        } else {
            return res.json({
                status: 400,
                errors: "Incorrect Username or Password!"
            });
        }
    });
});

//Handle post for registration

app.post("/register",
    body("username").notEmpty().withMessage("Username required").bail()
        .isLength({min: 6}).withMessage("Username must be at least 6 characters").trim().escape(),

    body("email").notEmpty().withMessage("Email address required").bail()
        .isEmail().normalizeEmail().trim().escape().withMessage("Invalid email address"),

    body("phone").notEmpty().withMessage("Phone number required").bail()
        .isMobilePhone('any').trim().escape().withMessage("Invalid phone number"),

    body("password").notEmpty().withMessage("Password required").bail()
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .isLength({min: 8})
        .withMessage("Password must have an uppercase, digit, special symbol, and be at least 8 characters long").bail()
        // eslint-disable-next-line no-unused-vars
        .custom( (value,{req, loc, path}) => {
            return (value === req.body.passwordConfirm);
        }).withMessage("Passwords must match").trim().escape(),

    body("firstName").notEmpty().withMessage("First name required").bail().isAlpha().withMessage("Invalid first name"),
    body("lastName").notEmpty().withMessage("Last name required").bail().isAlpha().withMessage("Invalid last name"),

    (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            status: 400,
            errors: errors
        });
    }

    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phone = req.body.phone;

    connection.query("SELECT * FROM users WHERE username = " + mysql.escape(username) + ";", function (err, result){
        if (err) throw err;

        //Check if username is already taken
        if (result.length > 0) {
            return res.json({
                status: 400,
                errors: {
                    errors: [{
                        param: "username",
                        msg: "Username is already taken",
                    }]
                }
            });
        }

        // Generate a salt and hash
        // Insert data into table
        // Redirect back to login

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                const query = "INSERT INTO users (id, username, password, email_address, first_name, last_name, phone_number)" +
                    "VALUES (" + "UUID(), " + mysql.escape(username) + ", " + mysql.escape(hash) + ", "
                    + mysql.escape(email) + ", " + mysql.escape(firstName) + ", " + mysql.escape(lastName) + ", " +
                    mysql.escape(phone) + ");"

                // eslint-disable-next-line no-unused-vars
                connection.query(query, function (err, result){
                    if (err) throw err;
                    return res.json({
                        status: 200,
                        redirect: "/login"
                    });
                });
            });
        });
    });

});


app.listen(port, () => console.log(`Listening on port ${port}`));