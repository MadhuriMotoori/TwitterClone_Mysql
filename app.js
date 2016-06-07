
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
, site = require('./routes/site')
, registerModule = require('./routes/registerModule')
, loginModule = require('./routes/loginModule')
, tweetModule = require('./routes/tweetModule')
, followerModule = require('./routes/followerModule')
, userModule = require('./routes/userModule')
  , session = require('client-sessions')
  , connectionPool = require('./routes/mysql'); 
var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  }));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function checkUserSession(req, res, next) {
	if (!req.session.user) {
		res.redirect('/loginPage');
		return;
	}
	next();
};


app.get('/', site.sitePage);
app.get('/signupPage', site.signupPage);
app.get('/loginPage', site.loginPage);
app.post('/register', registerModule.register);
app.get('/homepage',loginModule.redirectToHomepage);
app.post('/login', loginModule.login);
app.post('/tweet', checkUserSession, tweetModule.tweet);
app.get('/loginPagetweets', checkUserSession, tweetModule.showtweets);
app.get('/logout', loginModule.logout);
app.get('/user/:user', checkUserSession, followerModule.followUserMainPage);
app.get('/followUser', checkUserSession, followerModule.followUser);
app.get('/followUserDetails', checkUserSession, followerModule.followUserDetails);
app.post('/hashTagtweets', checkUserSession, tweetModule.hashtagtweets);
app.post('/retweet', checkUserSession, tweetModule.retweet);
app.get('/followingPage', checkUserSession, userModule.followingPage);
app.get('/followingList', checkUserSession, userModule.followingList);
app.get('/followersPage', checkUserSession, userModule.followersPage);
app.get('/followersList', checkUserSession, userModule.followersList);
app.get('/userprofilePage', checkUserSession, userModule.profilePage);
app.post('/profilechanges', checkUserSession, userModule.profileupdate);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
