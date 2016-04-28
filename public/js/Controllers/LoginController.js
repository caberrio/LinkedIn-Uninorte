angular.module('LoginCtrl', ['LoginSrv']).controller('LoginController', ['$rootScope', '$scope', '$state', 'LoginService', function($rootScope, $scope, $state, LoginService) {
    $scope.login = function() {
        LoginService.ClearCredentials();
        LoginService.Authenticate($scope.username, $scope.password, function(response) {
            console.log(response);
            if (response.result == 1) {
                LoginService.SetCredentials($scope.username, $scope.password, response.user);
                //$state.go("home.home");
            } else {
                alert("Login error");
            }
        });
    };
}]);