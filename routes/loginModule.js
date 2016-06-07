var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt');
//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to home page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userMainPage");
		//res.redirect('/loginPagetweets');
	} else {
		res.redirect('/loginPage');
	}
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		
		//res.render("homepage",{data:req.session.user});
};



function login(req, res){	
	var email = req.param("email");
	var password = req.param("password");
	
	var getUser = "select * from users where email='" + email + "'";
	console.log(getUser);
	
	if(email!= undefined && password != undefined) {
		mysql.fetchData(function(err,results){
			if(err){
				console.log("DB error while retreiving user information for login");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					var passwordhash = results[0].password; 
					var found = bcrypt.compareSync(password, passwordhash);
					if(found) {
						console.log("User entered into his page");
						
						//Storing user details in cookie
						req.session.user=results[0];
						console.log(req.session.user);
						json_responses = {"statusCode" : 200,
						   };
						res.send(json_responses);						
					} else {
						console.log("Password is incorrect, please verify");
						json_responses = {"statusCode" : 401,
								   "error" : "Password Error"};
						res.send(json_responses);						
					}

				}
				else {    
					console.log("Email is incorrect, please verify");
					json_responses = {"statusCode" : 401,
							   "error" : "Email Error"};
					res.send(json_responses);
				}
			}  
		},getUser);
	}  else {
		console.log("Entered username error");
		json_responses = {"statusCode" : 401,
						   "error" : "Value not defined"};
		res.send(json_responses);
	}
}

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/loginPage');
};

exports.login=login;
