var ejs = require("ejs");
var mysql = require('./mysql');


function tweet(req, res){	
	var user_id= req.session.user.id;
	var tweetText = req.param("tweet");
	var insertquery = "insert into tweets (tweet, userid) values ('" + tweetText + "'," +  user_id +")";

	
	if(tweetText != undefined && tweetText !="") {
		mysql.fetchData(function(err,results){
			if(err){
				console.log("DB error while inserting the tweet");
				throw err;
			}
			else 
			{
				res.redirect('/loginPageTweets');
			}  
		}, insertquery);	
	} else {
		json_responses = {"statusCode" : 401 };
		res.send(json_responses);
	}
}

function showtweets(req, res) {
	var user_id= req.session.user.id;

	var tweetsQuery  = "select users.username , tweets.tweet, users.firstname , tweets.id, (tweets.tweetdate) as date from users inner join tweets on  " +
	"users.id = tweets.userid and users.id in (select followingUserid from following where userid=" + 
	user_id + ") UNION All select username, tweet, firstname, tweets.id, (tweets.tweetdate) as date from tweets, users where users.id= tweets.userid and users.id = " + user_id;
	if(user_id != undefined && user_id !="") {
		mysql.fetchData(function(err,results){
			if(err){
				console.log("DB error while retrieving user tweets");
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
						
						var tweetQuery = "select count(tweet) as count from tweets where userid=" + user_id ;
						mysql.fetchData(function(err, tweetCount){
							if(err){
								throw err;
							}
							else 
							{
								
								var followerQuery = "select count(userid) as count from following where followingUserid=" + user_id ;
								mysql.fetchData(function(err, followerCount){
									if(err){
										throw err;
									}
									else 
									{
										
										var retweetsQuery = "select (r.username) as retweetUsername, (r.firstname) as retweetfirstname, r.retweetcomment, u.username, "+
										"u.firstname, u.tweet, u.date, r.retweetdate from (select username, firstname , tweet, (tweets.id) as tweetid, (tweets.tweetdate) as date from tweets inner join  users on users.id= tweets.userid) as u " +
										" inner join  (select username, firstname, retweetcomment, tweetid, retweetdate from retweets inner join users on users.id=retweets.userid and users.id in " +
												"(select followingUserid from following where userid=" + user_id + "  UNION select id from users where id= " + user_id+ ")) as r on r.tweetid = u.tweetid;";
										
	
										mysql.fetchData(function(err,retweetsresults){
												if(err){
													console.log("DB error while retreiving user information for login");
													throw err;
												}
												else 
												{
													var dobQuery = "select date, location, phonenumber from users where id = " + user_id ;
													mysql.fetchData(function(err,dob){
														if(err){
															console.log("DB error while retreiving user information for login");
															throw err;
														}
														else 
														{
															var notweets = tweetCount[0].count + retweetsresults.length;
															json_responses = {"statusCode" : 200,
																	"tweets": results,
																	"following" : followCount[0],
																	"usertweet" : notweets,
																	"followers" : followerCount[0],
																	"firstname" : req.session.user.firstname,
																	"username"  : req.session.user.username,
																	"retweets" : retweetsresults,
																	"dob" : dob[0]
															   };
															
															res.send(json_responses);
														}  
													},dobQuery);
												}  
											},retweetsQuery);
	
									}  
								},followerQuery);
								
							}  
						},tweetQuery);
						
					}  
				},followQuery);
	
			}  
		}, tweetsQuery);
	} else {
	json_responses = {"statusCode" : 401 };
	res.send(json_responses);
	}
}

function hashtagtweets(req, res){
	var search = req.param("search");
	
	var query = "select tweets.tweet, users.firstname, users.username, tweets.id, (tweets.tweetdate) as date from tweets inner join users on " +
			" tweets.userid=users.id where (tweet like '% " + search + " %' or tweet like '" + search + " %' or tweet like '%" + search + "');";
	console.log("searchQuery:" + query);
	if(search != undefined && search != ""){
		mysql.fetchData(function(err,results){
			if(err){
				console.log("DB error while retreiving user information for login");
				throw err;
			}
			else 
			{
				console.log(results.length);
				var retweetsQuery ="select (r.username) as retweetUsername, (r.firstname) as retweetfirstname, r.retweetcomment, u.username, u.firstname," +
						" u.tweet, u.date, r.retweetdate from (select username, firstname , tweet, (tweets.id) as tweetid," +
						" (tweets.tweetdate) as date from tweets inner join  users on users.id= tweets.userid) as u  " +
						"inner join  (select username, firstname, retweetcomment, tweetid, retweetdate from retweets" +
						" inner join users on users.id=retweets.userid where (retweetcomment like '% " + search + " %' or retweetcomment like '" + search + " %' or retweetcomment like '%" + search + "'))" +
								" as r on r.tweetid = u.tweetid  ;"
				console.log(retweetsQuery);

				mysql.fetchData(function(err,retweetsresults){
						if(err){
							console.log("DB error while retreiving user information for login");
							throw err;
						}
						else 
						{
							
									json_responses = {"statusCode" : 200,
											"tweets": results,
											"retweets" : retweetsresults,
									   };
									res.send(json_responses);

						}  
					},retweetsQuery);

			}  
		},query);
} else {
	json_responses = {"statusCode" : 401 };
	res.send(json_responses);
	}
}


function retweet(req, res) {
	var retweetText = req.param("retweetText");
	var userid = req.session.user.id;
	var tweetId = req.param("retweetId");
	var query = "insert into retweets (userid, tweetid, retweetcomment) values (" + userid + "," + tweetId + 
	",'" + retweetText + "');"
	
	console.log("retweetText:" + retweetText + "userid:" + userid + "tweetId:" + tweetId + "query:" + query);
	if(userid != undefined && userid != "" ){
	mysql.fetchData(function(err,results){
		if(err){
			console.log("DB error while retreiving user information for login");
			throw err;
		}
		else 
		{
			console.log(results.length);

				json_responses = {"statusCode" : 200,};
				res.send(json_responses);

		}  
	},query);
	} else {
		json_responses = {"statusCode" : 401 };
		res.send(json_responses);
	}
}
exports.tweet=tweet;
exports.showtweets=showtweets;
exports.hashtagtweets = hashtagtweets;
exports.retweet = retweet;