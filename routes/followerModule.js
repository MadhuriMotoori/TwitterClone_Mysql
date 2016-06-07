var ejs = require("ejs");
var mysql = require('./mysql');

function followUserMainPage(req, res){
	var followUsername = req.params.user;
	var query = "select * from users where username='" + followUsername +"'";
	
	if(followUsername != undefined && followUsername !="") {
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
			res.redirect('/homePage');
		}
		else 
		{
				if(results.length ==  1){
					req.session.follower = results[0];
					ejs.renderFile('./views/followUserMainPage.ejs', {data: results[0]}, function(err, result) {
						   // render on success
						   if (!err) {
						            res.end(result);
						   }
						   // render or error
						   else {
						            res.end('An error occurred');
						            console.log(err);
						   }
					   });
				}
				else {    
					res.redirect('/homePage');
				}
			}  
		}, query);
	} else {
		res.redirect('/homePage');
	}
}

function followUser(req, res){
	var tofollowUser = req.session.follower.username;
	var query = "select * from users where username='" + tofollowUser +"'";
	if(tofollowUser != undefined && tofollowUser != "") {
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
			res.redirect('/userMainPage');
		}
		else 
		{
			if(results.length ==  1){
				var followingUserId = results[0].id;
				var userId = req.session.user.id;
				
				var insertQuery = "insert into following(userid, followingUserid) values (" + userId + "," + followingUserId +")";
				
				mysql.fetchData(function(err,results){
					if(err){
						console.log("DB error while inserting following list to following table");
						//return to userhomepage
						throw err;
					}
					else 
					{
						req.session.follower = null;
						console.log("User is added into following list");
				
						json_responses = {"statusCode" : 200};
						res.send(json_responses);
						//res.redirect('/homePage');
					} 
				},insertQuery);
			}
			else {    
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}  
	}, query);
	} else {
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
}

function followUserDetails(req, res) {
	var tofollowUser = req.session.follower.username;
	
	var query = "select * from users where username='" + tofollowUser +"'";
	
	if(tofollowUser != undefined && tofollowUser != "") {
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
			res.redirect('/userMainPage');
		}
		else 
		{
			if(results.length ==  1){
				var followingUserId = req.session.follower.id;
				var userId = req.session.user.id;
				var followDetails = "select * from following where userid=" + userId + " and followingUserid=" + followingUserId + ";"
				
				mysql.fetchData(function(err,followresults){
					if(err){
						throw err;
						res.redirect('/homePage');
					}
					else 
					{
						var toFollow;
						if(followresults.length ==  1){
							toFollow = false;
						} else {
							toFollow = true;
						}
						json_responses = {"statusCode" : 200,
								 "follow" : toFollow,
								 "username" : results[0].username,
								 "firstname": results[0].firstname
								 };
						res.send(json_responses);
					}  
				}, followDetails);
				
			}
			else {    
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}  
	}, query);
	} else {
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
}

exports.followUserMainPage=followUserMainPage;
exports.followUser=followUser;
exports.followUserDetails=followUserDetails;