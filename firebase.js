const express = require("express");
const { body, validationResult } = require("express-validator");
const bodyParser = require('body-parser');
const path = require("path");
const { customAlphabet } = require("nanoid/async");

const admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');

const server = express();
const port = process.env.PORT || 3000;

// eslint-disable-next-line no-control-regex
const ascii = /[^\x00-\x7F]/g;

async function createUserId(size, prefix) {
    if (size % 2 !== 0) throw "Size must be an odd number";
    const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", size);
    const id = await nanoid();
    return prefix + id.slice(0, size / 2) + "-" + id.slice(size / 2);
}

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'src')))

const serviceAccount = require("./vuejs-backend-demo-firebase-adminsdk-3jdr4-ce079c976a.json");
initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vuejs-backend-demo-default-rtdb.firebaseio.com"
})

let auth = admin.auth();
let db = admin.firestore();


server.post("/register",
    body("first").trim().escape().notEmpty().withMessage("First name required").bail().isAlpha().withMessage("Invalid first name"),
    body("middle").optional({nullable: true, checkFalsy:true}).trim().escape().isAlpha().withMessage("Invalid middle name"),
    body("last").trim().escape().notEmpty().withMessage("Last name required").bail().isAlpha().withMessage("Invalid last name"),
    body("birthday").trim().escape().notEmpty().withMessage("Date of Birth required").bail().isDate().withMessage("Invalid Date"),
    body("address").trim().escape().notEmpty().withMessage("Address required"),
    body("unit").optional({nullable: true, checkFalsy:true}).trim().escape().isNumeric().withMessage("Invalid Unit number"),
    body("email").trim().escape().notEmpty().withMessage("Email address required").bail()
        .isEmail().normalizeEmail().withMessage("Invalid email address"),
    body("phone").trim().escape().notEmpty().withMessage("Phone number required").bail()
        .isMobilePhone("en-CA", {strictMode: false}).withMessage("Invalid phone number"),
    body("sin").trim().escape().notEmpty().withMessage("SIN required").bail().isNumeric().isLength({min:9, max:9})
        .withMessage("Invalid SIN"),
    (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({status: 400, message: errors});
        res.end();
        return;
    }

    const userData = {
        name: {
            first: req.body.first.replace(ascii, ""),
            middle: req.body.middle.replace(ascii, ""),
            last: req.body.last.replace(ascii, ""),
        },
        birthday: req.body.birthday.replace(ascii, ""),
        address: req.body.address.replace(ascii, ""),
        unit: req.body.unit.replace(ascii, ""),
        email: req.body.email.replace(ascii, ""),
        phone: req.body.phone.replace(ascii, ""),
        sin: req.body.sin.replace(ascii, ""),
    }

    const password = (userData.name.first[0] + userData.name.last).toLowerCase() + "_" + userData.sin.slice(6,9);
    console.log(password)

        auth.verifyIdToken(req.get("Authorization"))
        .then((claims) => {
            return claims.admin;
        })
        .then(admin => {
            if (admin) {
                createUserId(16, 'E').then((uid) => {
                    userData.display_id = uid;
                    console.log(userData);

                    auth.createUser({
                        password: password,
                        email: userData.email,
                        emailVerified: false,
                        phoneNumber: userData.phone,
                        displayName: userData.name.first + " " + userData.name.last,
                        disabled: false,
                    }).then((userRecord) => {
                        console.log('Successfully created new user:', userRecord.uid);

                        let docRef = db.doc("users/" + userRecord.uid);
                        docRef.create(userData).then(() => {
                            res.status(200).json({status:200, message:"Successfully registered user"});
                        }).catch((error) => {
                            auth.deleteUser(uid).then(r => {
                                console.log(r);
                            });
                            res.status(500).send({status:500, message: error});
                        })

                    }).catch((error) => {
                        res.status(403).json({status: 403, message: error});
                    });
                });
            } else {
                res.status(401).json({status: 401, message: "Unauthorized"});
            }
        });

});

auth
    .getUserByEmail('admin@admin.com')
    .then((user) => {
        // Add custom claims for additional privileges.
        // This will be picked up by the user on token refresh or next sign in on new device.
        return auth.setCustomUserClaims(user.uid, {
            admin: true,
        });
    })
    .catch((error) => {
        console.log(error);
    });


server.listen(port, () => console.log(`Listening on port ${port}`));