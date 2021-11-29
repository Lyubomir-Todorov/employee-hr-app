const express = require('express');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const MySQLStore = require('express-mysql-session')(session);
const { customAlphabet } = require('nanoid/async');

const server = express();
const port = process.env.PORT || 3000;

// eslint-disable-next-line no-control-regex
const ascii = /[^\x00-\x7F]/g;

const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 16);
const nanoid_course = customAlphabet(alphabet, 32);

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: 'testdb',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
});

const options = {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: 'testdb',
    createDatabaseTable: true,
};
const sessionStore = new MySQLStore(options, connection);

server.use(bodyParser.json());
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'src')))

const oneDay = 1000 * 60 * 60 * 24;
server.use(session({
    secret: 'TUY8PCnx6R%ZMv2eXLzxaEK6FiKFVugzBMxYwSXfjKhkoufpVfPX9UJ&CsqQa7j6',
    cookie: { maxAge: oneDay },
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// TODO: enforce rate limiting
// TODO: enforce max limits on user credentials

const saltRounds = 10;

async function main(email, name) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
            user: "leo@lyubomirtodorov.ca",
            pass: "AvFrn9BtA97j7C",
        },
    });

    // send mail with defined transport object
    const emailTemplate = "<h1>Hey there, " + name + "! </h1>" + "<br>" +
        "<p>To reset your password, please go to the following link: </p>" + "<br>" +
        "<b>This part is just a demo, so there's no actual password changing ;) </b>" + "<br>" +
        "<i>If you didn't request a new password, you can safely delete this email.</i>";

    await transporter.sendMail({
        from: '"Backend Demo" <leo@lyubomirtodorov.ca>', // sender address
        to: email, // list of receivers
        subject: "Password Reset", // Subject line
        text: "Reset your password", // plain text body
        html: emailTemplate, // html body
    });
}

async function createUserId () {
    const id = await nanoid();
    return id.slice(0,8) + "-" + id.slice(8);
}

async function createCourseId () {
    return await nanoid_course();
}

//Get for account info
server.get('/account', function(req, res) {
    if (req.session.loggedin) {
        let query = "SELECT * FROM users WHERE username = " + mysql.escape(req.session.username) + ";"
        connection.query(query, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {

                delete result[0]['password']

                const accountDetails = result[0];
                const registeredCourses = [];

                query = "SELECT * FROM registered_courses WHERE user_id = " + mysql.escape(req.session.user_id) + ";";
                connection.query(query, function (err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        const register = result;
                        query = "SELECT * FROM training;"
                        connection.query(query, function (err, result) {
                            if (err) throw err;
                            if (result.length > 0) {
                                register.forEach(function(item, index) {
                                    registeredCourses[index] = result[item.course_id];
                                    console.log(registeredCourses)
                                });

                                return res.json({
                                    status: 200,
                                    msg: accountDetails,
                                    courses: registeredCourses
                                });
                            }
                        })
                    }
                });
            } else {
                return res.json({
                    status: 401,
                    msg: "There was an error retrieving info"
                });
            }
        });
    } else {
        return res.json({
            status: 401,
            msg: "Unauthorized - Please login to continue"
        });
    }
});

//Get training
server.get('/training', function(req, res) {
    if (req.session.loggedin) {
        connection.query("SELECT * FROM training;", function (err, result) {
            if (err) throw err;
            if (result.length > 0) {

                let courses = result;

                const query = "SELECT * FROM registered_courses WHERE user_id = " + mysql.escape(req.session.user_id) + ";";
                connection.query(query, function(err, result) {
                    if (err) throw err;

                    if (result.length > 0) {

                        //Iterate through each post item and add registered property
                        courses.forEach(function(item, index) {
                            courses[index].registered = false
                        });

                        //Iterate through each user's registered courses and assign registered to corresponding post
                        result.forEach(function (item) {
                            courses[item['course_id']].registered = true;
                        });
                    }
                    return res.json({
                        status: 200,
                        msg: courses
                    });
                });
            } else {
                return res.json({
                    status: 401,
                    msg: "There was an error retrieving info"
                });
            }
        });
    } else {
        return res.json({
            status: 401,
            msg: "Unauthorized - Please login to continue"
        });
    }
});

//Handle post for login
server.post("/login",
    body("username").trim().escape().notEmpty().withMessage("Username required"),
    body("password").trim().escape().notEmpty().withMessage("Password required"),
    (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json({
            status: 400,
            errors: errors
        });
    }

    let username = req.body.username.replace(ascii, "");
    let password = req.body.password.replace(ascii, "");

    let query = "SELECT password, first_name, id FROM users WHERE username = " + mysql.escape(username) + ";";
    connection.query(query, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            const name = result[0]["first_name"];
            const id = result[0]["id"];
            bcrypt.compare(password, (result[0])["password"], function (err, result) {
                if (err) throw err;
                if (result) {

                    req.session.loggedin = true;
                    req.session.username=username;
                    req.session.user_id=id;
                    req.session.name = name;

                    if (err) throw err;
                    return res.json({
                        status: 200,
                        redirect: "/account"
                    });

                } else {
                    return res.json({
                        status: 401,
                        errors: "Incorrect Username or Password!"
                    });
                }
            });
        } else {
            return res.json({
                status: 401,
                errors: "Incorrect Username or Password!"
            });
        }
    });
});

