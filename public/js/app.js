var app = angular.module('LinkedInUninorte', ['appRoutes', 'ngCookies', 'LoginCtrl', 'RegisterCtrl']);
app.run(["$rootScope", "$cookieStore", "$http", "$state", function($rootScope, $cookieStore, $http, $state) {
    $rootScope.globals = $cookieStore.get("globals") || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata;
    }

     $rootScope.$on("$stateChangeStart", function(event, toState, nextParams, prev, prevParams) {
        if (toState.data.public === false) {
            if (!$rootScope.globals.authenticated || $rootScope.globals.authenticated == false) {
                event.preventDefault();
                $state.go("inicio");
            }
        }
    });
}]);
