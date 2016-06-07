"use strict";
angular.module('twitterApp', ['compile'])

    .controller('loginSignupController', ['$scope', function($scope) {
	
	$scope.signup = function() {
				window.location.assign("/signupPage"); 
	};
	
	$scope.login = function() {
		window.location.assign("/loginPage"); 
	};
    }])
    
    .controller('signupController', ['$scope', '$http', function($scope, $http) {

    	$scope.username_exists = true;
    	$scope.email_exists = true;
    	$scope.unexpected_error = true;
    	
    	$scope.signup = function() {
    		$http({
    			method : "POST",
    			url : '/register',
    			data : {
    				"username" : $scope.username,
    				"password" : $scope.password,
    				"email" : $scope.email,
    				"gender" : $scope.gender,
    				"firstname" : $scope.firstname,
    				"lastname": $scope.lastname,
    				"dob" : $scope.dob
    			}
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				 console.log("error:" + data.error);
    				if(data.error ===  "Username Exists") {
        				$scope.username_exists = false;
        				$scope.unexpected_error = true;
        				$scope.email_exists = true;
    				} else if(data.error === "Email Exists") {
    					$scope.email_exists = false;
    					$scope.username_exists = true;
    					$scope.unexpected_error = true;
    				} else if (data.error === "Values not defined") {
    					$scope.email_exists = true;
						$scope.username_exists = true;
						$scope.unexpected_error = false;
    				}
    			}
    			else
    				//Making a get call to the '/redirectToHomepage' API
    				window.location.assign("/homepage"); 
    		}).error(function(error) {
    			$scope.unexpected_error = false;
    		});
    	};
    }])
    
    .controller('loginController', ['$scope', '$http', function($scope, $http) {

    	$scope.unexpected_error = true;
    	$scope.email_error = true;
    	$scope.pwd_error = true;
    	$scope.values_error = true;
    	$scope.login = function() {
    		$http({
    			method : "POST",
    			url : '/login',
    			data : {
    				"email" : $scope.email,
    				"password" : $scope.password
    			}
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				if(data.error ===  "Email Error") {
        				$scope.email_error = false;
        				$scope.unexpected_error = true;
        				$scope.pwd_error = true;
        				$scope.values_error = true;
    				}  else if(data.error === "Password Error") {
    					$scope.email_error = true;
    					$scope.unexpected_error = true;
    					$scope.pwd_error = false;
    					$scope.values_error = true;
    				} else if (data.error === "Value not defined") {
    					$scope.email_error = true;
						$scope.pwd_error = true;
						$scope.unexpected_error = true;
						$scope.values_error = false;
    				}
    			}
    			else
    				//Making a get call to the '/redirectToHomepage' API
    				window.location.assign("/homepage"); 
    		}).error(function(error) {
    			$scope.unexpected_error = false;
    		});
    	};
    }])

    .controller('tweetController', ['$scope', '$http', function($scope, $http) {
    	
    	$scope.tweetInfo = {tweets: "0", following: "0", followers: "0"};
    	$scope.userInfo = {firstname : "" , username : ""};
    	$scope.dob="";
    	$scope.location ="";
    	$scope.phonenumber ="";
    	$scope.writeTweet = false;
   
    	$scope.tweets = [];
    	$scope.tweetCall = function() {
    		
    		$http({
    			method : "POST",
    			url : '/tweet',
    			data : {
    				"tweet" : $scope.tweet,
    			}
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				window.location.assign("/homepage"); 
    			}
    			else {
    				$scope.tweetInfo.tweets = data.usertweet;
    				$scope.tweetInfo.following = data.following.count;
    				$scope.tweetInfo.followers = data.followers.count;
    				$scope.userInfo.firstname = data.firstname;
    				$scope.userInfo.username = data.username;
    				$scope.tweetData = data.tweets;
    				$scope.retweetsData = data.retweets;
    				
    				while ($scope.tweets.length) { 
    					$scope.tweets.pop(); 
    				}
    				
	                var regex = /(^|\W)(#[a-z\d][\w-]*)/ig;
    				for(var i=0; i < $scope.tweetData.length; i++) {
    					var str = $scope.tweetData[i].tweet;
    	                $scope.tweetData[i].tweet = str.replace(regex, '<a ng-click="searchVal($1$2)">$1$2</a>');
    	                $scope.tweetData[i].retweetdate = $scope.tweetData[i].date;
    	                $scope.tweetData[i].hide = true;
    					$scope.tweets.push($scope.tweetData[i]);
    				}
    				
 
    				for(var i=0; i < $scope.retweetsData.length; i++) {
    					var str = $scope.retweetsData[i].retweetcomment;
    	                $scope.retweetsData[i].retweetcomment = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
    	                var str = $scope.retweetsData[i].tweet;
    	                $scope.retweetsData[i].tweet = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
    	                $scope.tweets.push($scope.retweetsData[i]);
    				}
    				
    				$scope.tweet="";
    			}
    		}).error(function(error) {
    			window.location.assign("/homepage"); 
    		});
    	};
    	
    	$scope.searchVal = function(word) {
    		$scope.searchValue = word.trim();
    		$scope.search();
    	}
    	
    	$scope.initialize = function() {
    		$http({
    			method : "GET",
    			url : '/loginPagetweets',
    		}).success(function(data) {
    			//checking the response data for statusCode


    				$scope.tweetInfo.tweets = data.usertweet;
    				$scope.tweetInfo.following = data.following.count;
    				$scope.tweetInfo.followers = data.followers.count;
    				$scope.userInfo.firstname = data.firstname;
    				$scope.userInfo.username = data.username;
    				$scope.dob = data.dob;
    				$scope.location = data.location;
    				$scope.phonenumber = data.phonenumber;
    				
    				$scope.tweetData = data.tweets;
    				$scope.retweetsData = data.retweets;
	                var regex = /(^|\W)(#[a-z\d][\w-]*)/ig;
    				for(var i=0; i < $scope.tweetData.length; i++) {
    					var str = $scope.tweetData[i].tweet;
    	                $scope.tweetData[i].tweet = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
    	                $scope.tweetData[i].retweetdate = $scope.tweetData[i].date;
    	                $scope.tweetData[i].hide = true;
    					$scope.tweets.push($scope.tweetData[i]);
    					
    				}
    				
    				for(var i=0; i < $scope.retweetsData.length; i++) {
    					var str = $scope.retweetsData[i].retweetcomment;
    	                $scope.retweetsData[i].retweetcomment = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
    	                var str = $scope.retweetsData[i].tweet;
    	                $scope.retweetsData[i].tweet = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
    					$scope.tweets.push($scope.retweetsData[i]);
    				}
    				
    				
    		}).error(function(error) {
    			window.location.assign("/homepage"); 
    		});
    	};
    	
    	$scope.search = function() {
    		$http({
    			method : "POST",
    			url : '/hashTagtweets',
    			data : {
    				"search" : $scope.searchValue,
    			}
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				window.location.assign("/homepage"); 
    			} else {
		    			$scope.tweetData = data.tweets;
		    			$scope.retweetsData = data.retweets;
						while ($scope.tweets.length) { 
							$scope.tweets.pop(); 
						}
		                var regex = /(^|\W)(#[a-z\d][\w-]*)/ig;
						for(var i=0; i < $scope.tweetData.length; i++) {
							var str = $scope.tweetData[i].tweet;
			                $scope.tweetData[i].tweet = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
	    	                $scope.tweetData[i].retweetdate = $scope.tweetData[i].date;
	    	                $scope.tweetData[i].hide = true;
		    					$scope.tweets.push($scope.tweetData[i]);
		    				}
						
	    				for(var i=0; i < $scope.retweetsData.length; i++) {
	    					var str = $scope.retweetsData[i].retweetcomment;
	    	                $scope.retweetsData[i].retweetcomment = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
	    	                var str = $scope.retweetsData[i].tweet;
	    	                $scope.retweetsData[i].tweet = str.replace(regex, "<a ng-click='searchVal(\"$1$2\")'>$1$2</a>");
	    	                $scope.tweets.push($scope.retweetsData[i]);
	    				}
		    			
    			}
    		}).error(function(error) {
    			window.location.assign("/homepage"); 
    		});
    	};
    	
    	$scope.logout = function() {
    		window.location.assign("/logout"); 
    	};
    	
    	
        $scope.changeState = function(){
            $scope.writeTweet = true;
        }
        
    	$scope.retweet= function() {
    		$http({
    			method : "POST",
    			url : '/retweet',
    			data : {
    				"retweetText" : $scope.retweetText,
    				"retweetId" : $scope.retweetId,
    				
    			}
    		}).success(function(data) {
    			//checking the response data for statusCode
    				window.location.assign("/homepage"); 
    			
    				
    		}).error(function(error) {
    			window.location.assign("/homepage"); 
    		});
    	};
    	
    	$scope.setvalue= function(id){
    		$scope.retweetId = id;
    		console.log("Retweeted:" + $scope.retweetId);
    	}
    	
    	$scope.following = function(){
    		window.location.assign("/followingPage"); 
    	}
    	
    	$scope.followers = function(){
    		window.location.assign("/followersPage"); 
    	}
    	
    	$scope.userprofile = function(){
    		window.location.assign("/userprofilePage"); 
    	}
    	
    	$scope.unsaved = false;
    	$scope.savechanges = function() {
    		$http({
    			method : "POST",
    			url : '/profilechanges',
    			data : {
    				"username" : $scope.username,
    				"firstname" : $scope.firstname, 
    				"dob" : $scope.dob,
    				"location" : $scope.location,
    				"phonenumber": $scope.phonenumber
    			}
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				
    				$scope.unsaved = true;
    			} 
    				
    			
    		}).error(function(error) {
    			window.location.assign("/homePage");
    		});
    	};
    }])
    
     .controller('followController', ['$scope', '$http', function($scope, $http) {
    	
    	 $scope.userInfo = {username: "", firstname: ""};
      	$scope.toFollow = true;
    	$scope.followUser = function() {
    		$http({
    			method : "GET",
    			url : '/followUser',
    		}).success(function(data) {
    			//checking the response data for statusCode

    				window.location.assign("/homePage");
    			
    		}).error(function(error) {
    			window.location.assign("/homePage");
    		});
    	};
    	
    	
    	$scope.initialize = function() {
    		$http({
    			method : "GET",
    			url : '/followUserDetails',
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				window.location.assign("/homePage");
    			}
    			else {
    				$scope.userInfo.username = data.username;
    				$scope.userInfo.firstname = data.firstname;
    				$scope.toFollow = data.follow;
    			}
    		}).error(function(error) {
    			window.location.assign("/homePage");
    		});
    	};
    }])
    
    .controller('followingPageController', ['$scope', '$http', function($scope, $http) {
    	
    	$scope.userInfo = {username: "", firstname: ""};
    	$scope.tweetInfo = {tweets: "0", following: "0", followers: "0"};
    	$scope.followingUserInfo = [];
    	
    	$scope.initialize = function() {
    		$http({
    			method : "GET",
    			url : '/followingList',
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				window.location.assign("/homePage");
    			}
    			else {
    				$scope.tweetInfo.tweets = data.usertweet.count;
    				$scope.tweetInfo.following = data.following.count;
    				$scope.tweetInfo.followers = data.followers.count;
    				$scope.userInfo.firstname = data.firstname;
    				$scope.userInfo.username = data.username;
    				$scope.followingListData = data.followingList;


    				for(var i=0; i < $scope.followingListData.length; i++) {
    					$scope.followingUserInfo.push($scope.followingListData[i]);
    				}
    			}
    		}).error(function(error) {
    			window.location.assign("/homePage");
    		});
    	};
    }])
     .controller('followerPageController', ['$scope', '$http', function($scope, $http) {
    	
    	$scope.userInfo = {username: "", firstname: ""};
    	$scope.tweetInfo = {tweets: "0", following: "0", followers: "0"};
    	$scope.followerUserInfo = [];
    	
    	$scope.initialize = function() {
    		$http({
    			method : "GET",
    			url : '/followersList',
    		}).success(function(data) {
    			//checking the response data for statusCode
    			if (data.statusCode == 401) {
    				window.location.assign("/homePage");
    			}
    			else {
    				$scope.tweetInfo.tweets = data.usertweet.count;
    				$scope.tweetInfo.following = data.following.count;
    				$scope.tweetInfo.followers = data.followers.count;
    				$scope.userInfo.firstname = data.firstname;
    				$scope.userInfo.username = data.username;
    				$scope.followerListData = data.followingList;


    				for(var i=0; i < $scope.followerListData.length; i++) {
    					$scope.followerUserInfo.push($scope.followerListData[i]);
    				}
    			}
    		}).error(function(error) {
    			window.location.assign("/homePage");
    		});
    	};
    }]);

   
  angular.module('compile', [], function($compileProvider) {

    $compileProvider.directive('compile', function($compile) {

      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
            return scope.$eval(attrs.compile);
          },
          function(value) {

            element.html(value);
            $compile(element.contents())(scope);
          }
        );
      };
    })
  });
