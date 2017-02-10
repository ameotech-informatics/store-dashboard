
app.directive('headerContext', function ($modal, $rootScope, $timeout, lookupService, $cookieStore) {

    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'modules/header/views/header.html',
        link: function (scope, element, attr) {

            scope.BizName = "BizUnit";
            scope.DepartmentName = "Department";
            scope.ClassName = "Class";
            scope.SubClassName = "SubClass";
            scope.DisableContext = true;

            scope.Context = {
                Store: "",
                DptCode: "",
                ClsCode: "",
                SubClsCode: ""
            }

            scope.$on('context-updated', function (event, data) {
                //scope.BizName = data.BizName;
                scope.DepartmentName = data.Department;
                scope.ClassName = data.Class;
                scope.SubClassName = data.SubClass;

                // scope.selectExisting();
            });

            $rootScope.PopupOpened = false;

            scope.safeApply = function (callback) {
                if (!scope.$$phase) {
                    scope.$apply(function () {
                        callback();
                    });
                }
                else {
                    callback();
                }
            };

            //Broadcasted from dashboard controller.
            scope.$on('on-load-busineses', function () {
                scope.ContextHelper.LoadBusiness();
                scope.ContextHelper.LoadContext();
            });

            scope.$on('reload-context-changes', function () {
                //  scope.OnChangeSubClass();
            });


            scope.OnChangeSubClass = function () {

                setTimeout(function () {

                    if (scope.ContextModalToSend && scope.ContextModalToSend.SubClass &&
                        scope.ContextModalToSend.SubClass !== undefined
                        && scope.ContextModalToSend.SubClass !== null && scope.ContextModalToSend.SubClass !== "") {

                        $rootScope.ToggleLinks(true);

                        $rootScope.EnablePlaceholderbutton(false);

                        scope.safeApply(function () {
                            scope.BizName = scope.ContextModalToSend.Biz.BusinessUnitName;
                            scope.DepartmentName = scope.ContextModalToSend.Department.Name;
                            scope.ClassName = scope.ContextModalToSend.Class.Name;
                            scope.SubClassName = scope.ContextModalToSend.SubClass.Name;
                        });

                        $rootScope.$broadcast('context-updated-on-ok-button', {
                            BizName: scope.ContextModalToSend.Biz.BusinessUnitCode,
                            Department: scope.ContextModalToSend.Department.Code,
                            Class: scope.ContextModalToSend.Class.Code,
                            SubClass: scope.ContextModalToSend.SubClass.Code
                        });

                    }
                    else {
                        $rootScope.ToggleLinks(false);
                        $rootScope.EnablePlaceholderbutton(true);
                    }

                }, 500)
            };

            scope.onChangeBuz = function () {
                scope.ContextModalToSend.Department = '';
                scope.ContextModalToSend.Class = '';
                scope.ContextModalToSend.SubClass = '';

                scope.ClassName = "";
                scope.DepartmentName = "";
                scope.SubClassName = "";
                scope.BizName = "";

                $rootScope.ToggleLinks(false);
                $rootScope.EnablePlaceholderbutton(true);

                //In App.js
                $rootScope.RemoveContext();

                $rootScope.Business = { UnitCode: scope.ContextModalToSend.Biz.BusinessUnitCode };

                if (scope.ContextModalToSend.Biz !== undefined && scope.ContextModalToSend.Biz != null) {
                    $cookieStore.put('BizCode', scope.ContextModalToSend.Biz.BusinessUnitCode);
                    scope.DisableContext = false;
                }
            };

            scope.onChangeDep = function () {
                scope.ContextModalToSend.SubClass = '';
                $rootScope.ToggleLinks(false);
                $rootScope.EnablePlaceholderbutton(true);
            };

            scope.onChangeClass = function () {
                scope.ContextModalToSend.SubClass = '';
                $rootScope.ToggleLinks(false);
                $rootScope.EnablePlaceholderbutton(true);
            }

            scope.Contexts = [];
            scope.Businesses = [];
            scope.ContextModalToSend = {};

            scope.selectExisting = function () {

                angular.forEach(scope.Departments, function (biz) {
                    if (department.Name == scope.DepartmentName) {
                        scope.ContextModalToSend.Department = department;
                        angular.forEach(department.Classes, function (clas) {
                            if (clas.Name == scope.ClassName) {
                                scope.ContextModalToSend.Class = clas;
                                angular.forEach(clas.SubClasses, function (sclas) {
                                    if (sclas.Name == scope.SubClassName) {
                                        scope.ContextModalToSend.SubClass = sclas;
                                        //scope.OnChangeSubClass();
                                    }
                                });
                            }
                        });
                    }
                });

            };
            scope.loading = false;
            scope.ContextHelper = {

                LoadContext: function (callback) {
                    scope.loading = true;
                    lookupService.getContexts(function (results) {
                        scope.loading = false;
                        if (results.length > 0) {
                            scope.Contexts = [];
                            angular.forEach(results, function (item, index) {
                                scope.Contexts.push(item);
                            });
                            scope.selectExisting();

                            if (callback !== undefined)
                                callback();
                        }
                    });
                },

                LoadBusiness: function () {
                    scope.Businesses = [];
                    lookupService.getBusinesses().then(function (results) {
                        scope.Businesses = results;
                    });
                }
            };

            scope.ContextHelper.LoadBusiness();

            scope.ContextHelper.LoadContext();

            scope.modalShown = false;
            scope.placeHolderToogle = function () {
                scope.modalShown = !scope.modalShown;
            };

            scope.selectContext = function () {

                var infoOccupied = $cookieStore.get('info-occupied');

                if (infoOccupied != null && infoOccupied !== undefined
                    && infoOccupied == true) {
                    return;
                }

                var modalInstance = $modal.open({
                    templateUrl: 'modules/header/views/select-context-view.html',
                    controller: 'info-popup-controller',
                    size: 'custom',
                    resolve: {

                    }
                });

                modalInstance.result.then(function () {

                });

                $rootScope.PopupOpened = true;
            };

            //Invoked by dashboard controller.
            scope.$on('invoke-info-popup', function () {

                scope.ContextHelper.LoadContext(function () {
                    if (scope.ContextModalToSend.Biz == null || scope.ContextModalToSend.Biz == undefined) {
                        scope.selectContext();
                    }
                });
            });
        }
    };
});

app.controller('info-popup-controller', ['$scope', '$modalInstance', '$cookieStore', function ($scope, $modalInstance, $cookieStore) {

    $scope.GotItClicked = function () {
        $cookieStore.put('info-occupied', true);
        $modalInstance.dismiss('cancel');
    };

    $scope.CancelPopup = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

