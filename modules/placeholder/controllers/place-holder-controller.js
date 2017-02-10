app.controller('place-holder-controller', ['$scope', '$rootScope', 'placeHolderService', 'lookupService', 'loaderService', '$modal',
function ($scope, $rootScope, placeHolderService, lookupService, loaderService, $modal) {

    $scope.PlaceHolders = [];

    $scope.DeletePlaceHolder = [];

    $scope.DisableButtons = true;

    $scope.PlaceHoderItemAttributes = [];
    $scope.StyleNames = [];
    $scope.MerchVendorNames = [];

    $scope.PlaceHolderStatus = "";

    $scope.DeleteButtonText = "Delete";
    $scope.WeekLoaded = false;

    $scope.FirstSearchAttributes = [];
    $scope.SecondSearchAttributes = [];
    $scope.ShowSearchArea = false;
    $scope.Weeks = [];
    $scope.Error = "";

    $scope.SelectAll = false;

    $scope.PlaceHolderStatusList = ['NEW', 'ACTIVE', 'PUBLISHED', 'OBSOLETE'];
    //$scope.PlaceHolderStatusList = ['NEW', 'ACTIVE', 'PUBLISHED'];

    $scope.StyleNameList = [];

    $scope.MerchVendorNameList = [];

    //   $scope.PlaceHolderVendorAttributes = [];
    //   $scope.PlaceHolderProductAttributes = [];

    $scope.DT = new Date();
    $scope.SearchInputs = {
        Name: "",
        Status: ['NEW', 'ACTIVE', 'PUBLISHED'],
        StartWeek: "",
        EndWeek: "",
        StyleName: "",
        MerchVendorName: "",
        Season: "",
        Business: "",
        Department: "",
        Class: "",
        SubClass: "",
        LastUpdateDate: ""
    };

    $scope.WeekRange = {
        Min: 1,
        Max: 52,
        MinStart: 0,
        MinEnd: 1,
        Disabled: true
    };

    $scope.Weeks = [];
    $scope.AllSeasons = [];
    $scope.Date = { startDate: null, endDate: null };
    $scope.DateHelper = {
        SelectedDate: { startDate: GetStartDate(), endDate: GetEndDate() },
    };

    $scope.SeasonInfo = {
        SelectedSeason: null
    };

    $scope.OnChangeSeason = function () {
        //if ($scope.SeasonInfo.SelectedSeason != null) {
        if ($scope.SearchInputs.Season == "" || $scope.SearchInputs.Season == null
            || $scope.SearchInputs.Season === undefined) {
            $scope.WeekRange.Disabled = true;
        }

        angular.forEach($scope.AllSeasons, function (item) {
            if (item.Season == $scope.SearchInputs.Season) {
                $scope.Weeks = item.SeasonTime;

                $scope.WeekLoaded = !$scope.WeekLoaded;

                $scope.WeekRange.MinStart = 1;
                $scope.WeekRange.MinEnd = $scope.Weeks.length;
                $scope.WeekRange.Max = $scope.WeekRange.MinEnd;
                $scope.WeekRange.Disabled = false;
            }
        })
    };

    function GetEndDate() {
        var today = new Date();
        var prevweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return prevweek;
    };


    function GetStartDate() {
        var today = new Date();
        var prevweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        return prevweek;
    };

$scope.GetAllSeasons = function () {

        lookupService.getSeasonMapping()
               .then(function (response) {
                   $scope.AllSeasons = response;
                   //$scope.SeasonInfo.SelectedSeason = $scope.AllSeasons[0];
                   //$scope.Weeks = $scope.SeasonInfo.SelectedSeason.SeasonTime;
               });
    }

    $scope.OnPlaceHolderSelected = function () {
        $scope.DisableButtons = true;
        for (var index = 0; index <= $scope.PlaceHolders.length - 1; index++) {
            var placeHolder = $scope.PlaceHolders[index];
            if (placeHolder.Checked) {
                $scope.DisableButtons = false;
                break;
            }
        }
    };

    $scope.OnPlaceHolderSelectAll = function () {

        if (!$scope.SelectAll) {
            $scope.SelectAll = true;
            $scope.DisableButtons = false;
            angular.forEach($scope.PlaceHolders, function (item) {
                item.Checked = true;
            });
        }
        else {
            $scope.SelectAll = false;
            angular.forEach($scope.PlaceHolders, function (item) {
                item.Checked = false;
            });
            $scope.DisableButtons = true;
        }

    }

    $scope.DeletePlaceHolders = function () {
        if (confirm("Are you sure?") == true) {
            $scope.DisableButtons = true;
            PlaceHolderListHelper.DeletePlaceHolders();
        }
    };

    $scope.DeletePlaceHolder = function (placeHolder) {
        if (confirm("Delete Placeholder " + placeHolder.Name + "?") == true) {
            PlaceHolderListHelper.DeletePlaceHolder(placeHolder);
        }
    };

    $scope.SeachInPlaceHolders = function () {
        PlaceHolderListHelper.SearchInPlaceHolders();
    };

    //$scope.OnChangeAttributes = function () {
    //    PlaceHolderListHelper.OnChangeAttributes();
    //};
    $scope.OnChangeProductAttributes = function () {

        PlaceHolderListHelper.OnChangeProductAttributes();
    };
    $scope.OnChangeVendorAttributes = function () {
        PlaceHolderListHelper.OnChangeVendorAttributes();
    };
    $scope.OnChangeDashboardAttributes = function () {
        PlaceHolderListHelper.OnChangeDashboardAttributes();
    };

    //$scope.OpenPlaceHolder = function (placeHolderId) {
    //    var modalInstance = $modal.open({
    //        templateUrl: 'modules/dashboard/views/placeholder.html',
    //        controller: 'place-holder-popup-controller',
    //        size: 'lg',
    //        resolve: {
    //            Context: function () {
    //                return { PlaceHolderId: placeHolderId }
    //            }
    //        }

    //    });

    //    modalInstance.result.then();
    //};

    $scope.LoadSearchAttributes = function () {
        if ($scope.PlaceHoderItemAttributes.length > 0) {
            $scope.FirstSearchAttributes = $scope.PlaceHoderItemAttributes.slice(0, 2);

            $scope.SecondSearchAttributes = $scope.PlaceHoderItemAttributes.slice(2, 4);
        }
    };

    $scope.$on('context-updated-on-ok-button', function (evt, data) {

        $rootScope.Business = { UnitCode: data.BizName };
        $rootScope.Department = { DepartmentCode: data.Department };
        $rootScope.Class = { ClassCode: data.Class };
        $rootScope.SubClass = { SubclassCode: data.SubClass };

        lookupService.getSeasonMapping($rootScope.Business.UnitCode,
            $rootScope.Department.DepartmentCode, $rootScope.Class.ClassCode, $rootScope.SubClass.SubclassCode)
        .then(function (response) {
            $scope.AllSeasons = response;
            PlaceHolderListHelper.SearchInPlaceHolders();
        });
    });

    $scope.OnLinkPlaceholderClick = function () {
        PlaceHolderListHelper.OpenLinkPlaceholder();
    };

    $scope.OpenPlaceHolder = function (placeholderId) {
        PlaceHolderListHelper.OpenPlaceHolder(placeholderId);
    };

    PlaceHolderListHelper = {


        //modal popup. this event has been broadcasted by header directive when we hit saveplaceholder button.
        OpenPlaceHolder: function (placeholderId) {

            //In app.js this method was getting biz code from cookie which we set in header directive
            //while selecting BIZ.
            var bizCode = $rootScope.GetBusiness().UnitCode;

            placeHolderService.getPlaceHolder(placeholderId, bizCode)
             .then(function (response) {
                 var placeholder = response;

                 var modalInstance = $modal.open({
                     templateUrl: 'modules/dashboard/views/placeholder.html',
                     controller: 'place-holder-popup-controller',
                     size: 'lg',
                     resolve: {
                         Context: function () {
                             return {
                                 Placeholder: placeholder,
                                 fromDashBoard:false
                             };
                         }
                     }
                 });
                 modalInstance.result.then(function (response) {
                     if (response.Refresh) {
                         PlaceHolderListHelper.SearchInPlaceHolders();
                     }
                 });
             });

        },

        LoadWeeks: function () {
            placeHolderService.loadWeeks()
                .then(function (response) {
                    $scope.Weeks = response;
                });
        },

        GetPlaceHolders: function () {
            loaderService.ShowLoaderOnElement("#placeHolderArea", "Loading Placeholders...");
            placeHolderService.getPlaceHolders()
                .then(function (response) {
                    PlaceHolderListHelper.FillPlaceHolder(response);
                    loaderService.HideLoader("#placeHolderArea");
                });
        },

        GetStyleMerchNameList: function () {
            placeHolderService.loadStyleMerchNameList()
            .then(function (response) {
                $scope.StyleNameList = response.StyleNameList;

                $scope.MerchVendorNameList = response.MerchVendorNameList;
            });
        },

        DeletePlaceHolder: function (placeHolder) {
            placeHolderService.DeletePlaceHolder([placeHolder.Id])
            .then(function (response) {
                var index = $scope.PlaceHolders.indexOf(placeHolder);
                $scope.PlaceHolders.splice(index, 1);
            })
        },

        DeletePlaceHolders: function () {
            $scope.DeleteButtonText = "Deleting Placeholders...";
            var placeHolderSelected = [];
            angular.forEach($scope.PlaceHolders, function (item) {
                if (item.Checked) {
                    placeHolderSelected.push(item.Id);
                }
            });
            placeHolderService.DeletePlaceHolder(placeHolderSelected)
            .then(function (response) {
                $scope.DeleteButtonText = "Delete";
                PlaceHolderListHelper.SearchInPlaceHolders();
            })
        },

        IsValidSearchCreteria: function () {
            if ($scope.SearchInputs.StartWeek == "" || $scope.SearchInputs.StartWeek === undefined
                || $scope.SearchInputs.EndWeek == "" || $scope.SearchInputs.EndWeek === undefined) {
                return true;
            }

            var startWeek = $scope.SearchInputs.StartWeek;
            var endWeek = $scope.SearchInputs.EndWeek;

            function getWeekObj(weekCode) {
                var week = null;
                angular.forEach($scope.Weeks, function (item) {
                    if (item.WeekCode == weekCode) {
                        week = item;
                    }
                })

                return week;
            }

            var startWeekObj = getWeekObj(startWeek);
            var endWeekObj = getWeekObj(endWeek);

            if (startWeekObj.WeekNum > endWeekObj.WeekNum
                || parseInt(startWeekObj.Year) > parseInt(endWeekObj.Year)) {
                return false;
            }
            return true;
        },

        ReadWeekCode: function (index) {
            if (index > 0)
                index = index - 1;

            if ($scope.Weeks[index] !== undefined)
                return $scope.Weeks[index].WeekCode;

            return "";
        },

        BuildDate: function (date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();//new Date(date.getYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
        },

        SearchInPlaceHolders: function () {

            $scope.SearchInputs.StartWeek = "";
            $scope.SearchInputs.EndWeek = "";

            loaderService.ShowLoaderOnElement("#placeHolderArea", "Loading Placeholders...");

            $scope.SearchInputs.Business = $rootScope.Business.UnitCode;
            $scope.SearchInputs.Department = $rootScope.Department.DepartmentCode;
            $scope.SearchInputs.Class = $rootScope.Class.ClassCode;
            $scope.SearchInputs.SubClass = $rootScope.SubClass.SubclassCode;

            $scope.SearchInputs.StartDate = new Date($scope.DateHelper.SelectedDate.startDate.toString()).toDateString();
            $scope.SearchInputs.EndDate = new Date($scope.DateHelper.SelectedDate.endDate.toString()).toDateString();

            if (!$scope.WeekRange.Disabled) {
                $scope.SearchInputs.StartWeek = PlaceHolderListHelper.ReadWeekCode($scope.WeekRange.MinStart);
                $scope.SearchInputs.EndWeek = PlaceHolderListHelper.ReadWeekCode($scope.WeekRange.MinEnd);
            }

            placeHolderService.Search($scope.SearchInputs)
                .then(function (response) {
                    PlaceHolderListHelper.FillPlaceHolder(response);
                    loaderService.HideLoader("#placeHolderArea");
                }, function (error) {
                    loaderService.HideLoader("#placeHolderArea");
                });
        },

        FillPlaceHolder: function (placeholders) {
            $scope.PlaceHolders = [];
            angular.forEach(placeholders, function (item) {
                item.Checked = false;
                $scope.PlaceHolders.push(item);
                if (item.PlaceholderVendorAttributeValue != null && item.PlaceholderVendorAttributeValue.AttrValue18 != null
                    && item.PlaceholderVendorAttributeValue.AttrValue18 !== "") {
                    $scope.StyleNames.push(item.PlaceholderProductAttributeValue.AttrValue18);
                }
                if (item.PlaceholderProductAttributeValue != null && item.PlaceholderProductAttributeValue.AttrValue18 != null
                    && item.PlaceholderProductAttributeValue.AttrValue18 !== "") {
                    $scope.MerchVendorNames.push(item.PlaceholderVendorAttributeValue.AttrValue18);

                }
            });

            $scope.ShowSearchArea = true;

            if ($scope.PlaceHolders.length > 0) {
                $scope.PlaceHoderItemAttributes = $scope.PlaceHolders[0].ItemAttributes;
                if ($scope.FirstSearchAttributes.length <= 0)
                    $scope.LoadSearchAttributes();
            }
        },

        OnChangeProductAttributes: function () {

            var placeHoldersIds = [];

            angular.forEach($scope.PlaceHolders, function (item) {
                if (item.Checked) {
                    placeHoldersIds.push(item.Id);
                }
            });

            var modalInstance = $modal.open({
                templateUrl: 'modules/placeholder/views/change-product-attribute-popup.html',
                controller: 'change-product-attribute-controller',
                size: 'lg',
                resolve: {
                    Context: function () {
                        return {
                            SelectedPlaceholders: placeHoldersIds
                        };
                    }
                }
            });

            modalInstance.result.then(function (response) {
                $scope.DisableButtons = true;
                angular.forEach($scope.PlaceHolders, function (item) {
                    item.Checked = false;
                });
                if (response.Refresh) {
                    PlaceHolderListHelper.SearchInPlaceHolders();
                }
            });

        },
        OnChangeVendorAttributes: function () {

            var placeHoldersIds = [];

            angular.forEach($scope.PlaceHolders, function (item) {
                if (item.Checked) {
                    placeHoldersIds.push(item.Id);
                }
            });

            var modalInstance = $modal.open({
                templateUrl: 'modules/placeholder/views/change-vendor-attribute-popup.html',
                controller: 'change-vendor-attribute-controller',
                size: 'lg',
                resolve: {
                    Context: function () {
                        return {
                            SelectedPlaceholders: placeHoldersIds
                        };
                    }
                }
            });

            modalInstance.result.then(function (response) {
                $scope.DisableButtons = true;
                angular.forEach($scope.PlaceHolders, function (item) {
                    item.Checked = false;
                });
                if (response.Refresh) {
                    PlaceHolderListHelper.SearchInPlaceHolders();
                }
            });

        },

        OnChangeDashboardAttributes: function () {
            var placeHoldersIds = [];

            angular.forEach($scope.PlaceHolders, function (item) {
                if (item.Checked) {
                    placeHoldersIds.push(item.Id);
                }
            });

            var modalInstance = $modal.open({
                templateUrl: 'modules/placeholder/views/change-dashboard-attribute-popup.html',
                controller: 'change-dashboard-attribute-controller',
                size: 'lg',
                resolve: {
                    Context: function () {
                        return {
                            SelectedPlaceholders: placeHoldersIds,
                        };
                    }
                }
            });

            modalInstance.result.then(function (response) {
                $scope.DisableButtons = true;
                angular.forEach($scope.PlaceHolders, function (item) {
                    item.Checked = false;
                });
                if (response.Refresh) {
                    PlaceHolderListHelper.SearchInPlaceHolders();
                }
            });
        },
        OpenLinkPlaceholder: function () {
            var modelInstance = $modal.open({
                templateUrl: 'modules/placeholder/views/link-placeholder.html',
                controller: 'link-placeholder-controller',
                size: 'lg',
                resolve: {

                }
            });

            modelInstance.result.then(function (result) {
                if (result.Refresh)
                    PlaceHolderListHelper.SearchInPlaceHolders();
            });
        }
    };

    //PlaceHolderListHelper.LoadWeeks();
    lookupService.getSeasonMapping($rootScope.Business.UnitCode,
           $rootScope.Department.DepartmentCode, $rootScope.Class.ClassCode, $rootScope.SubClass.SubclassCode)
       .then(function (response) {
           $scope.AllSeasons = response;
           PlaceHolderListHelper.SearchInPlaceHolders();
       });

    PlaceHolderListHelper.GetStyleMerchNameList();

}]);

