app.controller('place-holder-popup-controller', ['$scope', '$rootScope', 'placeHolderService', '$modalInstance', 'loaderService', 'Context',
    '$timeout', '$modal',
function ($scope, $rootScope, placeHolderService, $modalInstance, loaderService, Context, $timeout, $modal) {
    $scope.isInvalid = false;
    $scope.PlaceHolderVendorAttributes = [];
    $scope.PlaceHolderProductAttributes = [];
    $scope.PlaceHolders = [];
    $scope.Error = "";
    $scope.SaveFromDirtyPopup = false;
    $scope.Message = "";
    $scope.PlaceholderSeasonTime = [];

    $scope.FlowTotal = {
        BuyQty: 0,
        PlannedRcpts: 0,
        OnOrder: 0
    };
    $scope.SavePlaceholderExecuted = false;
    if ($rootScope.DashBoardSearchResults != null && $rootScope.DashBoardSearchResults !== undefined) {
        $scope.TotalBuyQuantity = $rootScope.DashBoardSearchResults.DashBoardInfo.RecBuy;
    }

    if ($rootScope.DashBoardSearchResults != null && $rootScope.DashBoardSearchResults.Season != null) {
        $scope.SelectedSeason = $rootScope.DashBoardSearchResults.Season;
    }

    $scope.InvalidVendor = false;
    $scope.InvalidProduct = false;
    $scope.PlaceHolder = {
        Id: 0,
        BusinessUnitCode: "",
        ClassCode: "",
        SubClassCode: "",
        DepartmentCode: "",
        Name: "",
        Status: "",
        Description: "",

        AttrValue1: "",
        AttrValue2: "",
        AttrValue3: "",
        AttrValue4: "",
        AttrValue5: "",
        AttrValue6: "",
        AttrValue7: "",
        AttrValue8: "",
        AttrValue9: "",
        AttrValue10: "",

        ProjRegST: 0,
        RecBuy: 0,
        BandMultiplier: 0,
        ROS: 0,
        StoreCount: 0,
        Confidence: 0,
        StartWeekNumDefault: 0,
        EndWeekNumDefault: 0,

        VendorAttributesValues: [],
        ProductAttributesValues: [],
        FlowDetail: {
            WeekCodes: [],
            Season: "",
            SeasonTimes: {},
        },
        LocationAttributes: [],
        Zones: [],

        PlaceholderAssortmentAttrValuesDTO: {},

        IsOverwrite: false,
        Thumbnail: ""
    };
    $scope.fromDashBoard = false;
    $scope.OnChanged = function (type) {
        switch (type) {
            case "QTY":
                $scope.FlowTotal.BuyQty = 0;
                if ($scope.PlaceHolder.FlowDetail != null && $scope.PlaceHolder.FlowDetail !== undefined) {
                    angular.forEach($scope.PlaceHolder.FlowDetail.WeekCodes, function (item) {
                        if (item.BuyQty !== undefined && item.BuyQty !== "")
                            $scope.FlowTotal.BuyQty += parseInt(item.BuyQty);
                    });

                }
                break;
                //case "PLRCPTS":
                //    $scope.FlowTotal.PlannedRcpts = 0;
                //    if ($scope.PlaceHolder.FlowDetail != null && $scope.PlaceHolder.FlowDetail !== undefined) {
                //        angular.forEach($scope.PlaceHolder.FlowDetail.PlannedRcpts, function (item) {
                //            if (item !== undefined && item !== "")
                //                $scope.FlowTotal.PlannedRcpts += parseInt(item);
                //        });
                //    }
                //    break;
                //case "ONORDER":
                //    $scope.FlowTotal.OnOrder = 0;
                //    if ($scope.PlaceHolder.FlowDetail != null && $scope.PlaceHolder.FlowDetail !== undefined) {
                //        angular.forEach($scope.PlaceHolder.FlowDetail.OnOrder, function (item) {
                //            if (item !== undefined && item !== "")
                //                $scope.FlowTotal.OnOrder += parseInt(item);
                //        });
                //    }
                //    break;
        }
    };

    $scope.LoadAllCounts = function () {
        $scope.OnChanged("QTY");
        $scope.OnChanged("PLRCPTS");
        $scope.OnChanged("ONORDER");
    };

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //$scope.RemoveDirty = function () {
    //    $("#PlaceholderForm").removeClass("ng-dirty");
    //}

    $scope.SavePlaceHolder = function () {
        PlaceHolderHelper.SavePlaceHolder(false);
        //$scope.RemoveDirty();
    }

    $scope.CopyPlaceHolder = function () {
        PlaceHolderHelper.SavePlaceHolder(true);
        //$scope.RemoveDirty();
    };

    $scope.DisableCopyPlaceHolder = true;
    if ($scope.PlaceHolder.Id > 0) {
        $scope.DisableCopyPlaceHolder = false;
    }

    $scope.OnTextChanged = function () {
        PlaceHolderHelper.SetPlaceHolderDescription();
    }

    $scope.OnSaveAsClick = function () {
        PlaceHolderHelper.OnSaveAsClick();
    };

    $scope.HighLightWeekCode = function (weekCode) {
        return PlaceHolderHelper.HighLightWeekCode(weekCode);
    };

    $scope.OnClickCancel = function () {
        PlaceHolderHelper.OnClickCancel();
    }

    $scope.OnNumberAndFloatTextChnaged = function (attr) {
        if (attr.SelectedVal !== "") {
            var outOfRange = PlaceHolderHelper.IsOutOfRange(attr.SelectedVal, attr.LowLimit, attr.HighLimit, attr.DataType)
            if (!outOfRange) {
                attr.InvalidClass = false;
            }
        }
    }

    PlaceHolderHelper = {

        LoadPlaceHolderVendorAttributes: function () {
            loaderService.ShowLoaderOnElement("#placeholder", "Loading Placeholder...");

            var bizCode = $rootScope.Business.UnitCode;
            var depCode = $rootScope.Department.DepartmentCode;
            var clsCode = $rootScope.Class.ClassCode;
            var subClsCode = $rootScope.SubClass.SubclassCode;

            var placeholderId = ($scope.PlaceHolder != null && $scope.PlaceHolder !== undefined) ? $scope.PlaceHolder.Id : 0;

            placeHolderService.getPlaceHolderVendorAttributes(bizCode, depCode,
                clsCode, subClsCode, placeholderId)
                .then(function (response) {
                    $scope.PlaceHolderVendorAttributes = [];
                    angular.forEach(response, function (item) {

                        if (item.SelectedVal === "")
                            item.SelectedVal = item.DefaultValue;

                        item.InvalidClass = false;
                        $scope.PlaceHolderVendorAttributes.push(item);
                    });

                    //if ($scope.PlaceHolder != null && $scope.PlaceHolder !== undefined &&
                    //    $scope.PlaceHolder.SelectedVendorAttributesValues !== undefined
                    //    && $scope.PlaceHolder.SelectedVendorAttributesValues.length > 0) {

                    //    PlaceHolderHelper.SetPlaceHolderVendorAttrValues($scope.PlaceHolder.SelectedVendorAttributesValues);
                    //}

                });
        },

        LoadPlaceHolderProductAttributes: function () {

            var bizCode = $rootScope.Business.UnitCode;
            var depCode = $rootScope.Department.DepartmentCode;
            var clsCode = $rootScope.Class.ClassCode;
            var subClsCode = $rootScope.SubClass.SubclassCode;
            var placeholderId = ($scope.PlaceHolder != null && $scope.PlaceHolder !== undefined) ? $scope.PlaceHolder.Id : 0;

            placeHolderService.getPlaceHolderProductAttributes(bizCode, depCode,
                clsCode, subClsCode, placeholderId)
                .then(function (response) {
                    $scope.PlaceHolderProductAttributes = [];
                    angular.forEach(response, function (item) {

                        if (item.SelectedVal === "")
                            item.SelectedVal = item.DefaultValue;

                        item.InvalidClass = false;
                        $scope.PlaceHolderProductAttributes.push(item);
                    });

                    //Set product attributes values
                    //if ($scope.PlaceHolder != null && $scope.PlaceHolder !== undefined &&
                    //    $scope.PlaceHolder.SelectedProductAttributesValues != null &&
                    //   $scope.PlaceHolder.SelectedProductAttributesValues !== undefined
                    //   && $scope.PlaceHolder.SelectedProductAttributesValues.length > 0) {

                    //    PlaceHolderHelper.SetPlaceHolderProductAttrValues($scope.PlaceHolder.SelectedProductAttributesValues);                    //    
                    //}
                    PlaceHolderHelper.SetFlowDetail($scope.PlaceHolder.FlowDetail);

                });
        },

        GetAttributeValByIndex: function (attributes, index) {
            if (attributes.length >= index)
                return attributes[index];

            return "";
        },

        IsValueChosenFromExisting: function (value, validItemAttributeValues) {
            var isExist = false;

            if (value == "" || value == null || value === undefined) //If nothing select so we are assuming it is valid attribute value
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
        },

        IsOutOfRange: function (value, lowLimit, highLimit,dataType) {

            if (value === "" || value===null)
                return false;

            if (lowLimit === "")
                lowLimit = "-999999999";

            if (highLimit === "")
                highLimit = "999999999";

            lowLimit = parseInt(lowLimit);
            highLimit = parseInt(highLimit);

            if (dataType === "TEXT") {
                var textVal = value;
                if (textVal.length < lowLimit || textVal.length > highLimit) {
                    return true;
                }
            }
            else {
                var val = parseInt(value);

                if (val < lowLimit || val > highLimit) {
                    return true;
                }
            }

            return false;
        },

        SavePlaceHolder: function (copy) {

            $scope.Error = "";
            $scope.Message = "";
            $scope.InvalidVendor = false;
            $scope.InvalidProduct = false;
            $scope.isInvalid = false;

            angular.forEach($scope.PlaceHolderVendorAttributes, function (item, index) {
                if (item.SelectedVal !== "" && (item.DataType === "NUMBER" || item.DataType === "FLOAT" || item.DataType === "TEXT")) {
                    item.InvalidClass = PlaceHolderHelper.IsOutOfRange(item.SelectedVal, item.LowLimit, item.HighLimit, item.DataType);

                    if (item.InvalidClass) {
                        $scope.isInvalid = item.InvalidClass;
                        $scope.InvalidVendor = true;

                    }
                }
            });

            angular.forEach($scope.PlaceHolderProductAttributes, function (item, index) {
                if (item.SelectedVal !== "" && (item.DataType === "NUMBER" || item.DataType === "FLOAT" || item.DataType === "TEXT")) {
                    item.InvalidClass = PlaceHolderHelper.IsOutOfRange(item.SelectedVal, item.LowLimit, item.HighLimit, item.DataType);

                    if (item.InvalidClass) {
                        $scope.isInvalid = item.InvalidClass;
                        $scope.InvalidProduct = true;

                    }
                }
            });

            if ($scope.isInvalid)
                return;
            loaderService.ShowLoaderOnElement("#placeholder", "Saving place holder..");
            var placeHolder = $scope.PlaceHolder;// = {};
            var dashBoardSearchResult = $rootScope.DashBoardSearchResults;//It has been filled when we search in dashboard.

            if (placeHolder.Id > 0 && !Context.fromDashBoard) { //TODO: CHeck if FromDashBoard false

                placeHolder.BusinessUnitCode = $rootScope.Business.UnitCode;
                placeHolder.ClassCode = $rootScope.Class.ClassCode;
                placeHolder.SubClassCode = $rootScope.SubClass.SubclassCode;
                placeHolder.DepartmentCode = $rootScope.Department.DepartmentCode;

                if ($scope.SelectedSeason !== undefined
                    && $scope.SelectedSeason !== null) {
                    placeHolder.FlowDetail.Season = $scope.SelectedSeason.Season;
                }
            }
            else {
                if (dashBoardSearchResult.DashBoardInfo) {
                    var dashBoardInfo = dashBoardSearchResult.DashBoardInfo;

                    placeHolder.LocationAttributes = dashBoardSearchResult.LocationAttributes;

                    placeHolder.BusinessUnitCode = $rootScope.Business.UnitCode;
                    placeHolder.ClassCode = $rootScope.Class.ClassCode;
                    placeHolder.SubClassCode = $rootScope.SubClass.SubclassCode;
                    placeHolder.DepartmentCode = $rootScope.Department.DepartmentCode;
                    placeHolder.Thumbnail = Context.Thumbnail;
                    placeHolder.Context = {};

                    var status = placeHolder.PlaceholderAssortmentAttrValuesDTO.Status;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO = {};

                    placeHolder.PlaceholderAssortmentAttrValuesDTO.ProjRegST = dashBoardInfo.ProjRegSt;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.RecBuy = dashBoardInfo.RecBuy;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.BandMultiplier = dashBoardInfo.BandMultiplier;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.BandName = dashBoardInfo.BandName;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.ROS = dashBoardInfo.ROS;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.StoreCount = dashBoardInfo.StoreCount;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.Confidence = dashBoardInfo.Confidence;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.StartWeekNumDefault = dashBoardSearchResult.StartWeek;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.EndWeekNumDefault = dashBoardSearchResult.EndWeek;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.ProtTgtInv = dashBoardInfo.ProtTgtInv;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.Status = status;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.WOF = dashBoardInfo.WOF;;

                    placeHolder.ZoneOverride = dashBoardSearchResult.EnableZones;
                    placeHolder.PlaceholderAssortmentAttrValuesDTO.ZoneOverride = dashBoardSearchResult.EnableZones;


                    angular.forEach(dashBoardSearchResult.Attributes, function (item, index) {
                        placeHolder.PlaceholderAssortmentAttrValuesDTO['AttrValue' + (index + 1)] =
                            PlaceHolderHelper.GetAttributeValByIndex(dashBoardSearchResult.Attributes, index);
                    });

                    //placeHolder.PlaceholderAssortmentAttrValuesDTO.AttrValue19 = dashBoardInfo.WOF;

                    placeHolder.Zones = [];

                    angular.forEach(dashBoardSearchResult.Zones, function (item, index) {
                        if (item.SelectedWeekCode != null) {
                            placeHolder.Zones.push({
                                StartWeek: item.SelectedWeekCode,
                                EndWeek: placeHolder.PlaceholderAssortmentAttrValuesDTO.EndWeekNumDefault,
                                Name: item.Name
                            });
                        }
                    });
                }

                //From App.js
                if ($scope.SelectedSeason !== undefined
                    && $scope.SelectedSeason !== null) {
                    placeHolder.FlowDetail.Season = $scope.SelectedSeason.Season;
                }
            }

            //Fill Vendor Attributes
            if ($scope.PlaceHolderVendorAttributes.length > 0) {
                //if (placeHolder.VendorAttributesValues == null) {
                placeHolder.VendorAttributesValues = [];
                //}
                angular.forEach($scope.PlaceHolderVendorAttributes, function (item, index) {

                    var isExistChosen = PlaceHolderHelper.IsValueChosenFromExisting(item.SelectedVal,
                        item.ValidAttributesValues);

                    placeHolder.VendorAttributesValues.push({
                        AttributeName: item.Name,
                        AttrValueColumnName: item.AttrValuesColumnName,
                        Value: item.SelectedVal,
                        IsExistingValueChoson: isExistChosen
                    });
                });
            }

            //Fill Product Attributes
            if ($scope.PlaceHolderProductAttributes.length > 0) {
                placeHolder.ProductAttributesValues = [];
                angular.forEach($scope.PlaceHolderProductAttributes, function (item, index) {

                    var isExistChosen = PlaceHolderHelper.IsValueChosenFromExisting(item.SelectedVal,
                        item.ValidAttributesValues);

                    placeHolder.ProductAttributesValues.push({
                        AttributeName: item.Name,
                        AttrValueColumnName: item.AttrValuesColumnName,
                        Value: item.SelectedVal,
                        IsExistingValueChoson: isExistChosen
                    });
                });

            }

            if (copy) {
                //Save place holder here.
                placeHolderService.copyPlaceHolder(placeHolder)
                    .then(function (response) {

                        //Conserve it in rootscope in app.js so that we can use it
                        //as a bookmark.
                        $rootScope.ConserveSavedPlaceHolder(response);

                        $scope.PlaceHolder = response;

                        PlaceHolderHelper.SetFlowDetail($scope.PlaceHolder.FlowDetail);

                        loaderService.HideLoader("#placeholder");

                        $scope.Message = "Your changes has been saved.";
                        $scope.SavePlaceholderExecuted = true;
                        $rootScope.SavePlaceHolderButtonText = "Edit";

                        if ($scope.SaveFromDirtyPopup) {
                            $modalInstance.dismiss("cancel");
                            $scope.SaveFromDirtyPopup = false;
                        }

                    }, function () {
                        loaderService.HideLoader("#placeholder");
                        $scope.Error = "We are unable to save your changes at this time, Please try again later.";
                    });
            }
            else {
                //Save place holder here.
                placeHolderService.savePlaceHolder(placeHolder)
                    .then(function (response) {

                        //Conserve it in rootscope in app.js so that we can use it
                        //as a bookmark.
                        $rootScope.ConserveSavedPlaceHolder(response);

                        $scope.PlaceHolder = response;

                        PlaceHolderHelper.SetFlowDetail($scope.PlaceHolder.FlowDetail);

                        loaderService.HideLoader("#placeholder");

                        $scope.Message = "Your changes has been saved.";

                        $scope.SavePlaceholderExecuted = true;

                        $rootScope.SavePlaceHolderButtonText = "Edit";

                        if ($scope.SaveFromDirtyPopup) {
                            $modalInstance.dismiss("cancel");
                            $scope.SaveFromDirtyPopup = false;
                        }

                    }, function () {
                        loaderService.HideLoader("#placeholder");
                        $scope.Error = "We are unable to save your changes at this time, Please try again later.";
                    });
            }
        },

        SetPlaceHolderVendorAttrValues: function (vendorAttrValues) {
            if (vendorAttrValues != null) {

                angular.forEach(vendorAttrValues, function (item, index) {
                    if ($scope.PlaceHolderVendorAttributes.length > 0) {

                        PlaceHolderHelper.SetAttrSelectedValues(item, $scope.PlaceHolderVendorAttributes);
                        //$scope.PlaceHolderVendorAttributes[index].SelectedVal = item;
                    }
                });
            }
        },

        SetAttrSelectedValues: function (attributeValue, attributes) {
            for (var index = 0; index <= attributes.length - 1; index++) {
                var attr = attributes[index];
                if (attr.AttrValuesColumnName === attributeValue.AttrValueColumnName) {
                    attr.SelectedVal = attributeValue.Value;
                    break;
                }
            }
        },

        SetPlaceHolderProductAttrValues: function (productAttrValues) {
            if (productAttrValues.length > 0) {
                angular.forEach(productAttrValues, function (item) {
                    if ($scope.PlaceHolderProductAttributes.length > 0) {

                        PlaceHolderHelper.SetAttrSelectedValues(item, $scope.PlaceHolderProductAttributes);
                    }
                });
            }
        },

        SetPlaceHolderDescription: function () {
            $scope.PlaceHolder.Description = "";
            angular.forEach($scope.PlaceHolderProductAttributes, function (attribute) {
                if (attribute.Name === "Style Name" && attribute.SelectedVal !== undefined && attribute.SelectedVal !== '') {
                    $scope.PlaceHolder.Description = attribute.SelectedVal;
                }
                if (attribute.Name === "DSW Color" && attribute.SelectedVal !== undefined && attribute.SelectedVal !== '') {
                    if ($scope.PlaceHolder.Description !== "") {
                        $scope.PlaceHolder.Description += " " + attribute.SelectedVal;
                    }
                    else {
                        $scope.PlaceHolder.Description += attribute.SelectedVal;
                    }
                }
            });
            angular.forEach($scope.PlaceHolderVendorAttributes, function (attribute) {
                if (attribute.Name === "Style Name" && attribute.SelectedVal !== undefined && attribute.SelectedVal !== '') {
                    $scope.PlaceHolder.Description = attribute.SelectedVal;
                }
                if (attribute.Name === "DSW Color" && attribute.SelectedVal !== undefined && attribute.SelectedVal !== '') {
                    if ($scope.PlaceHolder.Description !== "") {
                        $scope.PlaceHolder.Description += " " + attribute.SelectedVal;
                    }
                    else {
                        $scope.PlaceHolder.Description += attribute.SelectedVal;
                    }
                }
            });
        },

        CheckIfElementAlreadyExist: function (arrayToCheck, value) {
            var isExist = false;
            for (var index = 0; index <= arrayToCheck.length - 1; index++) {
                var item = arrayToCheck[index];
                if (parseInt(item) == parseInt(value)) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        },

        GetWeekCodeValue: function (weekCode, weekCodesFromPlaceholder) {
            var weekCodeVal = 0;
            angular.forEach(weekCodesFromPlaceholder, function (item) {
                if (item.WeekCode === weekCode) {
                    weekCodeVal = item.BuyQty;
                }
            });

            return weekCodeVal;
        },

        ReadWeek: function (weekCode) {
            var currentWeek = null;
            var index = 0;
            var seasonTime = $scope.SelectedSeason.SeasonTime;
            if (seasonTime == null || seasonTime === undefined) {
                return;
            }
            for (index = 0; index <= seasonTime.length - 1; index++) {
                var week = seasonTime[index];
                if (week.WeekCode == weekCode) {
                    currentWeek = week;
                    break;
                }
            }
            return currentWeek;
        },

        HighLightWeekCode: function (weekCode) {

            function convertToAbs(year, week) {
                return (parseInt(year) * 100) + parseInt(week);
            }

            var week = PlaceHolderHelper.ReadWeek(weekCode);

            if (week == null)
                return;

            var weekNum = week.WeekNum;
            var weekNumAbs = convertToAbs(week.Year, week.WeekNum)

            if ($rootScope.DashBoardSearchResults.StartWeekObj !== undefined
                && $rootScope.DashBoardSearchResults.EndWeekObj !== undefined) {

                var startWeek = $rootScope.DashBoardSearchResults.StartWeekObj;
                var endWeek = $rootScope.DashBoardSearchResults.EndWeekObj;

                var startWeekNumAbs = convertToAbs(startWeek.Year, startWeek.WeekNum);
                var endWeekNumAbs = convertToAbs(endWeek.Year, endWeek.WeekNum);

                //If zone is enable.
                if ($rootScope.DashBoardSearchResults.EnableZones) {
                    var zones = $rootScope.DashBoardSearchResults.Zones;
                    if (zones) {
                        var zoneArr = [];
                        //var weekArr = [];
                        angular.forEach(zones, function (item) {

                            if (item.SelectedWeekCode !== undefined && item.SelectedWeekCode != null
                                && item.SelectedWeekCode !== "") {
                                var selectedWeek = PlaceHolderHelper.ReadWeek(item.SelectedWeekCode);
                                item.Year = parseInt(selectedWeek.Year);
                                item.WeekAbs = convertToAbs(selectedWeek.Year, selectedWeek.WeekNum);
                                zoneArr.push(item);
                            }
                        });

                        var minZoneWeekNum = Math.min.apply(Math, zoneArr.map(function (o) {
                            return o.WeekAbs;
                        }));
                        startWeekNumAbs = minZoneWeekNum;
                    }
                }

                return (weekNumAbs >= startWeekNumAbs && weekNumAbs <= endWeekNumAbs);
            }
            return false;
        },

        SetFlowDetail: function (flowDetailFromPlaceholder) {
            var flowDetails = [];
            var flowDetail = { WeekCodes: [], SeasonTime: {} };
            if (flowDetailFromPlaceholder != null && flowDetailFromPlaceholder !== undefined) {
                flowDetail = flowDetailFromPlaceholder;
            }
            //if ($scope.PlaceHolder.FlowDetail === undefined || $scope.PlaceHolder.FlowDetail == null) {
            $scope.PlaceHolder.FlowDetail = {};
            $scope.PlaceHolder.FlowDetail.WeekCodes = [];
            // }
            //if ($scope.PlaceHolder.FlowDetail.SeasonTime !== null && $scope.PlaceHolder.FlowDetail.SeasonTime !== undefined) {
            //    angular.forEach($scope.PlaceHolder.FlowDetail.SeasonTime, function (item) {
            //        var weekCodeBuyQty = PlaceHolderHelper.GetWeekCodeValue(item.WeekCode, flowDetail.WeekCodes);
            //        $scope.PlaceHolder.FlowDetail.WeekCodes.push({
            //            BuyQty: weekCodeBuyQty,
            //            WeekCode: item.WeekCode
            //        });
            //    });
            //}
            //else {
            angular.forEach($scope.SelectedSeason.SeasonTime, function (item) {
                var weekCodeBuyQty = PlaceHolderHelper.GetWeekCodeValue(item.WeekCode, flowDetail.WeekCodes);
                $scope.PlaceHolder.FlowDetail.WeekCodes.push({
                    BuyQty: weekCodeBuyQty,
                    WeekCode: item.WeekCode
                });
            });
            // }


            //if (!$scope.$$phase) {
            //    $scope.$apply(function () {
            //        $scope.LoadAllCounts();
            //    });
            //}
            //else {
            $scope.LoadAllCounts();
            //}
            // }
        },

        LoadPlaceHolder: function () {

            if (Context != null && Context !== undefined) {

                if (Context.Placeholder != null && Context.Placeholder !== undefined) {
                    if (Context.Placeholder.FlowDetail != null && !Context.fromDashBoard) { //TODO: CHeck if FromDashBoard false
                        $scope.SelectedSeason = {
                            Season: Context.Placeholder.FlowDetail.Season,
                            SeasonTime: Context.Placeholder.FlowDetail.SeasonTime.SeasonTime
                        };
                    }

                    $scope.PlaceHolder = Context.Placeholder;

                    PlaceHolderHelper.LoadPlaceHolderProductAttributes();
                    PlaceHolderHelper.LoadPlaceHolderVendorAttributes();

                    $scope.PlaceHolder.Thumbnail = Context.Thumbnail;
                    if (typeof $rootScope.DashBoardSearchResults === 'undefined')
                        $rootScope.DashBoardSearchResults = {};

                    if (!Context.fromDashBoard) {
                        $rootScope.DashBoardSearchResults.StartWeekObj = $scope.PlaceHolder.StartWeekObj;
                        $rootScope.DashBoardSearchResults.EndWeekObj = $scope.PlaceHolder.EndWeekObj;
                        $rootScope.DashBoardSearchResults.EnableZones = $scope.PlaceHolder.PlaceholderAssortmentAttrValuesDTO.ZoneOverride;
                        $rootScope.DashBoardSearchResults.Zones = $scope.PlaceHolder.Zones;

                        if ($rootScope.DashBoardSearchResults.EnableZones) {
                            angular.forEach($rootScope.DashBoardSearchResults.Zones, function (item) {

                                var week = PlaceHolderHelper.ReadWeek(item.StartWeek);

                                item.SelectedWeekCode = week.WeekCode;
                                item.WeekNum = week.WeekNum;
                            })
                        }

                    }
                    $scope.DisableCopyPlaceHolder = false;
                }
                else {
                    PlaceHolderHelper.LoadPlaceHolderProductAttributes();
                    PlaceHolderHelper.LoadPlaceHolderVendorAttributes();
                    PlaceHolderHelper.SetFlowDetail(null);
                }
            }
            else {
                PlaceHolderHelper.LoadPlaceHolderProductAttributes();
                PlaceHolderHelper.LoadPlaceHolderVendorAttributes();
                PlaceHolderHelper.SetFlowDetail(null);
            }

            loaderService.HideLoader("#placeholder");
        },

        OnSaveAsClick: function () {

            var modalInstance = $modal.open({
                templateUrl: 'modules/dashboard/views/save-as-cc-name-popup.html',
                controller: 'save-as-cc-name-controller',
                size: 'small',
                resolve: {
                    Context: function () {
                        return {
                            placeHolderName: $scope.PlaceHolder.Name
                        };
                    }
                }
            });
            modalInstance.result.then(function (response) {
                console.log('Model Popup Result:' + response);
                if (response !== undefined && response !== null) {

                    $scope.PlaceHolder.Name = response;
                    PlaceHolderHelper.SavePlaceHolder(true);
                }
            });
        },

        OnClickCancel: function () {

            $modalInstance.close({ Refresh: $scope.SavePlaceholderExecuted });
            //if ($("#PlaceholderForm").hasClass("ng-dirty")) {
            //    var modalInstance = $modal.open({
            //        templateUrl: 'modules/dashboard/views/placeholder-showing-warning.html',
            //        controller: 'cancel-controller',
            //        size: 'small',
            //        resolve: {
            //            Context: function () {
            //                return {

            //                };
            //            }
            //        }
            //    });

            //modalInstance.result.then(function (result) {
            //    if (result.Save) {
            //        $scope.SaveFromDirtyPopup = true;
            //        PlaceHolderHelper.SavePlaceHolder(false);
            //    }
            //    else {

            //    }
            //});
        },

    };

    //Check if we have place holder  
    PlaceHolderHelper.LoadPlaceHolder();

    $scope.$on('after-search-executed', function (event, data) {
        $scope.TotalBuyQuantity = $rootScope.DashBoardSearchResults.DashBoardInfo.RecBuy;
    })

    $scope.TotalWeeksSelected = $rootScope.DashBoardSearchResults.TotalWeeksSelected;

}]);

app.controller('save-as-cc-name-controller', ['$scope', '$rootScope', 'placeHolderService', '$modalInstance', '$modal', 'Context',
function ($scope, $rootScope, placeHolderService, $modalInstance, $modal, Context) {

    $scope.Error = "";

    $scope.Message = "";

    $scope.PlaceHolderName = Context.placeHolderName;

    $scope.CheckCCName = function () {
        placeHolderService.checkCCName($scope.PlaceHolderName)
            .then(function (response) {
                if (response !== null && response !== undefined) {
                    if (response) {
                        $scope.OnOkClick();
                    }
                    else {
                        $modalInstance.close($scope.PlaceHolderName);
                    }
                }
            });
    };

    $scope.OnOkClick = function () {
        if (confirm("Overwrite existing CC Name?") == true) {
            $modalInstance.close($scope.PlaceHolderName);
        }
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
app.controller('cancel-controller', ['$scope', '$rootScope', 'placeHolderService', '$modalInstance', '$modal', 'Context',
function ($scope, $rootScope, placeHolderService, $modalInstance, $modal, Context) {

    $scope.Error = "";

    $scope.Message = "";
    //$scope.CloseWarningPopupFromButton = function (SavePlaceholder) {
    //    $modalInstance.close({ Save: $scope.SavePlaceholder })
    //};
    $scope.Ok = function () {
        $modalInstance.close({ Save: true })
    };

    $scope.Cancel = function () {
        $modalInstance.close({ Save: false })
    };

}]);