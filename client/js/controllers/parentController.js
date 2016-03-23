'use strict';

app.
controller('ParentController', ['$scope', '$rootScope', '$modal', 'Auth', 'AUTH_EVENTS', 'USER_ROLES','$window','$state',
    function($scope, $rootScope, $modal, Auth, AUTH_EVENTS, USER_ROLES,$window,$state) {

        //cssprefix
        var prefix = (function() {
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                )[1],
                dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
            return {
                dom: dom,
                lowercase: pre,
                css: '-' + pre + '-',
                js: pre[0].toUpperCase() + pre.substr(1)
            };
        })();


        var username = window.sessionStorage.getItem('userInfo');
        if (!username) {
            //window.location.href = "./login.html";
            $state.go('login')
        }
        function logout() {
            window.sessionStorage.removeItem('userInfo');
            //window.location.href = "./login.html";
        }


        
        /*
        if ($window.sessionStorage["userInfo"]) {
            var credentials = JSON.parse($window.sessionStorage["userInfo"]);
            Auth.login(credentials);
        }*/






        $scope.modalShown = false;
        var showLoginDialog = function(type) {

            if (!$scope.modalShown) {
                $scope.modalShown = true;
                var modalInstance = $modal.open({
                    templateUrl: 'templates/login_modal.html',
                    controller: "LoginCtrl",
                    backdrop: 'static',
                });

                modalInstance.result.then(function() {
                    $scope.modalShown = false;
                });
            }
        };

        var setCurrentUser = function() {
            $scope.currentUser = $rootScope.currentUser;
        }

        var showNotAuthorized = function() {
            alert("Not Authorized");
        }

        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = Auth.isAuthorized;

        //listen to events of unsuccessful logins, to run the login dialog
        //$rootScope.$on(AUTH_EVENTS.notAuthorized, showNotAuthorized);
        //$rootScope.$on(AUTH_EVENTS.notAuthenticated, showLoginDialog);
        //$rootScope.$on(AUTH_EVENTS.sessionTimeout, showLoginDialog);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
            $scope.currentUser = null;
            $state.go('list',null,{reload:true})
        });
        $rootScope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);

        //listen to reponse 404, to run the login dialog
        //$rootScope.$on('event:auth-loginRequired', showLoginDialog);


        //listen to reponse 404, to goto the login html
        $rootScope.$on('event:auth-loginRequired', function(){
            $state.go('login')
        });

        /*$rootScope.$on('$stateChangeStart', function(event, next, current) {
            var authRequired = next && next.authRequired;
            if (authRequired !== undefined) {


                if (authRequired && !Auth.isLoggedIn()) {

                    event.preventDefault();
                    $rootScope.statnext = next
                    $rootScope.$broadcast('event:auth-loginRequired');
                }
                //event.preventDefault();
            }
        });*/

    }
]);
