var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : "localhost",
  port     : "", // put the port where yo want to deploy
  user     : "root",
  password : "", //put your password here
  database : "queveo"
});

module.exports = connection;

