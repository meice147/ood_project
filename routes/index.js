var express = require('express');
var router = express.Router();
var fs = require('fs');
// const fileUpload = require('express-fileupload');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // modified here  or user file.mimetype
    }
});
var upload = multer({ storage: storage });
// CONNECT

var pgp = require('pg-promise')({
    // Initialization Options
});

var cn = "postgres://postgres:1234@localhost:5432/ood";
var db = pgp(cn);
module.exports = db;



//  Object Class

function Assignment(id, name, description) {
    this.assignmentId = id;
    this.assignmentName = name;
    this.assignmentDescription = description;
}


Assignment.prototype.createAssignment = function() {
    var obj = {};
    obj["id"] = this.assignmentId;
    obj["name"] = this.assignmentName;
    obj["description"] = this.assignmentDescription;
    console.log(obj)
    db.none('INSERT INTO assignment(${this~}) VALUES(${id},${name}, ${description})', obj)
        .then(() => {
            console.log("the best");
        })
        .catch(error => {
            // error;`  
        });
}









/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/manageassignment');
});


router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.get('/index/:id', function(req, res, next) {
    console.log('ID:', req.params.id);
    query = "SELECT * FROM assignment where id=" + req.params.id + ";";
    db.any(query)
        .then(function(data) {
            // var str = JSON.stringify(data[0]);

            console.log(data);
            res.render('index', { title: data });
        })
        .catch(function(error) {
            console.log(error);
        });

});

router.post('/index/:id', upload.single('table'), function(req, res, next) {
    var testcase = req.file;
    pathtestcase = "./" + testcase.path;
    console.log(testcase.path);
    var query = fs.readFileSync(pathtestcase, 'utf8');
    db.any(query)
        .then(function(data) {
            console.log(data);
            var str = JSON.stringify(data);
            var pathstring = '././output/' + req.params.id + '.txt';
            var query1 = fs.readFileSync(pathstring, 'utf8');
            console.log(str);
            console.log(query1);
            if (str === query1) {
                console.log("pass");
                obj = {}
                obj["score_id"] = "pass";
                obj["name"] = this.assignmentName;
                obj["description"] = this.assignmentDescription;
                db.none('INSERT INTO Score(${this~}) VALUES(${id},${name}, ${description})', obj)
                    .then(() => {
                        console.log("the best");
                    })
                    .catch(error => {
                        // error;
                    });

            } else {
                console.log("dont pass ");
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    // query = "SELECT * FROM assignment where id=" + req.params.id + ";";
    // db.any(query)
    //     .then(function(data) {
    //         // var str = JSON.stringify(data[0]);

    //         console.log(data);
    //         res.render('index', { title: data });
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     });

});

router.get('/score', function(req, res, next) {
    res.render('score', { title: 'Express' });
});

router.get('/chooseassignment', function(req, res, next) {
    query = "SELECT * FROM assignment;";
    db.any(query)
        .then(function(data) {
            // var str = JSON.stringify(data[0]);

            console.log(data);
            res.render('chooseassignment', { title: data });
        })
        .catch(function(error) {
            console.log(error);
        });
});


router.get('/manageassignment', function(req, res, next) {
    query = "SELECT * FROM assignment;";
    db.any(query)
        .then(function(data) {
            // var str = JSON.stringify(data[0]);

            console.log(data);
            res.render('manageassignment', { title: data });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/manageassignment', function(req, res, next) {
    var idDel = req.body.iddel;
    query = "DELETE FROM assignment where id=" + idDel + ";";
    console.log(query);
    db.any(query)
        .then(function(data) {
            // var str = JSON.stringify(data[0]);
            console.log(data);
            res.redirect('/manageassignment');
        })
        .catch(function(error) {
            console.log(error);
        });
});


router.get('/addassignment', function(req, res, next) {
    res.render('addassignment', { title: 'Express' });
});

router.post('/addassignment', upload.single('table'), function(req, res, next) {
    var assignmentNumber = req.body.number;
    var assignmentName = req.body.assname;
    var assignmentDescription = req.body.assdes;
    var add1 = new Assignment(assignmentNumber, assignmentName, assignmentDescription);
    add1.createAssignment();
    var testcase = req.file;

    // console.log(assignmentName);
    // console.log(assignmentDescription);
    pathtestcase = "./" + testcase.path;
    console.log(testcase.path);
    var query = fs.readFileSync(pathtestcase, 'utf8');
    // console.log(query);

    db.any(query)
        .then(function(data) {
            console.log(data);
            var pathstring = '././output/' + assignmentNumber + '.txt';
            var str = JSON.stringify(data);
            fs.writeFile(pathstring, str, function(err) {
                if (err)
                    return console.log(err);
                console.log('Hello World > helloworld.txt');
            });

        })
        .catch(function(error) {
            console.log(error);
        });
    res.redirect('/manageassignment');

});
module.exports = router;
