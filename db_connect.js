/*
* author : abhishek goswami
* abhishekg785@gmail.com
*
* db_connect.js : module for handling db connection
*/

var mysql = require('mysql'),
    async = require('async');

var state = {
  pool : null,
}

//creating pool connection to handle multiple requests
exports.connect = function(done){
  state.pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'sushmagiri',
    database : 'battles'
  });

  done();
}

exports.get = function(){
  return state.pool;
}
