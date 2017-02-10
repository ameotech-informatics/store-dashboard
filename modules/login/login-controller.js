app.controller('login-controller', ['$scope', '$rootScope', 'loginService', '$location',
    function ($scope, $rootScope, loginService, $location) {
        //$rootScope.AfterLogin = false;
        $rootScope.HeaderContext = false;
        $rootScope.ShowLoader = false;
        $rootScope.loading = false;
        $scope.error = '';
        $scope.Email = "";
        $scope.UserModel = {
            FirstName: '',
            LastName: '',
            Email: '',
            PasswordEncr: ''
        };


        $scope.Login = function () {
            loginService.login($scope.UserModel)
                 .then(function (response) {
                     if (response != null && response !== undefined && response !== "") {
                         loginService.setCredentials(response);
                         $rootScope.Auth = true;
                         $location.path('dashboard');
                     }
                     else {
                         $rootScope.Auth = false;
                         $scope.error = "Invalid LoginId/Password";
                     }
                 });
        };
        $scope.SendPassword = function () {
            loginService.sendpassword($scope.Email)
            .then(function (response) {
            });
        };

    }]);