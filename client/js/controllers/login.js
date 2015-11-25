'use strict';

angular.module('wscene')
.controller('LoginCtrl', [ '$scope', '$state', '$modalInstance' , '$window', 'Auth','UserService', '$rootScope',
function($scope, $state, $modalInstance, $window, Auth ,UserService,$rootScope) {
	$scope.credentials = {};
	$scope.loginForm = {};
	$scope.error = false;
	
	//when the form is submitted
	$scope.submit = function(credentials) {
		$scope.submitted = true;
		if (!$scope.loginForm.$invalid) {
			$scope.login(credentials);
		} else {
			$scope.error = true;
			return;
		}
	};

	//Performs the login function, by sending a request to the server with the Auth service
	$scope.login = function(credentials) {
		$scope.error = false;
		 console.log('??')
		Auth.login(credentials, function() {
			//success function
			$modalInstance.close();
			if($rootScope.statnext) $state.go($rootScope.statnext.url.split('/')[1])
			//$state.go('home');
		}, function(err) {
			console.log("error");
			$scope.error = true;
		});
	};

	$scope.cancel = function() {
		$modalInstance.close();
    };
	
	// if a session exists for current user (page was refreshed)
	// log him in again
	if ($window.sessionStorage["userInfo"]) {
		var credentials = JSON.parse($window.sessionStorage["userInfo"]);
		$scope.login(credentials);
	}

} ]);