var app = angular.module('demo', [
    'ui.router',
    'ngTouch',
    'ngAnimate',
    'demo.controllers',
    //'http-auth-interceptor',
    'ngActivityIndicator',
    'Services'
]);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $urlRouterProvider.when("", "/list");

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
                    resolve: {
                        issuePosts: ['IssuePostService', function(IssuePostService) {
                            console.log(IssuePostService.fetchIssuePosts)
                            return IssuePostService.fetchIssuePosts();
                        }]
                    }
                }


            )
            .state("edit", {
                    url: "/edit/:issueid",
                    templateUrl: "templates/creat_edit_issue.html",
                    controller: 'EditController',
                    //authRequired:true,
                    resolve: {
                        issuePost: ['$stateParams', 'IssuePostService', function($stateParams, IssuePostService) {
                            return IssuePostService.fetchIssuePost($stateParams.issueid);
                        }]
                    }
                }


            )

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

        $urlRouterProvider.otherwise('/404');


        /*// FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
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

        //$locationProvider.html5Mode(true);*/

        $httpProvider.interceptors.push(function($rootScope,$q, $location) {
            return {
                'responseError': function(rejection) {
                   
                    if (rejection.status === 401 || rejection.status === 403) {
                        //$rootScope.$broadcast('event:auth-loginRequired', rejection);
                        $location.path('/login')
                        rejection.data = {stauts: 401, descr: 'unauthorized'}
                        return rejection.data;
                        //$location.replace();
                        //$state.go('/login')
                         //response.data = {stauts: 401, descr: 'unauthorized'}
                         //return response.data;
                       /*$rootScope.$apply(function(){

                            //$location.path('/login');
                       })*/
                       
                    }
                    return $q.reject(rejection);
                }
            };
        });

    }])
    .run([
        '$rootScope',
        '$state',
        'UserService',

        function($rootScope, $state, UserService) {
            $rootScope.$on('$stateChangeStart', function(event, next, current) {
                console.log(event+'kkk')
                var authRequired = next && next.authRequired;
                if (authRequired !== undefined) {

                    if (authRequired && !UserService.isLoggedIn()) {
                        //$location.url('401');
                        $state.go('401')
                    }
                    event.preventDefault();
                }
            });
            $rootScope.$on('event:auth-loginRequired', function() {
                    console.log('a2b')
                    $state.go('login')
                });    
        }
    ]).

controller('AppController', [
        '$rootScope',
        'UserService',

        function($rootScope, UserService) {
            $rootScope.userService = UserService;

            $rootScope.broadcastBtnEvent = function(event) {
                $rootScope.$broadcast(event);
            };
        }
    ])
    .directive('demo', function() {
        return {
            restrict: 'C',
            link: function(scope, elem, attrs) {
                //once Angular is started, remove class:

                console.log('fuck')
                scope.$on('event:auth-loginRequired', function() {
                    console.log('a2a')
                });
                scope.$on('event:auth-loginConfirmed', function() {

                });
            }
        }
    });


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

angular.module('demo').controller('DemoCtrl', function($scope, $location) {

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
}]);
