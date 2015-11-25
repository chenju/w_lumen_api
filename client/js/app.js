var app = angular.module('wscene', [
    'ui.router',
    'ngTouch',
    'ngAnimate',
    'wscene.controllers',
    'http-auth-interceptor',
    'ngActivityIndicator',
    'Services',
    'ui.bootstrap',
    'angularFileUpload',
    'http-post-urlencoded'
]);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $urlRouterProvider.when("", "/");

        $stateProvider

            .state("home", {
                url: "/home",
                templateUrl: "templates/index.html",
                controller: 'HomeController',
                resolve: {
                    data: ['$q', function($q) {
                        var defer = $q.defer();
                        setTimeout(function() {
                            defer.resolve('HomeController');
                        }, 100);
                        return defer.promise;
                    }]
                }

            })
            .state("play", {
                url: "/play",
                templateUrl: "templates/play.html",
                controller: 'PlayController',
                resolve: {
                    data: ['$q', function($q) {
                        var defer = $q.defer();
                        setTimeout(function() {
                            defer.resolve('PlayController');
                        }, 100);
                        return defer.promise;
                    }]
                }

            })
            .state("over", {
                url: "/over",
                templateUrl: "templates/over.html",
                controller: 'OverController',
                resolve: {
                    data: ['$q', function($q) {
                        var defer = $q.defer();
                        setTimeout(function() {
                            defer.resolve('OverController');
                        }, 100);
                        return defer.promise;
                    }]
                }

            })
            .state("list", {
                    url: "/list",
                    templateUrl: "templates/list.html",
                    controller: 'ListController',
                    authRequired:true,
                    resolve: {
                        issuePosts: ['IssuePostService', function(IssuePostService) {
                            return IssuePostService.fetchIssuePosts();
                        }]
                    }
                }


            )
            .state("edit", {
                url: "/edit/:issueid",
                templateUrl: "templates/creat_edit_issue.html",
                controller: 'EditController',
                resolve: {
                    issuePost: ['$stateParams', 'IssuePostService', function($stateParams, IssuePostService) {
                        return IssuePostService.fetchIssuePost($stateParams.issueid);
                    }]
                }
            })
            .state("edit.editpage", {
                url: "/page/:pageid",
                templateUrl: "templates/creat_edit_page.html",
                controller: 'EditPageController'
            })

        .state("add", {
                url: "/edit/:issueid"

            })
            .state("more", {
                url: "/more",
                templateUrl: "templates/more.html"
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/creat_edit_issue.html',
                controller: 'LoginCtrl'
            })

        //$urlRouterProvider.otherwise('/404');

        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function($injector, $location) {
            if ($location.protocol() === 'file')
                return;

            var path = $location.path()
                // Note: misnomer. This returns a query object, not a search string
                ,
                search = $location.search(),
                params;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function(v, k) {
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

        /*
        $httpProvider.interceptors.push(function($rootScope,$q, $location) {
            return {
                'responseError': function(rejection) {
                    if (rejection.status === 401 || rejection.status === 403) {
                        $rootScope.$broadcast('event:auth-loginRequired', rejection);
                        //$location.path('/login')
                        //rejection.data = {stauts: 401, descr: 'unauthorized'}
                        //return rejection.data
                        
                    }
                    return $q.reject(rejection);
                }
            };
        });*/

        //$locationProvider.html5Mode(true);

    }])
    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'
    }).constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    /*
    .run([
        '$rootScope',
        '$state',
        'UserService',
        '$modal',

        function($rootScope, $state, UserService, $modal) {

            //前端设置需要验证
            /*
            $rootScope.$on('$stateChangeStart', function(event, next, current) {
                var authRequired = next && next.authRequired;
                if (authRequired !== undefined) {

                    if (authRequired && !UserService.isLoggedIn()) {
                        //$location.url('401');
                        //$state.go('401')
                        $rootScope.$broadcast('event:auth-loginRequired');
                    }
                    //event.preventDefault();
                }
            });
            //后端设置需要验证
            $rootScope.$on('event:auth-loginRequired', function() {
                var modalInstance = $modal.open({
                    templateUrl: 'templates/login.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'sm'
                })
            });*/

/*$rootScope.$on('event:auth-loginRequired', function() {
                var modalInstance= $modal.open({
                    templateUrl: 'templates/login.html',
                    controller: 'ModalInstanceCtrl',
                    size:'sm'
                })
            });

        }
    ])*/
.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'UserService', LoginModalInstanceCtrl])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .config(function interceptPOSTRequests($httpProvider) { // Proper post request data encoding
        $httpProvider.interceptors.push('postUrlencodeInterceptor');
    })





function LoginModalInstanceCtrl($scope, $modalInstance, UserService) {

    $scope.ok = function(credentials) {
        UserService.login(credentials, function() {
            $modalInstance.dismiss('cancel');
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};


/*
angular.module('demo').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        'use strict';

        $routeProvider.when('/', {
            controller:  'HomeController',
            templateUrl: 'templates/index.html',
            resolve: {
                    data: ['$q', function($q){
                        var defer = $q.defer();
                        setTimeout(function(){
                            defer.resolve('HomeController');
                        }, 100);
                        return defer.promise;
                    }]
                }
        })
        .when('/test', {
            controller:  'HomeController',
            templateUrl: 'templates/test.html',
            resolve: {
                    data: ['$q', function($q){
                        var defer = $q.defer();
                        setTimeout(function(){
                            defer.resolve('HomeController');
                        }, 100);
                        return defer.promise;
                    }]
                }
        })
        .when('/play', {
            controller:  'PlayController',
            templateUrl: 'templates/play.html',
            resolve: {
                    data: ['$q', function($q){
                        var defer = $q.defer();
                        setTimeout(function(){
                            defer.resolve('HomeController');
                        }, 1500);
                        return defer.promise;
                    }]
                }
        })
        .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    }
]);
*/

/*var ModalInstanceCtrl=function($scope,$modalInstance,items){

    $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

}*/

/*angular.module('demo.controllers').controller('ModalInstanceCtrl', function($scope,$modalInstance,items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })*/

/*angular.module('demo').controller('DemoCtrl', function($scope, $location) {

    $scope.addAlert = function() {
        $location.path('/more');
    }
})


angular.module('demo').animation('.test', ['$animateCss', function($animateCss) {
    return {
        enter: function(element, doneFn) {
            var height = element[0].offsetHeight;
            return $animateCss(element, {
                from: {
                    height: '0px'
                },
                to: {
                    height: height + 'px'
                },
                duration: 1 // one second
            });
        }
    }
}]);*/
