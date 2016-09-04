/*
*  author : abhishek goswami (hiro)
*  abhishekg785@gmail.com
*  github : abhishekg785
*
*  searchPanel.js : routes for handling the queries related to the battles
*/

var express = require('express');
var router = express.Router();
var db = require('../db_connect.js');

/*
*  middleware for checking if the user is logged in or not
*  authenticating the apis and giving access only if the user is logged in
*/
function checkLogin(req, res, next){
  if(req.session && req.session.username){
    next();
  }
  else{
    res.redirect('/');
  }
}

router.get('/', checkLogin, function(req, res){
  res.render('searchPanel/index.html', {'loggedUser' : req.session.username });
});

/*
*  apis for handling data from the database
*  apis are :
*  /api/v0.1/list :  gives all the battles and their info
*  /api/v0.1/count : gives the total count of the battles
*  /api/v0.1/search/:query_for/:query_string : gives the search capibility on the basis of name, region, king etc.
*  /api/v0.1/search : same as above and used with ajax call
*/

//api for getting the complete list of the battles and their info
router.get('/api/v0.1/list', checkLogin, function(req, res){
  db.get().query('SELECT * FROM battles', function(err, data){
    res.send(JSON.stringify(data));
  });
});

//api for getting the count of the battles
router.get('/api/v0.1/count', checkLogin, function(req, res){
  db.get().query('SELECT count(name) FROM battles', function(err, data){
    res.send(JSON.stringify(data));
  });
});

//function that return the appropriate query according to the query_for parameter i.e for king, region , date etc
function getQuery(queryFor, queryString){
  var query = '';
  if(queryFor == 'name'){
    query = 'SELECT * FROM battles WHERE name ="' + queryString + '"';
  }
  else if(queryFor == 'king'){
    query = 'SELECT * FROM battles WHERE attacker_king ="' + queryString + '"';
  }
  else if(queryFor == 'region'){
    query = 'SELECT * FROM battles WHERE region ="' + queryString + '"';
  }
  else if(queryFor == 'year'){
    query = 'SELECT * FROM battles WHERE year ="' + queryString + '"' ;
  }
  return query;
}

/*
*  api for searching the battles and their info on the basis of king, name , year, region
*  api takes the query_for parameter=> name, king, region, year and the query_string to search for
*  another version of the api is available for the ajax request
*/
router.get('/api/v0.1/search/:query_for/:query_string', checkLogin, function(req,res){
  console.log(req.params);
  var queryFor = req.params.query_for,
      queryString = String(req.params.query_string);
  var query = getQuery(queryFor, queryString);
  console.log(query);
  db.get().query(query, function(err, data){
    res.send(JSON.stringify(data));
  });
});

/*
*  api for searching the battles and their info on the basis of king, name , year, region
*  can be used for the ajax request
*/
router.post('/api/v0.1/search', function(req, res){
  var queryString = req.body.queryString,
      queryFor = req.body.queryFor;
  console.log(queryFor);
  var query = getQuery(queryFor, queryString);
  db.get().query(query, function(err, data){
    if(err) throw err
    res.send(data);
  });
});

module.exports = router;
