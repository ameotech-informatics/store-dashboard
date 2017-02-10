angular.module('mgApp')

.controller('link-placeholder-controller', ['$scope', '$rootScope', 'placeHolderService', 'lookupService', 'loaderService', '$modalInstance',
    function ($scope, $rootScope, placeHolderService, lookupService, loaderService, $modalInstance) {

        $scope.PlaceHolderStatusList = ['NEW', 'ACTIVE', 'PUBLISHED', 'OBSOLETE'];
        // $scope.PlaceHolderStatusList = ['NEW', 'ACTIVE', 'PUBLISHED'];
        $scope.StyleNameList = [];
        $scope.Error = "";
        $scope.Message = "";
        $scope.MerchVendorNameList = [];
        $scope.PlaceHoderItemAttributes = [];
        $scope.CurrentPage = 1;
        $scope.CurrentPageSize = 10;
        $scope.AllSeasons = [];
        $scope.LinkPlaceholderExecuted = false;
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
            LastUpdateDate: "",
            IsLinkSearch: false
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
            var prevweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() +1);
            return prevweek;
        };

        function GetStartDate() {
            var today = new Date();
            var prevweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            return prevweek;
        };

        $scope.BusinessInfo = {
            SelectedBusinessUnit: "",
            BusinessUnits: [],
            Placeholders: [],
            ShowPlaceholderArea: false,
            FilterPlaceholders: []
        };

        $scope.CloseLinkPopup = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.CloseLinkPopupFromButton = function () {
            $modalInstance.close({ Refresh: $scope.LinkPlaceholderExecuted })
        };

        $scope.OnSelectBusinessUnit = function () {
            $scope.BusinessInfo.ShowPlaceholderArea = true;
            $scope.SearchInputs.IsLinkSearch = true;
            LinkPlaceHolderHelper.Search();
        };

        $scope.SearchPlaceholdersByBusinessCode = function () {
            LinkPlaceHolderHelper.Search();
        };

        $scope.OnPlaceholderLinkClicked = function (placeholderId) {
            var bizCode = $scope.BusinessInfo.SelectedBusinessUnit.BusinessUnitCode;
            var bizCodeFromContext = $rootScope.Business.UnitCode;
            LinkPlaceHolderHelper.LinkPlaceholder(placeholderId, bizCodeFromContext, bizCode);
        },

        LinkPlaceHolderHelper = {

            GetStyleMerchNameList: function () {
                placeHolderService.loadStyleMerchNameList()
                .then(function (response) {
                    $scope.StyleNameList = response.StyleNameList;

                    $scope.MerchVendorNameList = response.MerchVendorNameList;
                });
            },

            LoadSeasons: function () {
                lookupService.getSeasonMapping($rootScope.Business.UnitCode,
                       $rootScope.Department.DepartmentCode, $rootScope.Class.ClassCode, $rootScope.SubClass.SubclassCode)
                   .then(function (response) {
                       $scope.AllSeasons = response;
                   });
            },

            LoadBusiness: function () {
                $scope.BusinessInfo.BusinessUnits = [];
                lookupService.getBusinesses().then(function (results) {

                    angular.forEach(results, function (item) {
                        if (item.BusinessUnitCode != $rootScope.Business.UnitCode) {
                            $scope.BusinessInfo.BusinessUnits.push(item);
                        }
                    });
                });
            },

            LoadPlaceHolders: function (businessUnitCode) {
                $scope.BusinessInfo.Placeholders = [];
                LinkPlaceHolderHelper.Search();
                //placeHolderService.loadPlaceholders(businessUnitCode)
                //    .then(function (response) {
                //        $scope.BusinessInfo.Placeholders = response;

                //        $scope.PageChanged();

                //        if ($scope.BusinessInfo.Placeholders.length > 0) {
                //            $scope.PlaceHoderItemAttributes = $scope.BusinessInfo.Placeholders[0].ItemAttributes;
                //        }
                //    });
            },

            ReadWeekCode: function (index) {
                if (index > 0)
                    index = index - 1;

                if ($scope.Weeks[index] !== undefined)
                    return $scope.Weeks[index].WeekCode;

                return "";
            },

            LinkPlaceholder: function (placeholderId, selectedContextBusinessUnitCode, businessUnitCode) {
                $scope.Error = "";
                $scope.Message = "";
                loaderService.ShowLoaderOnElement("#linkplarea", "Copying placeholder...");
                placeHolderService.linkPlaceholderToBusinessUnitCode(placeholderId, selectedContextBusinessUnitCode, businessUnitCode)
                    .then(function (response) {
                        if (response.Success) {
                            $scope.Message = "Your changes has been saved.";
                            loaderService.HideLoader("#linkplarea");
                            $scope.LinkPlaceholderExecuted = true;
                        }
                        else {
                            loaderService.HideLoader("#linkplarea");
                            $scope.Error = response.Message;
                        }
                    }, function () {
                        loaderService.HideLoader("#linkplarea");
                        $scope.Error = "We are unable to save your changes at this time, please try again later.";
                    })
            },

            Search: function () {
                $scope.SearchInputs.StartWeek = "";
                $scope.SearchInputs.EndWeek = "";

                loaderService.ShowLoaderOnElement("#placeHolderAreaLinked", "Loading Placeholders...");

                $scope.SearchInputs.Business = $scope.BusinessInfo.SelectedBusinessUnit.BusinessUnitCode;
                $scope.SearchInputs.Department = $rootScope.Department.DepartmentCode;
                $scope.SearchInputs.Class = $rootScope.Class.ClassCode;
                $scope.SearchInputs.SubClass = $rootScope.SubClass.SubclassCode;

                $scope.SearchInputs.StartDate = new Date($scope.DateHelper.SelectedDate.startDate.toString()).toDateString();
                $scope.SearchInputs.EndDate = new Date($scope.DateHelper.SelectedDate.endDate.toString()).toDateString();

                if (!$scope.WeekRange.Disabled) {
                    $scope.SearchInputs.StartWeek = LinkPlaceHolderHelper.ReadWeekCode($scope.WeekRange.MinStart);
                    $scope.SearchInputs.EndWeek = LinkPlaceHolderHelper.ReadWeekCode($scope.WeekRange.MinEnd);
                }

                placeHolderService.Search($scope.SearchInputs)
                    .then(function (response) {
                        $scope.BusinessInfo.Placeholders = response;


                        if ($scope.BusinessInfo.Placeholders.length > 0) {
                            $scope.PlaceHoderItemAttributes = $scope.BusinessInfo.Placeholders[0].ItemAttributes;
                        }

                        loaderService.HideLoader("#placeHolderAreaLinked");
                    }, function (error) {
                        loaderService.HideLoader("#placeHolderAreaLinked");
                    });
            }

        };

        LinkPlaceHolderHelper.LoadBusiness();
        LinkPlaceHolderHelper.LoadSeasons();
        //LinkPlaceHolderHelper.LoadPlaceHolders($rootScope.Business.UnitCode);
        LinkPlaceHolderHelper.GetStyleMerchNameList();

    }]);