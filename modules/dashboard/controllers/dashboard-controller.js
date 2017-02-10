app.controller('dashboard-controller', ['$scope', '$rootScope', 'lookupService', '$modal', 'appService', 'filterService',
    '$timeout', 'loaderService', '$routeParams', 'placeHolderService', '$location', '$q','$interval',
    function ($scope, $rootScope, lookupService, $modal, appService, filterService,
        $timeout, loaderService, $routeParams, placeHolderService, $location, $q, $interval) {

        //Make global loader to hide.
        $scope.showsavedValues = false;
        $scope.CurrentSeason = null;
        $rootScope.ShowLoader = false;
        $scope.PlaceHolder = null;
        $scope.EnableZones = false;
        var timer = false;
        $scope.ItemAttributes = [];
        $scope.LocationAttributes = [];
        $scope.Zones = [];
        $scope.ClustorGraphData = [];
        $rootScope.SavePlaceHolderButtonText = "Add";
        $scope.ItemFilters = [];

        $scope.ClustorGraphLoaded = false;
        $scope.VolumeGrade = {};
        $scope.SeasonProfiles = [];
        $scope.GroupedZones = [];
        $scope.SeasonMapping = [];
        $scope.SeasonTime = [];
        $scope.StoreCountsBySegment = [];
        $scope.StartWeek = "";
        $scope.StartWeekObj = {};
        $scope.EndWeek = "";
        $scope.EndWeekObj = {};
        $scope.WeekMappings = [];
        $scope.LocationAttributesIds = [];
        $scope.TotalItemAttributeValues = [];
        $scope.ZoneWatcher = false;
        $scope.ShowDashBoardArea = false;
        $scope.EcomGraphLoaded = false;




        $scope.DashboardData = {
            BandMultiplier: "",
            ProjRegSt: "",
            RecBuy: "",
            ROS: "",
            StoreCount: "",
            WOF: "",
            BandName: "",
            BandColor: 2,
            StoreCountsBySegments: [],
            ProtTgtInv: 0
        };
        $scope.AutoRefresh = true;

        //We pass $index as a value in season dropdown so need to get this as a model
        $scope.SeasonIndex = -1;

        $scope.StoreCounts = 0;
        $scope.SeasonProfileGraphWatcher = false;
        $scope.AttributesValues = [];

        $scope.Band = {
            BandMultiplier: 0,
            BandColor: 0,
            Confidence: "",
            BandName: "",
            ROS: 0
        };

        $scope.Ecom = {
            AvgPerceLikelyHood: 0,
            PercLikelihoods: [],
            SubClassROS: 0,
            ClusterROS: 0
        };

        $scope.TargetWeeksLength = 1000;
        $scope.LocationContextId = 0;
        $scope.EcomView = false;

        $scope.AllLocationFilterSelected = true;

        $scope.SelectAllFilters = function (forceSearch) {

            $scope.AllLocationFilterSelected = !$scope.AllLocationFilterSelected;

            angular.forEach($scope.LocationAttributes, function (filter) {
                if ($scope.AllLocationFilterSelected) {
                    filter.Checked = true;
                }
                else {
                    filter.Checked = false;
                }
            });

            if (forceSearch !== undefined && forceSearch == true) {
                //If we select/un-select all fiters then start searching in DB            
                $scope.OnLocationFilterChange();
            }

        };

        $scope.SetContextView = function (businessUniCode) {
            if (businessUniCode.toUpperCase() == 'BU58') {
                $scope.EcomView = true;
            }
            else {
                $scope.EcomView = false;
            }
        };

        $scope.OnRefreshIconClicked = function () {

            if ($scope.AutoRefresh === false) {
                $scope.SearchHelper.Search(false, true);
            }
            $scope.AutoRefresh = !$scope.AutoRefresh;
        };

        //It will be fire whenever user select a filter from named item filter textbox.
        $scope.FilterSelected = function ($item, $model, $label, fromPlaceHolder) {

            //We start with named item filter so make location filters to be un-selected.
            //$scope.SelectAllFilters(false, false);

            //$item is and instance of ItemFilter from DB 
            //but if fromPlaceHolder is true then it is a placeholder
            var context = $item.Context;
            $scope.EnableZones = false;
            if (fromPlaceHolder) {

                if ($item.PlaceholderAssortmentAttrValuesDTO !== undefined && $item.PlaceholderAssortmentAttrValuesDTO != null) {
                    
                    $scope.AttributesValues = [$item.PlaceholderAssortmentAttrValuesDTO.AttrValue1,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue2,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue3,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue4,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue5,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue6,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue7,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue8,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue9,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue10,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue11,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue12,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue13,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue14,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue15,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue16,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue17,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue18,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue19,
                        $item.PlaceholderAssortmentAttrValuesDTO.AttrValue20];
                }
            }
            else {
                $scope.AttributesValues = [$item.AttrValue1,
                    $item.AttrValue2,
                    $item.AttrValue3,
                    $item.AttrValue4,
                    $item.AttrValue5,
                    $item.AttrValue6,
                    $item.AttrValue7,
                    $item.AttrValue8,
                    $item.AttrValue9,
                    $item.AttrValue10];
            }

            var bizCode = "";
            var bizName = "";
            if ($item.PlaceholderAssortmentAttrValuesDTO !== undefined
                && $item.PlaceholderAssortmentAttrValuesDTO != null) {
                bizName = $item.PlaceholderAssortmentAttrValuesDTO.BusinessUnitName;
                bizCode = $item.PlaceholderAssortmentAttrValuesDTO.BusinessUnitCode;

                $rootScope.Business = { UnitCode: bizCode };
            }
            //We will broadcast this event on filter selection when we select
            //it from named item filter textbox. curently we are recieving it in header dicrective.
            $rootScope.$broadcast('context-updated', {
                BizName: bizName,
                Department: context.DepartmentName,
                Class: context.ClassName,
                SubClass: context.SubclassName
            });

            $scope.SearchHelper.ContextId = context.Id;


            //Not sure if we need to init search here or not.
            $scope.SearchHelper.Business = { UnitCode: $rootScope.Business.UnitCode };
            $scope.SearchHelper.Department = { DepartmentCode: context.DepartmentCode };
            $scope.SearchHelper.Class = { ClassCode: context.ClassCode };
            $scope.SearchHelper.SubClass = { SubclassCode: context.SubclassCode };

            $scope.SetContextView($rootScope.Business.UnitCode);

            //Set context globally so that we can use it in other controllers.
            $rootScope.SetContext($scope.SearchHelper.Business,
                $scope.SearchHelper.Department,
                $scope.SearchHelper.Class, $scope.SearchHelper.SubClass);

            $scope.SearchHelper.ItemAttributeValues = [];

            //reset store counts
            $scope.StoreCounts = 0;

            LookupHelper.LoadSeasonMapping()
            .then(function () {

                LookupHelper.LoadZones(function () { //Start loading others and searching when we have zones.

                    LookupHelper.LoadLocationAttributes(function () {

                        //Check if we are loading place holder and we do have place holder location
                        //filters in memory which we saved while saving a place holder.
                        //1. Find thru all locations and if GradeCode, SpaceGradeCode and ClustorCode
                        //matched then mark it true otherwise false.
                        if (fromPlaceHolder && $item.LocationAttributes != null
                            && $item.LocationAttributes.length > 0) {
                            angular.forEach($scope.LocationAttributes, function (item) {

                                item.Checked = false;
                                //TODO: Need to stop this loop after we mark item as checked.
                                angular.forEach($item.LocationAttributes, function (location) {
                                    if (item.ClustorCode == location.ClustorCode && item.GradeCode == location.GradeCode
                                        && item.SpaceGradeCode == location.SpaceGradeCode) {
                                        item.Checked = true;
                                    }
                                });

                            });
                        }

                    });

                    //If we are coming from place holder loading process then also load item filters.
                    if (fromPlaceHolder != null && fromPlaceHolder !== undefined
                           && fromPlaceHolder == true) {
                        FilterHelper.LoadItemFiltersByContext();
                    }

                    LookupHelper.LoadItemAttributesByContext(function () { //Search for data when we load itme attributes

                        //If we are loading place holder then we already have a season, startweek and end week in it.
                        if (fromPlaceHolder != null && fromPlaceHolder !== undefined
                            && fromPlaceHolder == true) {

                            if ($item.FlowDetail != null && $item.FlowDetail !== undefined) {

                                $scope.CurrentSeason = LookupHelper.GetSeasonIndexBySeasonName($item.FlowDetail.Season);

                                //$scope.SeasonIndex = seasonIndex;

                                $scope.OnSeasonChange(false);

                                if ($item.PlaceholderAssortmentAttrValuesDTO !== undefined && $item.PlaceholderAssortmentAttrValuesDTO !== null) {

                                    angular.forEach($scope.SeasonTime, function (time) {

                                        if (time.WeekCode == $item.PlaceholderAssortmentAttrValuesDTO.StartWeekNumDefault) {
                                            $scope.StartWeekObj = time;
                                            $scope.StartWeek = time.WeekCode;
                                            $scope.StartWeekNum = time.WeekNum;
                                        }
                                        else if (time.WeekCode == $item.PlaceholderAssortmentAttrValuesDTO.EndWeekNumDefault) {
                                            $scope.EndWeekObj = time;
                                            $scope.EndWeek = time.WeekCode;
                                            $scope.EndWeekNum = time.WeekNum;
                                        }
                                    });
                                }

                                PlaceHolderHelper.SetZones();

                                //$scope.EndWeek = $item.EndWeekNumDefault;

                                var season = $scope.SeasonMapping[$scope.SeasonIndex];

                                if (season !== undefined) {
                                    $rootScope.SetSeasonTime(season, season.SeasonTime, $scope.StartWeek, $scope.EndWeek);
                                }

                                //On Week Change already executing search method.
                                $scope.OnWeekChange(true);

                                //loaderService.HideLoader();
                            }
                        }
                        else {
                            //if ($scope.SeasonIndex < 0) {
                            //    $scope.SeasonIndex = 0;
                            $scope.OnSeasonChange(false);
                            //}

                            $scope.SearchHelper.Search();
                        }

                    });

                    $scope.SearchHelper.LoadSeasonProfiles();
                });
            });

            $scope.ShowDashBoardArea = true;
        };

        $scope.LoadDashBoardOnContextChanged = function (data) {
            $scope.SearchHelper.Business = { UnitCode: data.BizName };
            $scope.SearchHelper.Department = { DepartmentCode: data.Department };
            $scope.SearchHelper.Class = { ClassCode: data.Class };
            $scope.SearchHelper.SubClass = { SubclassCode: data.SubClass };
            $scope.SearchHelper.ItemAttributeValues = [];

            $scope.SeasonMapping = [];
            $scope.SeasonTime = [];
            $scope.CurrentSeason = null;
            $scope.StartWeek = "";
            $scope.StartWeekObj = {};
            $scope.EndWeek = "";
            $scope.EndWeekObj = {};
            $scope.EnableZones = false;
            $rootScope.Business = { UnitCode: data.BizName };
            $rootScope.Department = { DepartmentCode: data.Department };
            $rootScope.Class = { ClassCode: data.Class };
            $rootScope.SubClass = { SubclassCode: data.SubClass };

            $scope.SetContextView($scope.SearchHelper.Business.UnitCode);

            //Set context globally so that we can use it in other controllers.
            $rootScope.SetContext($scope.SearchHelper.Business,
                $scope.SearchHelper.Department,
                $scope.SearchHelper.Class, $scope.SearchHelper.SubClass);

            //reset store counts
            $scope.StoreCounts = 0;

            LookupHelper.LoadLocationAttributes();

            LookupHelper.LoadSeasonMapping()
                .then(function () {
                    LookupHelper.LoadZones(function () {

                        LookupHelper.LoadItemAttributesByContext(function () {

                            $scope.OnSeasonChange(false);

                            $scope.SearchHelper.Search();
                        });

                        $scope.SearchHelper.LoadSeasonProfiles();

                        FilterHelper.LoadItemFiltersByContext();
                    });
                });


            $scope.ShowDashBoardArea = true;
        };

        //Context values has been changes like bizname, department etc from
        //modal popup. this event has been broadcasted by header directive when we hit ok button onn popup.
        $scope.$on('context-updated-on-ok-button', function (event, data) {
            $scope.PlaceHolder = null;
            $rootScope.ClearSavedPlaceHolder();
            $rootScope.SavePlaceHolderButtonText = "Add";
            $scope.LoadDashBoardOnContextChanged(data);
            $scope.Thumbnail = "";
        });

        //var timer = null;
        //Will be fire whenever item attribute value has been changed.
        $scope.OnItemAttributeChange = function (textBox, event) {
            // if (textBox) {
            //clearTimeout(timer);
            //timer = setTimeout(function () {
            $scope.SearchHelper.Search();
            //}, 500);
            //  }
            // else { //if fire from dropdown
            //     $scope.SearchHelper.Search();
            // }
        };

        $scope.OnLocationFilterChange = function () {
            $scope.SearchHelper.Search();
        };

        $scope.SelectedSeason = {};

        $scope.OnSeasonChange = function (forceSearch) {
            if ($scope.SeasonMapping.length > 0) {

                var season = ($scope.CurrentSeason == null) ? $scope.SeasonMapping[0] : $scope.CurrentSeason;

                if ($scope.CurrentSeason == null)
                    $scope.CurrentSeason = season;

                $scope.SelectedSeason = season;
                $scope.SeasonTime = season.SeasonTime;
                $scope.StartWeek = $scope.SeasonTime[0];
                $scope.EndWeek = $scope.SeasonTime[1];

                $scope.StartWeekObj = $scope.SeasonTime[0];
                $scope.EndWeekObj = $scope.SeasonTime[1];

                $scope.StartWeekNum = $scope.StartWeekObj.WeekNum;
                $scope.EndWeekNum = $scope.EndWeekObj.WeekNum;

                if (forceSearch !== undefined && forceSearch == true)
                    $scope.SearchHelper.Search();
            }
        };

        $scope.OnZoneChange = function (zone) {
            zone.WeekNum = null;
            angular.forEach($scope.SeasonTime, function (item) {
                if (item.WeekCode == zone.SelectedWeekCode) {
                    zone.WeekNum = item.WeekNum;
                }
            });

            $scope.ZoneWatcher = !$scope.ZoneWatcher;
            $scope.SearchHelper.Search();
        };

        $scope.ShowLoader = function (show) {
            if (show) {
                loaderService.ShowLoader("Loading dashboard data...");
            }
            else {
                loaderService.HideLoader();
            }
        };

        $scope.OnWeekChange = function (openPlaceHolder) {

            $scope.StartWeek = $scope.StartWeekObj.WeekCode;
            $scope.EndWeek = $scope.EndWeekObj.WeekCode;

            $scope.safeApply(function () {
                $scope.StartWeekNum = $scope.StartWeekObj.WeekNum;
                $scope.EndWeekNum = $scope.EndWeekObj.WeekNum;
            });

            var timeError = angular.element(".error");
            timeError.html("");
            if ($scope.IsSelectedWeeksvalid()) {

                if (!$scope.EnableZones) {
                    angular.forEach($scope.Zones, function (zone) {
                        //if (zone.SelectedWeekCode === undefined) {
                        zone.SelectedWeekCode = $scope.StartWeekObj.WeekCode;
                        zone.WeekNum = $scope.StartWeekObj.WeekNum;
                        //}
                    });
                }

                $scope.SearchHelper.Search(openPlaceHolder);
            }
            else {

                timeError.append("End Week must be greater than or equal to Start Week.");
            }
        };

        $scope.IsSelectedWeeksvalid = function () {
            var startW = $scope.StartWeekNum;
            var endW = $scope.EndWeekNum;

            return parseInt(startW) !== 0 && parseInt(endW) !== 0 && (parseInt(startW) <= parseInt(endW) || parseInt($scope.StartWeekObj.Year) < parseInt($scope.EndWeekObj.Year));
        }

        $scope.OnZoneEnabled = function () {

            angular.forEach($scope.Zones, function (zone) {
                // if (!$scope.EnableZones) {
                zone.SelectedWeekCode = $scope.StartWeekObj.WeekCode;//$scope.StartWeek;
                zone.WeekNum = $scope.StartWeekObj.WeekNum;
                // }
                //else if (zone.SelectedWeekCode === undefined || zone.SelectedWeekCode == null) {
                // zone.SelectedWeekCode = $scope.StartWeek;
                // zone.WeekNum = $scope.StartWeekObj.WeekNum;
                //}
            });
            $scope.ZoneWatcher = !$scope.ZoneWatcher;
            $scope.SearchHelper.Search();
        };

        $scope.OnRefreshButton = function () {
            $scope.SearchHelper.Search(false, true);
        };

        $scope.safeApply = function (callback) {
            if (!$scope.$$phase) {
                $scope.$apply(callback);
            }
            else {
                callback();
            }
        };

        $scope.ClearPlaceHolder = function () {
            $scope.PlaceHolder = {};
            $scope.Thumbnail = "";
            $rootScope.CurrentPlaceHolder = null;
            //$rootScope.CurrentPlaceHolder.Name = null;
            $rootScope.SavePlaceHolderButtonText = "Add";
            $location.path("dashboard");
        };

        $scope.SearchHelper = {

            ContextId: 0,
            Business: {},
            Department: {},
            Class: {},
            SubClass: {},
            ItemAttributeValues: [],
            LocationAttributeValues: [],
            ZoneWeeks: [],
            NumberOfSizes: 0,
            PresMinQuantity: 0,
            TohDuration: 0,
            SelloffPerc: 0,
            StartWeek: "",
            EndWeek: "",

            Reset: function () {
                $scope.ClustorGraphData = [];
                $scope.VolumeGrade = {};
                $scope.SeasonProfiles = [];
                $scope.GroupedZones = [];
                $scope.StoreCountsBySegment = [];
                $scope.StartWeek = 0;
                $scope.EndWeek = 0;
                $scope.EcomGraphLoaded = false;
            },

            IsValid: function () {
                $scope.SearchHelper.StartWeek = $scope.StartWeek;
                $scope.SearchHelper.EndWeek = $scope.EndWeek;
                //if ($scope.SearchHelper.ItemAttributeValues.length < 6)
                //    return false;

                return $scope.SearchHelper.NumberOfSizes != 0 && $scope.SearchHelper.PresMinQuantity != 0 && $scope.SearchHelper.TohDuration != 0;
                /*$scope.SearchHelper.SelloffPerc != 0 && $scope.SearchHelper.StartWeek && $scope.SearchHelper.StartWeek != "" &&
                $scope.SearchHelper.EndWeek && $scope.SearchHelper.EndWeek != "";*/
            },

            SetItemAttributeValuesForSearch: function () {
                $scope.SearchHelper.ItemAttributeValues = [];
                $scope.TotalItemAttributeValues = [];
                $scope.SearchHelper.NumberOfSizes = 0;
                $scope.SearchHelper.PresMinQuantity = 0;
                $scope.SearchHelper.TohDuration = 0;
                $scope.SearchHelper.SelloffPerc = 0;

                angular.forEach($scope.ItemAttributes, function (item, index) {

                    $scope.TotalItemAttributeValues.push(item.SelectedVal);

                    if (item.SelectedVal && item.SelectedVal != "") {

                        //Normal attrib
                        if (index < 6) {
                            $scope.SearchHelper.ItemAttributeValues.push(item.SelectedVal);
                        }
                        else if (index == 6) {
                            $scope.SearchHelper.NumberOfSizes = item.SelectedVal;
                        }
                        else if (index == 7) {
                            $scope.SearchHelper.PresMinQuantity = item.SelectedVal;
                        }
                        else if (index == 8) {
                            $scope.SearchHelper.TohDuration = item.SelectedVal;
                        }
                        else if (index === 9) {
                            $scope.SearchHelper.SelloffPerc = (parseInt(item.SelectedVal) / 100);
                        }
                    }
                });
            },

            SetLocationAttributeValuesForSearch: function () {
                $scope.SearchHelper.LocationAttributeValues = [];
                angular.forEach($scope.LocationAttributes, function (item) {
                    if (item.Checked) {
                        $scope.SearchHelper.LocationAttributeValues.push(item);
                    }
                });
            },

            SetZoneWeeksValuesForSearch: function () {
                $scope.SearchHelper.ZoneWeeks = [];
                angular.forEach($scope.Zones, function (item) {
                    if (!$scope.EnableZones) {
                        item.SelectedWeekCode = $scope.StartWeekObj.WeekCode;
                    }
                    if (item.SelectedWeekCode !== undefined && item.SelectedWeekCode !== 'NA')
                        $scope.SearchHelper.ZoneWeeks.push({ ZoneName: item.Name, WeekNum: item.SelectedWeekCode/*not using now*/ });
                });
            },



            LoadSeasonProfiles: function () {

                this.SetZoneWeeksValuesForSearch();

                $scope.SeasonProfileGraphWatcher = false;

                appService.getSeasonProfiles({
                    Business: $scope.SearchHelper.Business,
                    Department: $scope.SearchHelper.Department,
                    Class: $scope.SearchHelper.Class,
                    SubClass: $scope.SearchHelper.SubClass,
                    ZoneWeeks: $scope.SearchHelper.ZoneWeeks,
                    StartWeek: $scope.StartWeek,
                    EndWeek: $scope.EndWeek
                })
                .then(function (response) {

                    //Season profile start
                    $scope.SeasonProfiles = response.SeasonProfiles;
                    $scope.GroupedZones = response.GroupedZoneNames;
                    //Season profile end
                    //$scope.ZoneWatcher = !$scope.ZoneWatcher;

                    $scope.SeasonProfileGraphWatcher = true;
                    $scope.ZoneWatcher = !$scope.ZoneWatcher;
                });

            },



            Search: function (openPlaceHolder, manualRefresh) {

                if (manualRefresh === undefined) {
                    if ($scope.AutoRefresh === false) {
                        return;
                    }
                }
                $timeout(function () {
                    $scope.SearchHelper.SetItemAttributeValuesForSearch();
                    $scope.SearchHelper.SetLocationAttributeValuesForSearch();
                    $scope.SearchHelper.SetZoneWeeksValuesForSearch();

                    if (!$scope.SearchHelper.IsValid())
                        return;

                    $scope.ShowLoader(true);

                    $scope.ClustorGraphLoaded = false;
                    $scope.EcomGraphLoaded = false;

                    $scope.ClustorGraphData = [];
                    $scope.PercLikelihoods = [];
                    $scope.Ecom.PercLikelihoods = [];

                    appService.getDashboardData({
                        Business: $scope.SearchHelper.Business,
                        Department: $scope.SearchHelper.Department,
                        Class: $scope.SearchHelper.Class,
                        SubClass: $scope.SearchHelper.SubClass,
                        ItemAttributeValues: $scope.SearchHelper.ItemAttributeValues,
                        ContextId: $scope.SearchHelper.ContextId,
                        ZoneWeeks: $scope.SearchHelper.ZoneWeeks,
                        LocationAttributeValues: $scope.SearchHelper.LocationAttributeValues,
                        StartWeek: $scope.StartWeekObj.WeekCode,
                        EndWeek: $scope.EndWeekObj.WeekCode,
                        NumberOfSizes: $scope.SearchHelper.NumberOfSizes,
                        PresMinQuantity: $scope.SearchHelper.PresMinQuantity,
                        TohDuration: $scope.SearchHelper.TohDuration,
                        SelloffPerc: $scope.SearchHelper.SelloffPerc,

                        //PlaceholderId: $rootScope.CurrentPlaceHolder.Id
                        PlaceholderId: ($rootScope.CurrentPlaceHolder != null && $rootScope.CurrentPlaceHolder !== undefined) ? $rootScope.CurrentPlaceHolder.Id : 0

                    })
                        .then(function (response) {

                            $scope.ShowLoader(false);
                            $scope.Ecom.PercLikelihoods = [];
                            $scope.Ecom.AvgPerceLikelyHood = 0;
                            $scope.EcomGraphLoaded = false;


                            $scope.DashboardData = {
                                BandMultiplier: response.BandMultiplier,
                                ProjRegSt: response.ProjRegSt + '%',
                                RecBuy: response.RecBuy,
                                ROS: response.ROS,
                                StoreCount: response.StoreCount,
                                WOF: response.WOF,
                                BandName: response.BandName,
                                BandColor: response.BandColor,
                                StoreCountsBySegments: response.StoreCountsBySegments,
                                GrandTotalHigh: response.GrandTotalHigh,
                                GrandTotalLow: response.GrandTotalLow,
                                Confidence: response.Confidence,
                                SubClassROS: response.SubClassROS,
                                ClusterROS: response.ClusterROS,
                                ActualRatio: response.ActualRatio,
                                HROS: response.HROS,
                                Info: response.Info,
                                BrandingRecCount: response.BrandingRecCount,
                                BandRelStdErr: response.BandRelStdErr,
                                Duration: response.Duration,
                                ProtTgtInv: response.ProtTgtInv,

                                ProjRegStSaved: response.ProjRegStSaved + '%',
                                RecBuySaved: response.RecBuySaved,
                                BandMultiplierSaved: response.BandMultiplierSaved,
                                BandNameSaved: response.BandNameSaved,
                                ROSSaved: response.ROSSaved,
                                StoreCountSaved: response.StoreCountSaved,
                                ConfidenceSaved: response.ConfidenceSaved,
                                WOFSaved: response.WOFSaved,
                                ProtTgtInvSaved: response.ProtTgtInvSaved
                            };

                            $scope.Ecom.SubClassROS = response.SubClassROS;
                            $scope.Ecom.ClusterROS = response.ClusterROS;

                            if ($scope.DashboardData.WOF > 0) {
                                $scope.TargetWeeksLength = $scope.DashboardData.WOF;
                            }

                            //In app.js we are conserving dashboard result because we need to use
                            //these results to while saving placeholder in place holder controller.
                            $rootScope.SetDashBoardSearchResults(
                                {
                                    DashBoardInfo: $scope.DashboardData,
                                    Attributes: $scope.TotalItemAttributeValues,
                                    StartWeek: $scope.StartWeekObj.WeekCode,//$scope.SearchHelper.StartWeek,
                                    EndWeek: $scope.EndWeekObj.WeekCode,
                                    SeasonTime: $scope.SeasonTime,
                                    Season: $scope.SelectedSeason,
                                    LocationAttributes: $scope.SearchHelper.LocationAttributeValues,
                                    Zones: $scope.Zones,
                                    EnableZones: $scope.EnableZones,
                                    StartWeekObj: $scope.StartWeekObj,
                                    EndWeekObj: $scope.EndWeekObj
                                });

                            //volume grade start
                            $scope.VolumeGrade.GradeCounts = response.GradeCounts;
                            $scope.VolumeGrade.Info = response.Info;

                            //volume grade end

                            //Clustor chart start
                            angular.forEach(response.JoinData, function (item) {
                                $scope.ClustorGraphData.push({
                                    value: item.ClusterROS,
                                    BrandName: item.ClusterName,
                                    ROS: Math.round((item.ClusterROS * 100)) / 100,
                                    Sales: Math.round((item.NormLikelihood * 100)) / 100,
                                    PercLikelihood: Math.round((item.PercLikelihood * 100) * 100) / 100,
                                    CircleHeight: 2
                                });

                                //To calculate perclikiehood for ECOM.                                
                                $scope.Ecom.PercLikelihoods.push(Math.round((item.PercLikelihood * 100) * 100) / 100);
                            });

                            //Ecom calculation starts
                            if ($scope.Ecom.PercLikelihoods.length > 0) {
                                var totalPercLikelyHood = 0;
                                angular.forEach($scope.Ecom.PercLikelihoods, function (item) {
                                    totalPercLikelyHood += item;
                                });
                                $scope.Ecom.AvgPerceLikelyHood = totalPercLikelyHood / $scope.Ecom.PercLikelihoods.length;

                            }
                            //Ecom calculation end
                            $scope.EcomGraphLoaded = true;
                            $scope.ClustorGraphLoaded = true;

                            //if (openPlaceHolder !== undefined && openPlaceHolder == true) {
                            //    //Open place holder popup
                            //    $scope.PlaceHolderModel($scope.PlaceHolder);
                            //}

                        }, function (error) {
                            $scope.ClustorGraphLoaded = false;
                            $scope.EcomGraphLoaded = false;
                            $scope.ClustorGraphLoaded = true;
                            $scope.EcomGraphLoaded = true;
                            $scope.ShowLoader(false);
                        });
                }, 2000);
            }
        };

        LookupHelper = {

            GetSeasonIndexBySeasonName: function (placeholderSeason) {
                var season;
                if ($scope.SeasonMapping.length > 0) {
                    for (var index = 0; index <= $scope.SeasonMapping.length - 1; index++) {
                        var item = $scope.SeasonMapping[index];
                        if (item.Season == placeholderSeason) {
                            season = item;
                            break;
                        }
                    }
                }
                return season;
            },

            LoadLocationAttributes: function (callBack) {
                var bizCode = $scope.SearchHelper.Business.UnitCode;
                var depCode = $scope.SearchHelper.Department.DepartmentCode;
                var clsCode = $scope.SearchHelper.Class.ClassCode;
                var subclsCode = $scope.SearchHelper.SubClass.SubclassCode;

                $scope.SelectedLocations = [];
                angular.forEach($scope.LocationAttributes, function (item) {
                    if (item.Checked) {
                        $scope.SelectedLocations.push(item);
                    }
                });

                loaderService.ShowLoaderOnBlock($("#location-container"));
                lookupService.getLocationFilters(bizCode, depCode, clsCode, subclsCode)
                .then(function (results) {
                    $scope.LocationAttributes = [];
                    if (results.length > 0) {

                        angular.forEach(results, function (item, index) {
                            item.Checked = true;
                            $scope.LocationAttributes.push(item);
                            $scope.LocationAttributesIds.push(item.Name);
                        });
                    }
                    if ($scope.SelectedLocations.length > 0) {
                        angular.forEach($scope.LocationAttributes, function (item, index) {
                            for (var index = 0; index <= $scope.SelectedLocations.length - 1; index++) {
                                var location = $scope.SelectedLocations[index];
                                if (location.Name == item.Name) {
                                    item.Checked = location.Checked;
                                    break;
                                }
                            }
                        });
                    }

                    if (callBack !== undefined)
                        callBack();

                    loaderService.HideLoader($("#location-container"));
                });
            },

            LoadZones: function (callback) {

                var bizCode = $scope.SearchHelper.Business.UnitCode;
                var depCode = $scope.SearchHelper.Department.DepartmentCode;
                var clsCode = $scope.SearchHelper.Class.ClassCode;
                var subclsCode = $scope.SearchHelper.SubClass.SubclassCode;

                lookupService.getZones(bizCode, depCode, clsCode, subclsCode)
                    .then(function (results) {

                        $scope.WeekMappings = results.WeekMappings;

                        if (results.Zones.length > 0) {

                            $scope.Zones = [];

                            angular.forEach(results.Zones, function (item, index) {
                                item.SelectedWeekCode = 'NA';
                                $scope.Zones.push(item);
                            });
                        }

                        if (callback != null && callback !== undefined) {
                            callback();
                        }
                    });
            },

            LoadSeasonMapping: function () {

                var defer = $q.defer();

                var bizCode = $scope.SearchHelper.Business.UnitCode;
                var depCode = $scope.SearchHelper.Department.DepartmentCode;
                var clsCode = $scope.SearchHelper.Class.ClassCode;
                var subclsCode = $scope.SearchHelper.SubClass.SubclassCode;
                loaderService.ShowLoaderOnBlock($("#season-mapping-container"));
                lookupService.getSeasonMapping(bizCode, depCode, clsCode, subclsCode)
                    .then(function (results) {

                        if (results.length > 0) {
                            $scope.SeasonMapping = [];
                            $scope.SeasonMapping = results;
                        }

                        defer.resolve($scope.SeasonMapping);
                        loaderService.HideLoader($("#season-mapping-container"));
                    }, function () {
                        defer.resolve({});
                    });

                return defer.promise;
            },

            ConserveExistingNonFilterableAttributes: function () {
                $scope.ExistingItemAttribute = [];
                angular.forEach($scope.ItemAttributes, function (item) {
                    if (item.Filterable == false) {
                        $scope.ExistingItemAttribute.push({ Name: item.Name, SelectedVal: item.SelectedVal });
                    }
                });
            },

            LoadItemAttributesByContext: function (callBack) {

                var bizCode = $scope.SearchHelper.Business.UnitCode;
                var depCode = $scope.SearchHelper.Department.DepartmentCode;
                var clsCode = $scope.SearchHelper.Class.ClassCode;
                var subclsCode = $scope.SearchHelper.SubClass.SubclassCode;

                var placeholderId = 0;
                if ($scope.PlaceholderId !== undefined && $scope.PlaceholderId !== "")
                    placeholderId = $scope.PlaceholderId;


                loaderService.ShowLoaderOnBlock($("#item-attribute-container"));
                lookupService.getItemAttributesByContext(bizCode, depCode, clsCode, subclsCode, placeholderId)
                    .then(function (results) {

                        LookupHelper.ConserveExistingNonFilterableAttributes();

                        $scope.ItemAttributes = [];

                        angular.forEach(results, function (item, index) {

                            if (item.SelectedVal === "" || item.SelectedVal === undefined || item.SelectedVal == null)
                                item.SelectedVal = item.DefaultValue;

                            $scope.ItemAttributes.push(item);
                        });

                        if ($scope.ExistingItemAttribute.length <= 0) {
                            LookupHelper.ConserveExistingNonFilterableAttributes();
                        }

                        var isLoadingPlacholder = ($scope.PlaceHolder != null);

                        LookupHelper.SetAttributesValues($scope.AttributesValues, isLoadingPlacholder);

                        if (callBack !== undefined && callBack !== null) {
                            callBack();
                        }
                        loaderService.HideLoader($("#item-attribute-container"));
                    });
            },


            SetAttributesValues: function (attrbuteValues, isPlaceHolder) {

                if ($scope.ItemAttributes.length <= 0) {
                    return;
                }
                angular.forEach($scope.ItemAttributes, function (item, index) {

                    if (!item.Filterable) {

                        angular.forEach($scope.ExistingItemAttribute, function (Existingitem) {
                            if (item.Name == Existingitem.Name) {
                                item.SelectedVal = Existingitem.SelectedVal;

                                if (item.SelectedVal == null || item.SelectedVal === undefined || item.SelectedVal == '') {
                                    item.SelectedVal = $scope.AttributesValues[index];

                                    if (item.SelectedVal == null || item.SelectedVal === undefined || item.SelectedVal == '') {
                                        item.SelectedVal = item.ValidAttributesValues[0];
                                    }
                                }
                            }
                        });

                    }
                    else {
                        if (!isPlaceHolder) {
                            if ($scope.AttributesValues.length >= index && index < 6) {
                                item.SelectedVal = $scope.AttributesValues[index];

                                if (item.SelectedVal == undefined || item.SelectedVal == '') {
                                    if (item.ValidAttributesValues != null && item.ValidAttributesValues.length >= 1) {
                                        item.SelectedVal = item.ValidAttributesValues[0];
                                    }
                                }
                            }
                            else if (item.ValidAttributesValues != null && item.ValidAttributesValues.length >= 1) {
                                if (item.SelectedVal == undefined || item.SelectedVal == '') {
                                    item.SelectedVal = item.ValidAttributesValues[0];
                                }
                            }
                            else if (index == 9) {
                                if (item.SelectedVal == undefined || item.SelectedVal == '') {
                                    item.SelectedVal = $scope.AttributesValues[index];
                                }
                            }
                        }
                        else {
                            if ($scope.AttributesValues.length >= index) {
                                item.SelectedVal = $scope.AttributesValues[index];

                                if (item.SelectedVal == undefined || item.SelectedVal == '') {
                                    if (item.ValidAttributesValues != null && item.ValidAttributesValues.length >= 1) {
                                        item.SelectedVal = item.ValidAttributesValues[0];
                                    }
                                }
                            }
                        }
                    }

                });

            },

            BuildStoreCounts: function () {
                if ($scope.StoreCountsBySegment === undefined && $scope.StoreCountsBySegment.length <= 0) {
                    $scope.StoreCounts = 0;
                    return;
                }
                $scope.StoreCounts = 0;
                angular.forEach($scope.StoreCountsBySegment, function (item) {
                    $scope.StoreCounts += item.Total;
                });
            }
        };

        FilterHelper = {
            LoadItemFiltersByContext: function () {
                var bizCode = $scope.SearchHelper.Business.UnitCode;
                var depCode = $scope.SearchHelper.Department.DepartmentCode;
                var clsCode = $scope.SearchHelper.Class.ClassCode;
                var subclsCode = $scope.SearchHelper.SubClass.SubclassCode;
                $scope.ItemFilters = [];
                filterService.getFilters(bizCode, depCode, clsCode, subclsCode)
                  .then(function (results) {
                      $scope.ItemFilters = results;
                  });
            }
        };

        //modal popup. this event has been broadcasted by header directive when we hit saveplaceholder button.
        $scope.PlaceHolderModel = function (placeholder) {

            //In app.js this method was getting biz code from cookie which we set in header directive
            //while selecting BIZ.
            var bizCode = $rootScope.GetBusiness().UnitCode;

            //We now have filters which don't actually filtering results so 
            //so there may be case user will enter text in those after search so re-adding
            //here just to cover that case.
            $scope.SearchHelper.SetItemAttributeValuesForSearch();

            //See in  app.js
            $rootScope.SetItemAttributesForPlaceholder($scope.TotalItemAttributeValues);

            if ($rootScope.CurrentPlaceHolder != null) {

                placeHolderService.getPlaceHolder($rootScope.CurrentPlaceHolder.Id, bizCode)
                 .then(function (response) {
                     $scope.PlaceHolder = response;

                     var modalInstance = $modal.open({
                         templateUrl: 'modules/dashboard/views/placeholder.html',
                         controller: 'place-holder-popup-controller',
                         size: 'lg',
                         resolve: {
                             Context: function () {
                                 return {
                                     Placeholder: $scope.PlaceHolder,
                                     Thumbnail: $scope.Thumbnail,
                                     fromDashBoard: true
                                 };
                             }
                         }
                     });

                     modalInstance.result.then();

                 });
            }
            else {

                var modalInstance = $modal.open({
                    templateUrl: 'modules/dashboard/views/placeholder.html',
                    controller: 'place-holder-popup-controller',
                    size: 'lg',
                    resolve: {
                        Context: function () {
                            return {
                                Placeholder: placeholder,
                                fromDashBoard: true, Thumbnail: $scope.Thumbnail
                            };
                        }
                    }
                });

                modalInstance.result.then();
            }

        };

        PlaceHolderHelper = {

            SetZones: function () {

                $scope.EnableZones = false;

                if ($scope.PlaceHolder.PlaceholderAssortmentAttrValuesDTO !== undefined)
                    $scope.EnableZones = $scope.PlaceHolder.PlaceholderAssortmentAttrValuesDTO.EnabelZones;

                if ($scope.EnableZones) {
                    angular.forEach($scope.Zones, function (item) {
                        angular.forEach($scope.PlaceHolder.Zones, function (zone) {
                            if (item.Name == zone.Name) {
                                item.SelectedWeekCode = zone.StartWeek;

                                angular.forEach($scope.SeasonTime, function (season) {
                                    if (season.WeekCode == item.SelectedWeekCode) {
                                        item.WeekNum = season.WeekNum;
                                    }
                                });
                            }
                        });
                    });

                }
            },

            LoadPlaceHolder: function (placeholderId) {

                // loaderService.ShowLoader("Loading Placeholder...")

                //In app.js this method was getting biz code from cookie which we set in header directive
                //while selecting BIZ.
                var bizCode = $rootScope.GetBusiness().UnitCode;

                placeHolderService.getPlaceHolder(placeholderId, bizCode)
                    .then(function (placeholder) {

                        $scope.PlaceHolder = placeholder;

                        $rootScope.ConserveSavedPlaceHolder($scope.PlaceHolder);

                        $scope.Thumbnail = "data:image/jpeg;base64," + $scope.PlaceHolder.Thumbnail;

                        if ($scope.PlaceHolder.PlaceholderAssortmentAttrValuesDTO != null
                            && $scope.PlaceHolder.PlaceholderAssortmentAttrValuesDTO !== undefined) {
                            if ($scope.PlaceHolder.PlaceholderAssortmentAttrValuesDTO.Status !== 'NEW') {
                                $scope.showsavedValues = true;
                            }
                        }

                        $scope.FilterSelected($scope.PlaceHolder, {}, {}, true);

                        if ($scope.PlaceHolder != null && $scope.PlaceHolder.Id > 0) {
                            if (!$scope.$$phase) {
                                $scope.$apply($rootScope.SavePlaceHolderButtonText = "Edit");
                            }
                            else {
                                $rootScope.SavePlaceHolderButtonText = "Edit";
                            }
                        }

                    });
            }
        };
        $scope.TakeImage = function () {

            var isMobile = {
                Android: function () {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function () {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function () {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function () {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function () {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };
            if (isMobile.any()) {

                var input = document.getElementById('cameraInput');
                if (isMobile.iOS()) {
                    input.click();
                    input.addEventListener('change', function () {
                        var file = input.files[0];
                        if (file) {
                            drawOnCanvas(file);
                        }
                    });
                }
                function drawOnCanvas(file) {
                    // We zse the File APi to read the content of the input file element     
                    var reader = new FileReader();
                    // On reader load with parse the content and draw it on Canvas   
                    reader.onload = function (e) {
                        var dataURL = e.target.result,
                          c = document.getElementById('canvas'),//('canvasIphone'),
                            ctx = c.getContext('2d'),
                            img = new Image();
                        img.onload = function () {
                            c.width = img.width;
                            c.height = img.height;
                            ctx.drawImage(img, 0, 0);
                        };
                        img.src = dataURL;
                        $scope.Thumbnail = "";
                        $scope.Thumbnail = dataURL;
                    };
                    // Load the file in reader ...
                    reader.readAsDataURL(file);
                }



            }
            else {
                var modalInstance = $modal.open({
                    templateUrl: 'modules/dashboard/views/camera-popup.html',
                    controller: 'camera-controller',
                    size: 'lg',
                    resolve: {
                        Context: function () {
                            return {}
                        }
                    }

                });

                modalInstance.result.then(function (response) {
                    if (response !== undefined && response !== null) {
                        $scope.Thumbnail = "";
                        $scope.Thumbnail = response.PictureSrc;
                    }
                });
            }
        }
        $scope.SavePlaceHolder = function () {
            $rootScope.$broadcast('onSavePlaceHolder', {});
        };
        //We will issue a place holder request or a context
        //popup request if we recieved season mapping.
        // LookupHelper.LoadSeasonMapping();

        $scope.PlaceholderId = $routeParams.placeholder;

        //Check if we are not loading place holder .
        if ($scope.PlaceholderId === undefined ||
            $scope.PlaceholderId == null || $scope.PlaceholderId == "") {

            $rootScope.$broadcast('on-load-busineses', {});

            if ($rootScope.Business.UnitCode !== undefined && $rootScope.Business.UnitCode != null
                && $rootScope.Business.UnitCode !== "") {
                $scope.LoadDashBoardOnContextChanged({
                    BizName: $rootScope.Business.UnitCode,
                    Department: $rootScope.Department.DepartmentCode,
                    Class: $rootScope.Class.ClassCode,
                    SubClass: $rootScope.SubClass.SubclassCode
                });
            }
        }
        else {
            $rootScope.$broadcast('on-load-busineses', {});
            PlaceHolderHelper.LoadPlaceHolder($scope.PlaceholderId);
        }

        $rootScope.$broadcast('invoke-info-popup', {});

    }]);

app.controller('camera-controller', ['$scope', '$rootScope', '$modalInstance', 'Context',
    function ($scope, $rootScope, $modalInstance, Context) {

        $scope.Error = "";
        $scope.Message = "";
        $scope.picture = "";
        $rootScope.$on('onSnapShotCreated', function (e, data) {
            $modalInstance.close({ PictureSrc: data });
        });

        $scope.Cancel = function () {
            $modalInstance.close();
        };
    }]);