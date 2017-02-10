app.controller('user-controller', ['$scope', '$rootScope', 'userService', '$location', '$routeParams', '$filter', 'loaderService',
    function ($scope, $rootScope, userService, $location, $routeParams, $filter, loaderService) {
        $scope.UsersList = [];
        $scope.GetUsers = function () {
            loaderService.ShowLoaderOnElement("#userArea", "Loading Users...");
            userService.getUsers()
                .then(function (response) {
                    $scope.UsersList = response;
                    loaderService.HideLoader("#userArea");
                }, function () {
                    loaderService.HideLoader("#userArea");
                });
        };
        $scope.DeleteUser = function (userId) {
            if (confirm("Are you sure?")) {
                loaderService.ShowLoaderOnElement("#userArea", "Deleting User...");
                userService.deleteUser(userId)
                .then(function (response) {
                    $scope.GetUsers();
                });
            }
        };
        $scope.Search = "";
        $scope.SearchInUsers = function () {
            loaderService.ShowLoaderOnElement("#userArea", "Loading Users...");
            userService.Search($scope.Search)
                .then(function (response) {
                    $scope.UsersList = response;
                    loaderService.HideLoader("#userArea");
                }, function () {
                    loaderService.HideLoader("#userArea");
                });
        };
        $scope.GetUsers();
    }]);

