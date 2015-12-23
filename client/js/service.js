angular.module('Services', []).

/**
 * IssuePostService
 */
factory('IssuePostService', [
    '$http',

    function($http) {
        var restUrl = 'http://lumen.app/issues';
        var restConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
            //,Credentials: true
        };

        return {
            issuePost: {},
            issuePosts: [],
            fetchIssuePosts: function() {
                var self = this;
                return $http({
                    method: 'GET',
                    url: restUrl,
                    //,credentials:true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }

                }).
                success(function(data) {
                    console.log(data)
                    return self.issuePosts = data;
                }).
                error(function(data) {
                    return data;
                });
            },
            fetchIssuePost: function(issuePostId) {
                var self = this;
                return $http.get(restUrl + '/' + issuePostId, restConfig).
                success(function(data) {

                    return self.issuePost = data;

                }).
                error(function(data) {
                    console.log(data)
                    return data;
                });
            },
            updateIssuePost: function(issuePost) {
                var self = this;
                var data = {
                    'issue': 'aaa'
                }
                return $http({
                        method: 'PUT',
                        url: restUrl + '/' + issuePost.id,
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
                        data: {
                            title: 'aaa',
                            name: 'fuck'
                        }
                    }) //put(restUrl + '/' + issuePost.id,data,restConfig)*/
                    .success(function(data) {

                        console.log(data)

                    }).
                error(function(data) {
                    console.log(data)
                    return data;
                });
            },
            addIssuePost: function(issuePost) {
                return $http.post(restUrl, issuePost).
                success(function(data) {
                    console.log(data)
                    return data;
                }).
                error(function(data) {
                    return data;
                });
            }
        };
    }
]).
factory('UploadImageService', [
        '$http',

        function($http) {
            var restUrl = 'data/api_1/rest/issue/';

            return {
                uploadimage: {},
                uploadimages: [],

                fetchImages: function() {
                    var self = this;
                    return $http.get(restUrl).
                    success(function(data) {

                        return self.uploadimages = data;
                    }).
                    error(function(data) {
                        return data;
                    });
                }

            }


        }
    ]).
    /**
     * CommentService
     */
factory('CommentService', [
    '$http',

    function($http) {
        var restUrl = 'rest/issue/';

        return {

            /**
             * Comments
             */
            comments: [],

            /**
             * Fetch comments
             *
             * @param issuePostId
             * @return {*}
             */
            fetchComments: function(issuePostId) {
                var self = this;
                return $http.get(restUrl + issuePostId + '/comment').
                success(function(data) {
                    return self.comments = data;
                }).
                error(function(data) {
                    return data;
                });
            },

            /**
             * Add comment
             *
             * @param comment
             * @param issuePostId
             * @return {*}
             */
            addComment: function(comment, issuePostId) {
                var self = this;
                return $http.post(restUrl + issuePostId + '/comment', comment).
                success(function(data) {
                    self.fetchComments(issuePostId);
                    return data;
                }).
                error(function(data) {
                    return data;
                });
            }
        };
    }
]).


/**
 * UserService
 */
factory('UserService', [
    '$http',
    '$rootScope',
    '$location',
    'authBackService',
    '$modal',
    '$state',

    function($http, $rootScope, $location, authBackService, $modalInstance, $state) {
        var restConfig, loggedIn;

        restConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };

        loggedIn = (sessionStorage.getItem('token')) ? true : false;

        $rootScope.$on('user:logout', function() {
            sessionStorage.removeItem('token');
            sessionStorage.setItem('token', 'false');
            sessionStorage.removeItem('user');
            loggedIn = false;
            //$location.url('/');
            $state.go('list');
        });

        return {

            /**
             * Login
             *
             * @param credentials
             * @return {*}
             */
            login: function(credentials, success, error) {

                //authService.loginConfirmed();
                //cb()
                //credentials={email:'darkw1ng@gmail.com',password:'secret'} //data/api_1.php/rest/authentication
                return $http.post('http://lumen.app/auth/login', credentials, restConfig).
                success(function(data) {
                    var token = data;
                    console.log(data)


                    sessionStorage.setItem('token', 'true');
                    //authService.loginConfirmed();
                    authService.loginConfirmed('success', function(config) {
                        config.headers["Authorization"] = 'true';
                        return config
                    })
                    success()
                }).
                error(function(data) {
                    console.log(data)
                    return data;
                })
            },



            /**
             * Register
             *
             * @param userData
             * @return {*}
             */
            register: function(userData) {
                return $http.post('rest/user', userData, restConfig).
                success(function(data) {
                    return data;
                }).
                error(function(data) {
                    return data;
                });
            },


            /**
             * Return logged-in status
             *
             * @return {Boolean}
             */
            isLoggedIn: function() {
                return loggedIn;
            },


            /**
             * Return user
             *
             * @return {*}
             */
            getUser: function() {
                return angular.fromJson(sessionStorage.getItem('user'));
            }
        };
    }
]).factory('issueService', [function() {

    return {

        page: function() {

            var a = {
                "csstext": {
                    "background-image": "url(img/bg.png)"
                },
                "child": []
            };

            return a;

        },
        mc: function() {
            var a = {
                "label": "",
                "animat": "fadeIn",
                "action": "turnto(0,1,1)",
                "csstext": {
                    "background": "red",
                    "top": "100px",
                    "left": "100px",
                    "z-index": "auto",
                    "opacity": "0",
                    "width": "300px",
                    "height": "50px",
                    "color": "white",
                    "border-radius": "0px"
                }
            };

            return a
        }
    }
}]);


'use strict';

/*angular.module('angular-client-side-auth')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('angular-client-side-auth')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        }
    };
});*/
