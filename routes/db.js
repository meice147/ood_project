var pgp = require('pg-promise')({
    // Initialization Options
});

var cn = "postgres://postgres:1234@localhost:5432/ood";
var db = pgp(cn);
module.exports = db;
