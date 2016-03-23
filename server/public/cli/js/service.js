angular.module('Services', []).

/**
 * IssuePostService
 */
factory('IssuePostService', [
    '$http',
    '$state',

    function($http, $state) {
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

                    return self.issuePosts = data;
                }).
                error(function(data) {
                    return data;
                });
            },
            fetchIssuePost: function(issuePostId) {
                var self = this;
                if (issuePostId == 'new') {
                    var addIssue = {
                        "id": 'temp',
                        'title': 'new',
                        'time': 'none',
                        'music': 'false',
                        'page': []
                    }
                    self.issuePost = addIssue
                        //self.issuePost.push(addIssue)
                    return self.issuePost
                } else {
                    return $http({
                        method: 'GET',
                        url: restUrl + '/' + issuePostId,
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                    success(function(data) {

                        return self.issuePost = data;

                    }).
                    error(function(data) {
                        console.log(data)
                        return data;
                    });
                }
            },
            addIssuePost: function(issuePost) {
                var self = this;
                return $http({
                        method: 'POST',
                        url: restUrl,
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
                        data: issuePost
                    })
                    .success(function(data) {

                        $state.go("edit", {
                            issueid: data
                        });
                        console.log(data)

                    })
                    .error(function(data) {
                        //console.log()
                        //return data;
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
                        data: issuePost
                    }) //put(restUrl + '/' + issuePost.id,data,restConfig)*/
                    .success(function(data) {

                        console.log(data)

                    }).
                error(function(data) {
                    console.log(data)
                    return data;
                });
            },
            delIssuePost: function(issuePostId) {
                var self = this;
                return $http({
                        method: 'DELETE',
                        url: restUrl + '/' + issuePostId,
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    })
                    .success(function(data) {

                        self.issuePosts.splice(data, 1)
                        console.log(data)

                    })
                    .error(function(data) {
                        //console.log()
                        //return data;
                    });
            },
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

    function($http) {
        var restUrl = 'http://lumen.app/user';


        return {
            userlist:{},
            user: {},
            fetchUserList: function() {
                var self = this;
                return $http({
                    method: 'GET',
                    url: restUrl+'/list',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).
                success(function(data) {
                    console.log(data)
                    return self.userlist = data;

                }).
                error(function(data) {
                     console.log(data)
                    return data;
                });

            },
            fetchUser: function() {
                var self = this;
                return $http({
                    method: 'GET',
                    url: restUrl,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).
                success(function(data) {
                    
                    return self.user = data;

                }).
                error(function(data) {
                     console.log(data)
                    return data;
                });

            },
            update: function(user) {
                var self = this;
                console.log('fuck')
                return $http({
                    method: 'PUT',
                    url: restUrl+'/'+user.id,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    },
                    data:user
                }).
                success(function(data) {
                    
                    console.log(data)
                    return self.user = data;

                }).
                error(function(data) {
                     console.log(data)
                    return data;
                });

            }
        }
    }
]).factory('issueService', [function() {

    return {

        issue: function() {
            var a = {
                "id": 'temp',
                'title': 'new',
                'time': 'none',
                'music': 'false',
                'page': []
            }

            return a;

        },

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