//Handle post for registration

server.post("/register",
    body("username").trim().escape().notEmpty().withMessage("Username required").bail()
        .isLength({min: 6}).withMessage("Username must be at least 6 characters"),

    body("email").trim().escape().notEmpty().withMessage("Email address required").bail()
        .isEmail().normalizeEmail().withMessage("Invalid email address"),

    body("phone").trim().escape().notEmpty().withMessage("Phone number required").bail()
        .isMobilePhone('any').withMessage("Invalid phone number"),

    body("password").trim().escape().notEmpty().withMessage("Password required").bail()
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .isLength({min: 8})
        .withMessage("Passwords must have an uppercase, lowercase, number, special symbol, and be at least 8 characters long").bail()
        // eslint-disable-next-line no-unused-vars
        .custom( (value,{req, loc, path}) => {
            return (value === req.body.passwordConfirm);
        }).withMessage("Passwords must match"),

    body("firstName").trim().escape().notEmpty().withMessage("First name required").bail().isAlpha().withMessage("Invalid first name"),
    body("lastName").trim().escape().notEmpty().withMessage("Last name required").bail().isAlpha().withMessage("Invalid last name"),

    (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            status: 400,
            errors: errors
        });
    }

    let username = req.body.username.replace(ascii, "");
    let password = req.body.password.replace(ascii, "");
    let email = req.body.email.replace(ascii, "");
    let firstName = req.body.firstName.replace(ascii, "");
    let lastName = req.body.lastName.replace(ascii, "");
    let phone = req.body.phone.replace(ascii, "");

    connection.query("SELECT * FROM users WHERE username = " + mysql.escape(username) + ";", function (err, result){
        if (err) throw err;

        //Check if username is already taken
        if (result.length > 0) {
            return res.json({
                status: 409,
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

                createUserId().then(val => {
                    const query = "INSERT INTO users (id, username, password, email_address, first_name, last_name, phone_number, job_id)" +
                        " VALUES (" + mysql.escape(val) + ", " + mysql.escape(username) + ", " + mysql.escape(hash) + ", "
                        + mysql.escape(email) + ", " + mysql.escape(firstName) + ", " + mysql.escape(lastName) + ", " +
                        mysql.escape(phone) + ", 0);"

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
});

//Handle post for password reset
server.post("/reset",
    body("email").trim().escape().notEmpty().withMessage("Email address required").bail()
        .isEmail().normalizeEmail().withMessage("Invalid email address"),
    (req, res) =>{

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            status: 400,
            errors: errors
        });
    }

    let email = req.body.email.replace(ascii, "");

    const query = "Select email_address, first_name FROM users WHERE email_address = " + mysql.escape(email) + ";";

    connection.query(query, function (err, result){
        if (err) throw err;

        if (result.length > 0) {
            // send mail with defined transport object
            main(result[0]["email_address"], result[0]["first_name"]);
        }

        return res.json({
            status: 200,
            msg: "If a matching account was found, an email was sent to " + email + " to allow you to reset your password."
        });
    });
});

server.post("/course-register", body("course_id").trim().escape().notEmpty().isNumeric(),
    (req, res) => {
        if (req.session.loggedin) {

            createCourseId().then(val => {
                const query = "INSERT INTO registered_courses (id, user_id, course_id)" +
                    " VALUES (" + mysql.escape(val) + ", " + mysql.escape(req.session.user_id) +
                    ", " + mysql.escape(req.body.course_id) + ");";

                // eslint-disable-next-line no-unused-vars
                connection.query(query, function (err, result) {
                    if (err) throw err;
                    return res.json({
                        status: 200,
                    });
                });
            });
        } else {
            return res.json({
                status: 401,
                msg: "Unauthorized"
            });
        }
});

server.post("/course-withdraw", body("course_id").trim().escape().notEmpty().isNumeric(),
    (req, res) => {
        if (req.session.loggedin) {

            const query = "DELETE FROM registered_courses WHERE user_id = " + mysql.escape(req.session.user_id) +
                " AND course_id = " + mysql.escape(req.body.course_id) + ";";
            // eslint-disable-next-line no-unused-vars
            connection.query(query, function (err, result) {
                if (err) throw err;
                return res.json({
                    status: 200,
                });
            });
        } else {
            return res.json({
                status: 401,
                msg: "Unauthorized"
            });
        }
    });

//Handle post for logout
server.post("/logout", (req, res) =>{
    req.session.destroy();
    sessionStore.close();
    res.redirect('/');
});


server.listen(port, () => console.log(`Listening on port ${port}`));