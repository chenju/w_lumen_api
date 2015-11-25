'use strict';

app.factory('Auth', ['$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS', 'authBackService',
        function($http, $rootScope, $window, Session, AUTH_EVENTS, authBackService) {
            var authService = {};


            authService.restConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                Credentials: true

            };

            //the login function
            authService.login = function(credentials, success, error) {

                credentials = {
                    'email': 'darkwingcj@gmail.com',
                    'password': 'secret'
                }
                $http.post('http://lumen.app/auth/login', credentials, authService.restConfig).success(function(data) {
                    if (data.token) {
                        var loginData = data
                        //session.log(loginData)
                        sessionStorage.clear()
                        console.log(data.token)
                        sessionStorage.setItem('token', loginData.token.token);
                        //sessionStorage.setItem('token') = loginData.token;
                        //sessionStorage["token"] = loginData.token
                        //console.log(sessionStorage.getItem('token').token)
                        //console.log(data.token.token)
                        Session.create(loginData);
                        //$rootScope.currentUser = loginData;
                        authBackService.loginConfirmed('success', function(config) {
                            console.log(data.token.token)
                            config.headers["Authorization"] = 'Bearer '+data.token.token;
                            config.headers['Content-Type']='application/x-www-form-urlencoded';
                            return config
                        })
                        if (typeof(success) == "function") success()
                    }
                    /*
                                        var users = data.users;
                                        if (users[user.username]) {
                                            var loginData = users[user.username];
                                            //insert your custom login function here 
                                            if (user.username == loginData.username && user.password == loginData.username) {
                                                //set the browser session, to avoid relogin on refresh
                                                $window.sessionStorage["userInfo"] = JSON.stringify(loginData);

                                                //delete password not to be seen clientside 
                                                delete loginData.password;

                                                //update current user into the Session service or $rootScope.currentUser
                                                //whatever you prefer
                                                Session.create(loginData);
                                                //or
                                                $rootScope.currentUser = loginData;

                                                //fire event of successful login
                                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                                                //run success function
                                                success(loginData);
                                            } else {
                                                //OR ELSE
                                                //unsuccessful login, fire login failed event for 
                                                //the according functions to run
                                                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                                error();
                                            }*/

                });

            };

            //check if the user is authenticated
            authService.isLoggedIn = function(user) {

                if (user === undefined) {
                    //user = currentUser;
                    user= Session.user
                }
                //return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
                return !!Session.user;
            };

            //check if the user is authorized to access the next route
            //this function can be also used on element level
            //e.g. <p ng-if="isAuthorized(authorizedRoles)">show this only to admins</p>
            authService.isAuthorized = function(authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() &&
                    authorizedRoles.indexOf(Session.userRole) !== -1);
            };

            //log out the user and broadcast the logoutSuccess event
            authService.logout = function() {
                Session.destroy();
                $window.sessionStorage.removeItem("userInfo");
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            }

            return authService;
        }
    ]);
