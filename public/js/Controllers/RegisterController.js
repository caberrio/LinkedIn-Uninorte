angular.module('RegisterCtrl', ['LoginSrv']).controller('RegisterController', ['$scope', '$state', 'LoginService', function($scope, $state, LoginService) {
    $scope.register = function() {
        LoginService.Register($scope.name, $scope.lastName, $scope.email, $scope.telephone, $scope.username, $scope.password, $scope.code, $scope.career, $scope.semester, function(response) {
            if (response.result == 0) {
                alert("Error: " + response.error);
                return;
            }

            alert("Registered successfully");
            //$state.go("home.home");
        });
    }
}]);
