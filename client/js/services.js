angular.module('Services', []).

    /**
     * IssuePostService
     */
    factory('IssuePostService', [
        '$http',

        function($http) {
            var restUrl = 'data/api';

            return {

                /**
                 * Issue post
                 */
                issuePost: {},

                /**
                 * Issue posts
                 */
                issuePosts: [],

                /**
                 * Fetch issue posts
                 *
                 * @return {*}
                 */
                fetchIssuePosts: function() {
                    var self = this;
                    return  $http.get(restUrl).
                        success(function(data) {
                            return self.issuePosts = data;
                        }).
                        error(function(data) {
                            return data;
                        });
                },

                /**
                 * Fetch issue post with the given id
                 *
                 * @param issuePostId
                 * @return {*}
                 */
                fetchIssuePost: function(issuePostId) {
                    var self = this;
                    return  $http.get(restUrl + '/' + issuePostId).
                        success(function(data) {
                            return self.issuePost = data;
                        }).
                        error(function(data) {
                            return data;
                        });
                },


                /**
                 * Add issue post
                 *
                 * @param issuePost
                 * @return {*}
                 */
                addIssuePost: function(issuePost) {
                    return  $http.post(restUrl, issuePost).
                        success(function(data) {
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
                    return  $http.get(restUrl + issuePostId + '/comment').
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
                    return  $http.post(restUrl + issuePostId + '/comment', comment).
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

        function($http, $rootScope, $location) {
            var restConfig, loggedIn;

            restConfig = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            };

            loggedIn = (sessionStorage.getItem('user')) ? true : false;

            $rootScope.$on('user:logout', function() {
                sessionStorage.removeItem('user');
                loggedIn = false;
                $location.url('/');
            });

            return {

                /**
                 * Login
                 *
                 * @param credentials
                 * @return {*}
                 */
                login: function(credentials) {
                    return  $http.post('rest/authentication', credentials, restConfig).
                        success(function(data) {
                            sessionStorage.setItem('user', angular.toJson(data));
                            loggedIn = true;
                            return data;
                        }).
                        error(function(data) {
                            return data;
                        });
                },


                /**
                 * Register
                 *
                 * @param userData
                 * @return {*}
                 */
                register: function(userData) {
                    return  $http.post('rest/user', userData, restConfig).
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
    ]);