app.controller('change-attribute-controller', ['$scope', '$rootScope', 'placeHolderService', 'loaderService', '$modalInstance', 'Context',
function ($scope, $rootScope, placeHolderService, loaderService, $modalInstance, Context) {

    $scope.placeHolder = {
        PlaceHoldersIds: [],
        Status: "",
        ItemAttributes: [],
        StartWeek: "",
        EndWeek: ""
    };

    $scope.Error = "";
    $scope.Message = "";

    $scope.PlaceHolderStatus = "";
    $scope.ItemAttributes = Context.ItemAttributes;
    $scope.SelectPlaceholders = Context.selectedplaceholders;

    $scope.LoadWeeks = function () {
        placeHolderService.loadWeeks()
            .then(function (response) {
                $scope.Weeks = response;
            });
    };
    $scope.LoadWeeks();

    $scope.ChangeAttributes = function () {
        $scope.Error = "";

        if ($scope.placeHolder.StartWeek == "" && $scope.placeHolder.EndWeek == "" && $scope.PlaceHolderStatus == "") {
            $scope.Error = "Please enter at-least one attribute's value";
            return;
        }
        $scope.placeHolder.PlaceHoldersIds = $scope.SelectPlaceholders;
        $scope.placeHolder.Status = $scope.PlaceHolderStatus;
        $scope.placeHolder.ItemAttributes = [];

        $scope.placeHolder.BusinessUnitCode = $rootScope.Business.UnitCode;

        angular.forEach($scope.ItemAttributes, function (item) {
            if (item.SelectedVal !== "") {
                $scope.placeHolder.ItemAttributes.push(item.SelectedVal);
            }
        });


        $scope.Message = "";

        loaderService.ShowLoaderOnElement("#change-attribute", "Saving Placeholders...");

        placeHolderService.changeAttributes($scope.placeHolder)
        .then(function (response) {
            //if (response.StatusCode == "OK") {
            //$scope.Message = "Your changes has been saved!.";
            loaderService.HideLoader("#change-attribute");
            $modalInstance.close({});
            //}
        }, function (err) {
            $scope.Error = "We are unable to process your changes at this time, Please try again later.";
            loaderService.HideLoader("#change-attribute");
        });
    };

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');


    };

}]).filter('weekcode', function () {
    return function (weeks, val) {
        return "";
        //if (val > 0)
        //    val = val - 1;

        //if (weeks[val] !== undefined)
        //    return weeks[val].WeekCode;

        //return "";
    };
});

