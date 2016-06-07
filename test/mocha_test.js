/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the twitter site main page if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return the twitter site main page if the url is wrong', function(done){
		http.get('http://localhost:3000/home', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

	it('should be able to login with correct details', function(done) {
		request.post(
			    'http://localhost:3000/login',
			    { form: { email: 'test1@gmail.com',password:'test1' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('should not be able to login with incorrect details', function(done) {
		request.post(
			    'http://localhost:3000/login',
			    { form: { email: 'test1@gmail.com',password:'test2' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('should not be able to show user following page without logging in', function(done) {
		http.get('http://localhost:3000/followingPage', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	  });
	
	it('should be able to logout successfully after logging in', function(done) {
		request.post(
			    'http://localhost:3000/login',
			    { form: { email: 'test1@gmail.com',password:'test2' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});