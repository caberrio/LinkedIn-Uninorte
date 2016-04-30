angular.module('appRoutes', ["ui.router"]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        
        .state("inicio", {
            url: "",
            templateUrl: "views/inicio.html",
            controller: "LoginController",
            abstract: true
        })
        
        .state("register", {
            url: "/register",
            templateUrl: "views/registro.html",
            controller: "RegisterController",
            data: {
                public: true
            }
        });
}]);