app.controller('change-product-attribute-controller', ['$scope', '$rootScope', 'placeHolderService', 'loaderService', '$modalInstance', 'Context',
    function ($scope, $rootScope, placeHolderService, loaderService, $modalInstance, Context) {

        $scope.Error = "";
        $scope.Message = "";
        $scope.placeHolder = {
            PlaceHoldersIds: [],
            ProductAttributesValues: []
        };
        $scope.SavePlaceholderExecuted = false;
        $scope.PlaceHolderProductAttributes = [];
        $scope.placeHolder.PlaceHoldersIds = Context.SelectedPlaceholders;

        $scope.IsValueChosenFromExisting = function (value, validItemAttributeValues) {
            var isExist = false;

            if (value == "") //If nothing select so we are assuming it is valid attribute value
                return true;

            if (validItemAttributeValues == null || validItemAttributeValues === undefined)
                return true;

            for (var index = 0; index <= validItemAttributeValues.length - 1; index++) {
                var currentVal = validItemAttributeValues[index];
                if (currentVal == value) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        };

        $scope.LoadPlaceHolderProductAttributes = function () {

            var bizCode = $rootScope.Business.UnitCode;
            var depCode = $rootScope.Department.DepartmentCode;
            var clsCode = $rootScope.Class.ClassCode;
            var subClsCode = $rootScope.SubClass.SubclassCode;

            placeHolderService.getPlaceHolderProductAttributes(bizCode, depCode,
                clsCode, subClsCode)
                .then(function (response) {

                    $scope.PlaceHolderProductAttributes = [];

                    angular.forEach(response, function (item) {
                       // item.SelectedVal = item.DefaultValue;
                        $scope.PlaceHolderProductAttributes.push(item);
                    });
                });
        };


        $scope.ChangeProductAttributes = function () {

            //Fill Product Attributes
            if ($scope.PlaceHolderProductAttributes.length > 0) {

                $scope.placeHolder.ProductAttributesValues = [];

                angular.forEach($scope.PlaceHolderProductAttributes, function (item, index) {

                    var isExistChosen = $scope.IsValueChosenFromExisting(item.SelectedVal,
                        item.ValidAttributesValues);

                    $scope.placeHolder.ProductAttributesValues.push({
                        AttributeName: item.Name,
                        AttrValueColumnName: item.AttrValuesColumnName,
                        Value: item.SelectedVal,
                        IsExistingValueChoson: isExistChosen
                    });
                });
            }
            placeHolderService.saveProductAttributes($scope.placeHolder)
            .then(function (response) {
                $scope.Message = "Your changes has been saved!.";
                $scope.SavePlaceholderExecuted = true;
            }, function (err) {
                $scope.Error = "We are unable to process your changes at this time, Please try again later.";
            });
        }

        $scope.Cancel = function () {
            $modalInstance.close({ Refresh: $scope.SavePlaceholderExecuted });
        };
        $scope.LoadPlaceHolderProductAttributes();
    }]);

app.controller('change-vendor-attribute-controller', ['$scope', '$rootScope', 'placeHolderService', 'loaderService', '$modalInstance', 'Context',
    function ($scope, $rootScope, placeHolderService, loaderService, $modalInstance, Context) {

        $scope.Error = "";
        $scope.Message = "";
        $scope.placeHolder = {
            PlaceHoldersIds: [],
            VendorAttributesValues: []
        };
        $scope.SavePlaceholderExecuted = false;
        $scope.PlaceHolderVendorAttributes = [];

        $scope.placeHolder.PlaceHoldersIds = Context.SelectedPlaceholders;

        $scope.IsValueChosenFromExisting = function (value, validItemAttributeValues) {
            var isExist = false;

            if (value == "") //If nothing select so we are assuming it is valid attribute value
                return true;

            if (validItemAttributeValues == null || validItemAttributeValues === undefined)
                return true;

            for (var index = 0; index <= validItemAttributeValues.length - 1; index++) {
                var currentVal = validItemAttributeValues[index];
                if (currentVal == value) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        };

        $scope.LoadPlaceHolderVendorAttributes = function () {
            var bizCode = $rootScope.Business.UnitCode;
            var depCode = $rootScope.Department.DepartmentCode;
            var clsCode = $rootScope.Class.ClassCode;
            var subClsCode = $rootScope.SubClass.SubclassCode;

            placeHolderService.getPlaceHolderVendorAttributes(bizCode, depCode,
                clsCode, subClsCode)
                .then(function (response) {
                    $scope.PlaceHolderVendorAttributes = [];
                    angular.forEach(response, function (item) {
                       // item.SelectedVal = item.DefaultValue;
                        $scope.PlaceHolderVendorAttributes.push(item);
                    });
                });
        };

        $scope.ChangeVendorAttributes = function () {

            //Fill Vendor Attributes
            if ($scope.PlaceHolderVendorAttributes.length > 0) {
                $scope.placeHolder.VendorAttributesValues = [];
                angular.forEach($scope.PlaceHolderVendorAttributes, function (item, index) {

                    var isExistChosen = $scope.IsValueChosenFromExisting(item.SelectedVal,
                        item.ValidAttributesValues);

                    $scope.placeHolder.VendorAttributesValues.push({
                        AttributeName: item.Name,
                        AttrValueColumnName: item.AttrValuesColumnName,
                        Value: item.SelectedVal,
                        IsExistingValueChoson: isExistChosen
                    });
                });
            }
            placeHolderService.saveVendorAttributes($scope.placeHolder)
            .then(function (response) {
                $scope.Message = "Your changes has been saved!.";
                $scope.SavePlaceholderExecuted = true;
            }, function (err) {
                $scope.Error = "We are unable to process your changes at this time, Please try again later.";
            });
        }

        $scope.Cancel = function () {
            $modalInstance.close({ Refresh: $scope.SavePlaceholderExecuted });
        };

        $scope.LoadPlaceHolderVendorAttributes();
    }]);

app.controller('change-dashboard-attribute-controller', ['$scope', '$rootScope', 'placeHolderService', 'loaderService', 'lookupService', '$modalInstance', 'Context',
    function ($scope, $rootScope, placeHolderService, loaderService, lookupService, $modalInstance, Context) {

        $scope.Error = "";
        $scope.Message = "";

        $scope.placeHolder = {
            PlaceHoldersIds: [],
            Status: "",
            PlaceholderAssortmentAttrValues: []

        };
        $scope.SavePlaceholderExecuted = false;
        $scope.placeHolder.PlaceHoldersIds = Context.SelectedPlaceholders;
        $scope.IsValueChosenFromExisting = function (value, validItemAttributeValues) {
            var isExist = false;

            if (value == "")
                return true;

            if (validItemAttributeValues == null || validItemAttributeValues === undefined)
                return true;

            for (var index = 0; index <= validItemAttributeValues.length - 1; index++) {
                var currentVal = validItemAttributeValues[index];
                if (currentVal == value) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        };

        $scope.LoadItemAttributesByContext = function (callBack) {

            var bizCode = $rootScope.Business.UnitCode;
            var depCode = $rootScope.Department.DepartmentCode;
            var clsCode = $rootScope.Class.ClassCode;
            var subclsCode = $rootScope.SubClass.SubclassCode;

            lookupService.getItemAttributesByContext(bizCode, depCode, clsCode, subclsCode)
                .then(function (results) {

                    $scope.ItemAttributes = [];

                    angular.forEach(results, function (item, index) {
                        //item.SelectedVal = item.DefaultValue;
                        $scope.ItemAttributes.push(item);
                    });

                    var isLoadingPlacholder = ($scope.PlaceHolder != null);

                    if (callBack !== undefined && callBack !== null) {
                        callBack();
                    }

                });
        };
        $scope.ChangeDashboardAttributes = function () {

            if ($scope.ItemAttributes.length > 0) {
                $scope.placeHolder.PlaceholderAssortmentAttrValues = [];

                angular.forEach($scope.ItemAttributes, function (item, index) {

                    var isExistChosen = $scope.IsValueChosenFromExisting(item.SelectedVal,
                        item.ValidAttributesValues);

                    $scope.placeHolder.PlaceholderAssortmentAttrValues.push({
                        AttributeName: item.Name,
                        AttrValueColumnName: item.AttrValuesColumnName,
                        Value: item.SelectedVal,
                        IsExistingValueChoson: isExistChosen
                    });
                });
            }
            $scope.placeHolder.BusinessUnitCode = $rootScope.Business.UnitCode;

            placeHolderService.saveDashboardAttributes($scope.placeHolder)
            .then(function (response) {
                $scope.Message = "Your changes has been saved!.";
                $scope.SavePlaceholderExecuted = true;
            }, function (err) {
                $scope.Error = "We are unable to process your changes at this time, Please try again later.";
            });
        };
        $scope.Cancel = function () {
            $modalInstance.close({ Refresh: $scope.SavePlaceholderExecuted });
        };
        $scope.LoadItemAttributesByContext();
    }]);

