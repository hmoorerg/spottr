var express = require('express');
var bodyParser = require('body-parser')

const util = require('util');

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('users.db')

var app = express()
app.use(bodyParser.urlencoded({     
    extended: true
  })); 
app.use(bodyParser.urlencoded());

app.use(express.static('public'))
app.get('/',serveFile("main.html"))
app.get('/register',serveFile("register.html"))
app.post('/register',registerUser)
app.get('/getusers',serveUserList)
app.get('/filterusers',serveFile("filterusers.html"))

var webpageDir = "webpages"

function serveFile(filename){
    return function(req,res) {
        res.sendfile(webpageDir+"/"+filename)
    }
}

//POST
function registerUser(req,res){
    const name = req.body.user.name
    var gender = req.body.user.gender
    const age = req.body.user.age
    const city = req.body.user.city
    const email =  req.body.user.email

    console.log (name," ",gender)


    switch (gender) {
        case "Male" : gender = "M"
        break;
        case "Female" : gender = "F"
        break;
        case "Other" : gender = "O"
        break;
    }
    console.log (name," ",gender)

    createUser(name,gender,age,city,email);


    res.redirect("/filterusers")
}


//Name Gender Age City Email

function createUser(name,gender,age,city,email) {
    db.serialize(function () {
        var statement = db.prepare("insert into users values (?,?,?,?,?);")
        statement.run(name,gender, age,city,email)
        statement.finalize()
    });
}


function initializeDB(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS users (name text, gender char, age integer, city text, email text);")
    });
}
function serveUserList(req,res){
    db.serialize(function (){
        //send data
        
        console.log("Getting users : ")

        var statement = db.all('select * from users;', (err,allRows) => {
            console.log(util.inspect(allRows))
            res.setHeader('Content-Type','application/json');
            res.send(JSON.stringify({allRows}))
        });
        }




    );
}



initializeDB();

app.listen(8080)