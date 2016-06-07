var ejs = require("ejs");
var mysql = require('./mysql');

//Redirects to the homepage
exports.followingPage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to following page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userFollowingMainPage");
	} else {
		res.redirect('/loginPage');
	}
};

exports.followingList = function(req, res){
	var user_id = req.session.user.id;
	var followingUserQuery = "select username , firstname from users where id in (" +
	"select followingUserid from following where userid= "+ user_id + ");";

	if(user_id != undefined && user_id != "") {
	mysql.fetchData(function(err,results){
			if(err){
				console.log("DB error while inserting the tweet");
				throw err;
			}
			else 
			{
					
					var followQuery = "select count(followingUserid) as count from following where userid=" + user_id ;
					mysql.fetchData(function(err, followCount){
						if(err){
							throw err;
						}
						else 
						{
							console.log(followCount[0].count);
							var tweetQuery = "select count(tweet) as count from tweets where userid=" + user_id ;
							mysql.fetchData(function(err, tweetCount){
								if(err){
									throw err;
								}
								else 
								{
									console.log(tweetCount[0].count);
									var followerQuery = "select count(userid) as count from following where followingUserid=" + user_id ;
									mysql.fetchData(function(err, followerCount){
										if(err){
											throw err;
										}
										else 
										{
														
														console.log("Resultsvalues" +  results[0]);
														json_responses = {"statusCode" : 200,
																"followingList": results,
																"following" : followCount[0],
																"usertweet" : tweetCount[0],
																"followers" : followerCount[0],
																"firstname" : req.session.user.firstname,
																"username"  : req.session.user.username
														   };
														
														res.send(json_responses);

										}  
									},followerQuery);
									
								}  
							},tweetQuery);
							
						}  
					},followQuery); 
				
			}  
		}, followingUserQuery); 
	} else {
		json_responses = {"statusCode" : 401};
		res.send(json_responses);		
	}
}

exports.followersPage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to following page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userFollowersMainPage");
	} else {
		res.redirect('/loginPage');
	}
};

exports.followersList = function(req, res){
	var user_id = req.session.user.id;
	var followersUserQuery = "select username , firstname from users where id in (" +
	"select userid from following where followingUserid= "+ user_id + ");";

	mysql.fetchData(function(err,results){
			if(err){
				console.log("DB error while inserting the tweet");
				throw err;
			}
			else 
			{

					var followQuery = "select count(followingUserid) as count from following where userid=" + user_id ;
					mysql.fetchData(function(err, followCount){
						if(err){
							throw err;
						}
						else 
						{
							console.log(followCount[0].count);
							var tweetQuery = "select count(tweet) as count from tweets where userid=" + user_id ;
							mysql.fetchData(function(err, tweetCount){
								if(err){
									throw err;
								}
								else 
								{
									console.log(tweetCount[0].count);
									var followerQuery = "select count(userid) as count from following where followingUserid=" + user_id ;
									mysql.fetchData(function(err, followerCount){
										if(err){
											throw err;
										}
										else 
										{
														
														console.log("Resultsvalues" +  results[0]);
														json_responses = {"statusCode" : 200,
																"followingList": results,
																"following" : followCount[0],
																"usertweet" : tweetCount[0],
																"followers" : followerCount[0],
																"firstname" : req.session.user.firstname,
																"username"  : req.session.user.username
														   };
														
														res.send(json_responses);

										}  
									},followerQuery);
									
								}  
							},tweetQuery);
							
						}  
					},followQuery); 
				
			}  
		}, followersUserQuery); 	
}



exports.profilePage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to profile page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userProfilePage");
	} else {
		res.redirect('/loginPage');
	}
};

exports.profileupdate = function(req, res){
	var user_id= req.session.user.id;
	var firstname = req.param("firstname");
	var location = req.param("location");
	var phonenumber = req.param("phonenumber");
	
	var query = "update users set location ='" +  location + "', phonenumber ="+ phonenumber + " where id=" + user_id;
	mysql.fetchData(function(err, results){
		if(err){
			json_responses = {"statusCode" : 401,
			};
			
			res.send(json_responses);
		}
		else 
		{	
						
						json_responses = {"statusCode" : 200,
						};
						
						res.send(json_responses);

		}  
	},query);
}