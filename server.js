// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const port = 3000
// firebase admin setup




let serviceAccount = require("./e-commerce-50621-firebase-adminsdk-tjkiq-c7cf9fc7aa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// declare static path
let staticPath = path.join(__dirname,);
 const app = express();

//middlewares
app.use(express.static(staticPath));
app.use(express.json());


//routes
//home route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})

//signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
})

app.post('/signup' ,(req, res) => {
    let { name, email, password, number, tac, notification} = req.body;

// form validations
if(name.length < 3){
    return res.json({'alert': 'name must be 3 letters long'});
} else if(!email.length){
    return res.json({'alert': 'enter your email'});
} else if(password.length < 8){
    return res.json({'alert': 'password should be 8 letters long'});
} else if(!number.length){
    return res.json({'alert': 'enter your phone number'});
} else if(!Number(number) || number.length < 10){
    return res.json({'alert': 'invalid number, please enter valid one'});
} else if(!tac){
    return res.json({'alert': 'you must agree to our terms and conditions'});
}  

// store user in db
db.collection('users').doc(email).get()
.then(user => {
    if(user.exists) {
        return res.json({'alert': 'email already exists'});
    } else{
        // encrypt the password before storing it.
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                req.body.password = hash;
                db.collection('users').doc(email).set(req.body)
                .then(data => {
                    res.json({
                        name: req.body.name,
                        email: req.body.email,
                        seller: req.body.seller,
                    })
                })
            })
        })
    }
})
})
// login router


app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
})

app.post('/login', (req, res) => {
    let { email, password} = req.body;

    if(!email.length || !password.length) {
        return res.json({'alert':'fill all the inputs'})
    }
    db.collection('users').doc(email).get()
    .then(user => {
        if(!user.exists) { /* if email do not exist*/
return res.json({'alert': 'login email does not exists'})
        } else {
            bcrypt.compare(password, user.data().password, (err,result) => {
                if(result) {
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                }else{
                    return res.json({'alert': 'password is incorrect '});
                }
            })
        }
    })
})

// seller route
app.get('/seller', (req, res)=> {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) => {
    let{ name, about, address, number, tac, legit, email } = req.body;
    if(!name.length || !address.length || !about.length || number.length < 10 ||
        !Number(number)){
             return res.json({'alert':'some information(s) is/are invalid'});
         } else if(!tac || !legit){
             return res.json({'alert': 'you must agree to our terms and conditions'})
         } else {
             //update users seller status here.
             db.collection('seller').doc(email).set(req.body)
             .then(data => {
                 db.collection('users').doc(email).update({
                     seller: true
                 }).then(data => {
                     res.json(true);
                 })
             })
         }
})
// add product
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})


// 404 route
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
})

app.use((req, res) => {
    res.redirect('/404');
})



app.listen(port, () => {
    console.log(`listening on port ${port}`);
})








