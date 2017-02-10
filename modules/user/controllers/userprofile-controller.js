app.controller('userprofile-controller', ['$scope', 'userService', '$routeParams', '$location', 'loaderService',
    function ($scope, userService, $routeParams, $location, loaderService) {

        $scope.UserId = 0;
        if ($routeParams.userId !== undefined)
            $scope.UserId = $routeParams.userId;

        $scope.User = {
            FirstName: "",
            LastName: "",
            Email: "",
            Role: "",
            PasswordEncr: ""
        };
        $scope.Password = "";
        $scope.Error = "";
        $scope.Message = "";
        $scope.Groups = [];
        $scope.AssignGroups = [];

        $scope.CurrentUser = {
            FirstName: "",
            LastName: "",
            Email: "",
            Role: "",
            PasswordEncr: ""
        };

        $scope.GetUser = function () {
            userService.getUser($scope.UserId)
                .then(function (response) {
                    $scope.User = response;
                });
        };

        $scope.LoadUserForEditProfile = function () {
            userService.getCurrentUser()
            .then(function (response) {
                $scope.CurrentUser = response;
            });
        };

        $scope.LoadUserForEditProfile();

        $scope.GetUserGroups = function () {
            userService.getUserGroups($scope.UserId)
                  .then(function (response) {
                      $scope.AssignGroups = response;
                      $scope.AssignGroup();
                  });
        }

        $scope.UpdateUser = function () {
            userModel.User = $scope.User;
            userModel.Groups = $scope.AssignGroups;

            userService.createUser(userModel)
                .then(function (response) {
                    $location.path("user");
                }, function (err) {

                });
        };

        if ($scope.UserId > 0) {
            $scope.GetUser();
            //$scope.GetUserGroups();
        }

        $scope.RolesList = [];
        $scope.GetAllRoles = function () {
            userService.getRoles()
                .then(function (response) {
                    $scope.RolesList = response;
                });
        };

        var userModel = {
            User: {},
            Groups: []
        };

        $scope.CreateUser = function () {

            loaderService.ShowLoader("Creating user...")
            userModel.User = $scope.User;
            userModel.Groups = $scope.AssignGroups;

            userService.createUser(userModel)
                .then(function (response) {
                    if (response.Success) {
                        loaderService.HideLoader();
                        $location.path("user");
                    }
                    else {
                        $scope.Error = response.Message;
                        loaderService.HideLoader();
                    }
                }, function (err) {
                    $scope.Error = "We are unable to create user at this time, Please try again later.";
                    loaderService.HideLoader();
                });
        };

        $scope.GetGroups = function () {
            userService.getGroups()
                .then(function (response) {
                    $scope.Groups = response;

                    //If we are in edit mode then go for to load user assigned groups.
                    if ($scope.UserId > 0) {
                        $scope.GetUserGroups();
                    }
                });
        };

        $scope.SelectGroup = function (group) {
            group.Checked = !group.Checked;
        };

        $scope.UnAssignGroup = function () {
            angular.forEach($scope.AssignGroups, function (item, index) {
                if (item.Checked == true) {
                    $scope.Groups.push(item);
                };
            });
            angular.forEach($scope.Groups, function (item) {
                var index = $scope.AssignGroups.indexOf(item);
                if (index > -1) {
                    $scope.AssignGroups.splice(index, 1);
                }
            });
        };

        $scope.AssignGroup = function () {
            angular.forEach($scope.Groups, function (item, index) {
                if (item.Checked == true) {
                    item.Checked = false;
                    $scope.AssignGroups.push(item);
                };
            });

            function ReadIndex(contextId) {
                var contextIndex = -1;
                angular.forEach($scope.Groups, function (item, index) {
                    if (item.Id == contextId) {
                        contextIndex = index;
                    }
                });

                return contextIndex;
            }

            angular.forEach($scope.AssignGroups, function (item) {
                var index = ReadIndex(item.Id);
                if (index > -1) {
                    $scope.Groups.splice(index, 1);
                }
            });
        };

        $scope.UnSelectGroup = function (group) {
            group.Checked = !group.Checked;
        };

        $scope.ChangePassword = function () {
            userService.changePassword($scope.Password)
            .then(function (response) {
                $scope.Message = "Password Changed.";
            }, function () {
                $scope.Error = "We are unable to change password at this time, Please try again later.";
            });
        };
        $scope.EditProfile = function () {
            loaderService.ShowLoader("Updating profile...");
            userService.editProfile($scope.CurrentUser)
            .then(function (response) {
                if (response.Success) {
                    $scope.Message = "Your Changes has been saved.";
                    $scope.Error = "";
                }
                else {
                    $scope.Error = response.Message;
                    $scope.Message = "";
                }
                loaderService.HideLoader();
            }, function () {
                loaderService.HideLoader();
                $scope.Error = "We are unable to save your changes at this time, Please try again later.";
                $scope.Message = "";
            });
        };

        $scope.GetAllRoles();

        $scope.GetGroups();

    }]);

app.directive('equals', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
            };
        }
    }
});