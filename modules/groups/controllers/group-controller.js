app.controller('group-controller', ['$scope', '$rootScope', 'groupService', '$location', '$routeParams', '$filter', 'loaderService',
function ($scope, $rootScope, groupService, $location, $routeParams, $filter, loaderService) {
    $scope.GroupsList = [];
    $scope.Contexts = [];
    $scope.AssignContexts = [];


    $scope.GroupId = 0;
    if ($routeParams.groupId !== undefined)
        $scope.GroupId = $routeParams.groupId;

    $scope.Group = {
        Name: "",
        CreateTime: "",
        LastUpdateTime: "",
        PrincipalId: "",
        SecurableId: ""
    };

    $scope.Error = "";

    $scope.GetAllGroups = function () {
        GroupHelper.GetAllGroups();
    };

    $scope.GetGroup = function () {
        GroupHelper.LoadGroupById($scope.GroupId);
    };



    $scope.Search = "";

    $scope.SearchInGroups = function () {
        GroupHelper.SearchGroups();
    };

    $scope.UpdateGroup = function () {
        GroupHelper.UpdateGroup();
    };

    $scope.DeleteGroup = function (groupId) {
        GroupHelper.DeleteGroup(groupId);
    };

    $scope.CreateGroup = function () {
        GroupHelper.CreateGroup();
    };

    $scope.SelectContext = function (context) {
        GroupHelper.SelectContext(context);
    };

    $scope.AssignContext = function () {
        angular.forEach($scope.Contexts, function (item, index) {
            if (item.Checked == true) {
                item.Checked = false;
                $scope.AssignContexts.push(item);
                //$scope.Contexts.splice(index, 1);
            };
        });

        function ReadIndex(contextId) {
            var contextIndex = -1;
            angular.forEach($scope.Contexts, function (item, index) {
                if (item.Id == contextId) {
                    contextIndex = index;
                }
            });

            return contextIndex;
        }

        angular.forEach($scope.AssignContexts, function (item) {
            var index = ReadIndex(item.Id);
            if (index > -1) {
                $scope.Contexts.splice(index, 1);
            }
        });
    };

    $scope.UnSelectContext = function (context) {
        context.Checked = !context.Checked;
    };

    $scope.UnAssignContext = function () {
        angular.forEach($scope.AssignContexts, function (item, index) {
            if (item.Checked == true) {
                item.Checked = false;
                $scope.Contexts.push(item);
                //$scope.AssignContexts.splice(index, 1);
            };
        });

        angular.forEach($scope.Contexts, function (item) {
            var index = $scope.AssignContexts.indexOf(item);
            if (index > -1) {
                $scope.AssignContexts.splice(index, 1);
            }
        });
    },

    GroupHelper = {

        GetContextByGroup: function (groupId) {
            groupService.getContextByGroup(groupId)
                .then(function (response) {
                    $scope.AssignContexts = response;
                    $scope.AssignContext();
                });
        },

        SelectContext: function (context) {
            context.Checked = !context.Checked;
        },

        GetAllGroups: function () {
            loaderService.ShowLoaderOnElement("#groupArea", "Loading Groups...");
            groupService.getAllGroups()
                .then(function (response) {
                    $scope.GroupsList = response;
                    loaderService.HideLoader("#groupArea");

                });
        },

        LoadGroupById: function (id) {
            groupService.getGroup(id)
           .then(function (response) {
               $scope.Group = response;
           });
        },

        SearchGroups: function () {
            loaderService.ShowLoaderOnElement("#groupArea", "Searching Groups...");
            groupService.Search($scope.Search)
                .then(function (response) {
                    $scope.GroupsList = response;
                    loaderService.HideLoader("#groupArea");
                });
        },

        UpdateGroup: function () {
            groupService.updateGroup($scope.Group)
               .then(function (response) {
                   $location.path("groups");
               }, function (err) {

               });
        },

        GetAllContexts: function () {

            groupService.getAllContexts()
               .then(function (response) {
                   // $scope.Contexts = response;
                   angular.forEach(response, function (item) {
                       item.Checked = false;
                       item.Assigned = false;
                       $scope.Contexts.push(item);
                   });

                   if ($scope.GroupId > 0) {
                       GroupHelper.GetContextByGroup($scope.GroupId);
                   }
               });
        },


        CreateGroup: function () {
            loaderService.ShowLoader("Creating Group...")
            groupService.createGroup({ Group: $scope.Group, Contexts: $scope.AssignContexts })
                .then(function (response) {
                    if (response.Success) {
                        loaderService.HideLoader();
                        $location.path("groups");
                    }
                    else {
                        $scope.Error = response.Message;
                        loaderService.HideLoader();
                    }
                }, function () {
                    $scope.Error = "We are unable to create group at this time, Please try again later.";
                    loaderService.HideLoader();
                });
        },

        DeleteGroup: function (groupId) {
            if (confirm("Are you sure?")) {
                loaderService.ShowLoaderOnElement("#groupArea", "Deleting Groups...");
                groupService.deleteGroup(groupId)
                .then(function (response) {
                    $scope.GetAllGroups();

                });
            }
        }
    };

    GroupHelper.GetAllContexts();

    if ($scope.GroupId > 0) {
        $scope.GetGroup();
        //GroupHelper.GetContextByGroup($scope.GroupId);

    }
}]);
//app.directive('duplicate', function () {
//    return {
//        restrict: 'a',
//        require: 'ngmodel',
//        link: function (scope, elm, attrs, ctrl) {
//            ctrl.$parsers.unshift(function (viewvalue) {
//                var duplicate = scope[attrs.duplicate];
//                if (scope.duplicate.indexof(viewvalue) !== -1) {
//                    ctrl.$setvalidity('duplicate', false);
//                    return undefined;
//                } else {
//                    ctrl.$setvalidity('duplicate', true);
//                    return viewvalue;
//                }
//            });
//        }
//    };
//});

