var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt');

function register(req, res){
	var username = req.param("username");
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var gender = req.param("gender");
	var dob = req.param("dob"); 
	
	if(username != undefined && email != undefined && password != undefined && firstname != undefined && lastname != undefined 
			&& gender != undefined && dob != undefined) {
		var query = "select * from users where username='" + username +"'";
		console.log("Query is:"+query);
		
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else {
				if(results.length > 0){
					console.log("Entered username error");
					json_responses = {"statusCode" : 401,
									   "error" : "Username Exists"};
					res.send(json_responses);
				} else {

					var emailQuery = "select * from users where email='" + email + "'";
					console.log("Email query is:" + emailQuery);
					mysql.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else 
						{
							if(results.length > 0){
								console.log("Entered email error");
								json_responses = {"statusCode" : 401,
												   "error" : "Email Exists"};
								res.send(json_responses);
							}
							else {    
								
								var passwordhash = bcrypt.hashSync(password, 10);
								var insertQuery = 
									"INSERT INTO users ( email, username, password, firstname, lastname, gender, date) VALUES ('" 
									  + email + "','"  + username + "','"  + passwordhash + "','" + firstname + "','" + lastname + "','" + 
									  gender  + "','" + dob + "')";
								
								mysql.fetchData(function(err,results){
									if(err){
										throw err;
										console.log("error at insert query")
									}
									else {
										console.log("exit from insert query");
									}
									
									var selectQuery = "select * from users where email='" + email + "' and password='" + passwordhash +"'";
									
									mysql.fetchData(function(err, results) {
										if(err) {
											console.log("DB error while redirecting to home page ")
										}
										
										if(results.length == 1) {
											console.log("user entering into home page");
											//User session is started
											req.session.user=results[0];
											json_responses = {"statusCode" : 200,
													   };
											res.send(json_responses);
										} else {
											res.redirect('/');
										}
									}, selectQuery);
									
								}, insertQuery);
							}
						}  
					},emailQuery);
				}
					
				}
			
		}, query);		
	} else {
		json_responses = {"statusCode" : 401,
				   "error" : "Values not defined"};
		res.send(json_responses);		
	}
}

exports.register=register;