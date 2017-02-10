


var app = angular.module('mgApp', ['ngRoute', /*'mg-Controllers'*/, 'mg-Services',
    'ui.bootstrap', 'mg-Directives', 'ngCookies', 'ui.utils', 'datatables',
    'ui.select', 'daterangepicker', 'ui-rangeSlider', 'toggle-switch'])

 .service('apiconfig', ['apiconfigbase', function (apiconfigbase) {
     this.api = {

         loadItemAttributes: apiconfigbase.baseLookupApi + '/GetItemAttributes',
         loadItemAttributesByContext: apiconfigbase.baseLookupApi + '/GetItemAttributesByContext',
         loadLocationAttributes: apiconfigbase.baseLookupApi + '/GetLocations',
         loadZones: apiconfigbase.baseLookupApi + '/GetZones',
         loadWeeks: apiconfigbase.baseLookupApi + '/GetWeeks',
         loadBusinesesUrl: apiconfigbase.baseLookupApi + '/GetContexts',
         calculateGraphUrl: apiconfigbase.baseApplicationApi + '/CalculateGraphs',
         loadFiltersUrl: apiconfigbase.baseFilterApi + '/GetItemFilters',
         storeCountSegmentUrl: apiconfigbase.baseApplicationApi + '/CalculateStorCountSegments',
         seasonMappingUrl: apiconfigbase.baseLookupApi + '/GetSeasonMapping',
         seasonProfileUrl: apiconfigbase.baseApplicationApi + '/GetSeasonProfile',
         rosUrl: apiconfigbase.baseApplicationApi + '/CalculateROS',
         dashboardDataUrl: apiconfigbase.baseApplicationApi + '/DashboardData',
         placeHolderVendorAttributesUrl: apiconfigbase.basePlaceHolderApi + '/GetVendorAttributes',
         placeHolderProductAttributesUrl: apiconfigbase.basePlaceHolderApi + '/GetProductAttributes',
         saveplaceHolderUrl: apiconfigbase.basePlaceHolderApi + '/SavePlaceHolder',
         loginUserUrl: apiconfigbase.baseUserApi + '/Login',
         createUserUrl: apiconfigbase.baseUserApi + '/Create',
         deleteUserUrl: apiconfigbase.baseUserApi + '/Delete',
         logoutUserUrl: apiconfigbase.baseUserApi + '/Logout',
         getAllUserUrl: apiconfigbase.baseUserApi + '/GetAll',
         getPlaceholdersUrl: apiconfigbase.basePlaceHolderApi + '/GetPlaceHolders',
         DeletePlaceHolderUrl: apiconfigbase.basePlaceHolderApi + '/DeletePlaceHolder',
         searchPlaceHolderUrl: apiconfigbase.basePlaceHolderApi + '/SearchPlaceHolders',
         getPlaceholderUrl: apiconfigbase.basePlaceHolderApi + '/GetPlaceHolder',
         copyplaceHolderUrl: apiconfigbase.basePlaceHolderApi + '/CopyPlaceHolder',
         changeAttirbutesUrl: apiconfigbase.basePlaceHolderApi + '/ChangeAttributes',
         getUsersUrl: apiconfigbase.baseUserAccountApi + '/GetUsers',
         updateUserUrl: apiconfigbase.baseUserAccountApi + '/UpdateUser',
         getUserApi: apiconfigbase.baseUserAccountApi + '/GetUser',
         deleteUserUrl: apiconfigbase.baseUserAccountApi + '/DeleteUser',
         searchUserUrl: apiconfigbase.baseUserAccountApi + '/SearchUsers',
         getRolesUrl: apiconfigbase.baseUserAccountApi + '/GetAllRoles',
         createUserUrl: apiconfigbase.baseUserAccountApi + '/CreateUser',
         sendpasswordrUrl: apiconfigbase.baseUserApi + '/SendPassword',
         getallgroupsUrl: apiconfigbase.baseGroupApi + '/GetAllGroups',
         searchgroupUrl: apiconfigbase.baseGroupApi + '/SearchGroups',
         getGroupUrl: apiconfigbase.baseGroupApi + '/GetGroup',
         updateGroupUrl: apiconfigbase.baseGroupApi + '/UpdateGroup',
         deleteGroupUrl: apiconfigbase.baseGroupApi + '/DeleteGroup',
         createGroupUrl: apiconfigbase.baseGroupApi + '/CreateGroup',
         getCacheUrl: apiconfigbase.baseCacheApi + '/ReloadCache',

         getUserGroupsUrl: apiconfigbase.baseUserAccountApi + '/GetUserGroups',

         getContextByGroupUrl: apiconfigbase.baseGroupApi + '/GetContextsByGroup',

         getAllContextUrl: apiconfigbase.baseLookupApi + '/GetAllContexts',

         loadStyleMerchUrl: apiconfigbase.basePlaceHolderApi + '/GetStyleMerchList',

         changePasswordUrl: apiconfigbase.baseUserAccountApi + '/ChangePassword',

         editUserProfileUrl: apiconfigbase.baseUserAccountApi + '/EditProfile',

         getVersionUrl: apiconfigbase.baseLookupApi + "/GetVersion",

         getReportUrl: apiconfigbase.baseReportApi + '/GetReports',

         getBusinessesUrl: apiconfigbase.baseLookupApi + "/GetBusinesses",

         getBUPlaceholderUrl: apiconfigbase.basePlaceHolderApi + '/GetPlaceholders',

         copyAsPlaceholderUrl: apiconfigbase.basePlaceHolderApi + '/CopyAsPlaceholder',

         checkPlaceholderNameUrl: apiconfigbase.basePlaceHolderApi + '/CheckPlaceholderName',

         saveProductAttributesUrl: apiconfigbase.basePlaceHolderApi + '/ChangeProductAttributes',

         saveVendorAttributesUrl: apiconfigbase.basePlaceHolderApi + '/ChangeVendorAttributes',

         saveDashboardAttributesUrl: apiconfigbase.basePlaceHolderApi + '/ChangeDashboardAttributes',

         sendMessageToChatRoomUrl: apiconfigbase.baseCollaborationApi + '/SendMessage',

         getMessageFromChatRoomUrl: apiconfigbase.baseCollaborationApi + '/GetMessage',

         getUserListFromChatRoomUrl: apiconfigbase.baseCollaborationApi + '/GetUserList'
     };

     //this.$get = function () {
     return this.api;
     //};
 }])

.service('apiconfigbase', ['baseConfiguration', function (baseConfiguration) {

    return {
        baseLookupApi: baseConfiguration.getBaseAddress() + '/api/Lookup',
        baseApplicationApi: baseConfiguration.getBaseAddress() + '/api/Application',
        baseFilterApi: baseConfiguration.getBaseAddress() + '/api/Filter',
        baseUserApi: baseConfiguration.getBaseAddress() + '/api/Account',
        basePlaceHolderApi: baseConfiguration.getBaseAddress() + '/api/PlaceHolder',
        baseUserAccountApi: baseConfiguration.getBaseAddress() + '/api/User',
        baseGroupApi: baseConfiguration.getBaseAddress() + '/api/Group',
        baseReportApi: baseConfiguration.getBaseAddress() + '/api/Report',
        baseCacheApi: baseConfiguration.getBaseAddress() + '/api/Cache',
        baseCollaborationApi: baseConfiguration.getBaseAddress() +'/api/Collaboration'
    };
}])

.service('baseConfiguration', ['$location', function ($location) {
    return {
        getBaseAddress: function () {
            // var currentServerBaseApiUrl = 'http://mgdev.swstrategies.com';
            var currentServerBaseApiUrl = '';

            if (currentServerBaseApiUrl === '') {
                var url = $location.protocol() + '://' + $location.host();
                if (url.indexOf('localhost') >= 0) {
                    var port = $location.port();

                    if (port !== undefined && port !== '')
                        url += ':' + $location.port();
                }
                return url;
            }

            return currentServerBaseApiUrl
        }
    };
}])

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/dashboard', {
        templateUrl: 'modules/dashboard/views/dashboard-view.html',
        controller: 'dashboard-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.CurrentPlaceHolder = null;
                $rootScope.PageTitle = "Merchant Guide - Dashboard";
            }
        }

    }).when('/dashboard/:placeholder', {
        templateUrl: 'modules/dashboard/views/dashboard-view.html',
        controller: 'dashboard-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide DashBoard";
            }
        }

    }).when('/login', {
        templateUrl: 'modules/login/views/login.html',
        controller: 'login-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide - Login";
            }
        }

    }).when('/SignUp', {
        templateUrl: 'modules/login/views/signup.html',
        controller: 'login-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide - Login";
            }
        }

    })
        .when('/forgotpassword', {
            templateUrl: 'modules/login/views/forgot_password.html',
            controller: 'login-controller',
            resolve: {
                setPageTitle: function ($rootScope) {
                    $rootScope.PageTitle = "Merchant Guide - Login";
                }
            }

        })
    .when('/logout', {
        templateUrl: 'modules/login/views/login.html',
        controller: 'login-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide - Login";
            }
        }

    })
    .otherwise({
        templateUrl: 'modules/login/views/login.html',
        controller: 'login-controller', resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide - Login";
            }
        }
    })
    .when('/user', {
        templateUrl: 'modules/user/views/users.html',
        controller: 'user-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide - Users";
            }
        },
        allowOnlyAdmin: true
    })
    .when('/createuser/:userId', {
        templateUrl: 'modules/user/views/create-user.html',
        controller: 'userprofile-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Edit Profile";
            }
        },
        allowOnlyAdmin: true
    })
        .when('/createuser', {
            templateUrl: 'modules/user/views/create-user.html',
            controller: 'userprofile-controller',
            resolve: {
                setPageTitle: function ($rootScope) {
                    $rootScope.PageTitle = "New User";
                }
            },
            allowOnlyAdmin: true
        })
           .when('/groups', {
               templateUrl: 'modules/groups/views/group-list.html',
               controller: 'group-controller',
               resolve: {
                   setPageTitle: function ($rootScope) {
                       $rootScope.PageTitle = " Merchant Guide - Groups";
                   }
               },
               allowOnlyAdmin: true
           })
         .when('/creategroup/:groupId', {
             templateUrl: 'modules/groups/views/create-group.html',
             controller: 'group-controller',
             resolve: {
                 setPageTitle: function ($rootScope) {
                     $rootScope.PageTitle = "Edit Group";
                 }
             },
             allowOnlyAdmin: true
         })
           .when('/creategroup', {
               templateUrl: 'modules/groups/views/create-group.html',
               controller: 'group-controller',
               resolve: {
                   setPageTitle: function ($rootScope) {
                       $rootScope.PageTitle = "New Group";
                   }
               },
               allowOnlyAdmin: true

           })

         .when('/changepassword', {
             templateUrl: 'modules/user/views/change-password.html',
             controller: 'userprofile-controller',
             resolve: {
                 setPageTitle: function ($rootScope) {
                     $rootScope.PageTitle = " Merchant Guide-Change Password";
                 }
             },
         })

         .when('/chatroom', {
             templateUrl: 'modules/chat/views/chatroom.html',
             controller: 'chat-controller',
             resolve: {
                 setPageTitle: function ($rootScope) {
                     $rootScope.PageTitle = " Merchant Guide-Chat Room";
                 }
             },
         })

        .when('/editprofile', {
            templateUrl: 'modules/user/views/edit-profile.html',
            controller: 'userprofile-controller',
            resolve: {
                setPageTitle: function ($rootScope) {
                    $rootScope.PageTitle = "Edit Profile";
                }
            },
        })

    .when('/placeholder', {
        templateUrl: 'modules/placeholder/views/placeholders.html',
        controller: 'place-holder-controller',
        resolve: {
            setPageTitle: function ($rootScope) {
                $rootScope.PageTitle = "Merchant Guide - Placeholders";
            }
        }
    });


}]).run(['$rootScope', '$location', '$cookieStore', '$http', 'loginService', 'lookupService', 'reportService', 'cacheService',
    function ($rootScope, $location, $cookieStore, $http, loginService, lookupService, reportService, cacheService) {


        $rootScope.Auth = false;
        $rootScope.EnableLinks = false;

        $rootScope.PageTitle = "Merchant Guide DashBoard";

        $rootScope.globals = $cookieStore.get('globals') || {};

        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = loginService.getCid(); // jshint ignore:line
            $rootScope.Auth = true;
            if ($.inArray($location.path(), ['/login', '/forgotpassword']) !== -1)
                $location.path("dashboard");
        }
        else {
            $location.path("login");
        }

        var bizCode = $cookieStore.get("BizCode");
        if (bizCode !== undefined && bizCode != null) {
            $rootScope.Business = { UnitCode: bizCode };
        }

        $rootScope.GetBusiness = function () {
            if ($rootScope.Business === undefined || $rootScope.Business == null
                || $rootScope.Business.UnitCode === undefined || $rootScope.Business.UnitCode == null) {

                var bizCode = $cookieStore.get("BizCode");
                if (bizCode !== undefined && bizCode != null) {
                    $rootScope.Business = { UnitCode: bizCode };

                }
            }

            return $rootScope.Business;
        }



        $rootScope.Logout = function () {
            $rootScope.Auth = false;
            loginService.clearCredentials();
            lookupService.clearBusinesses();
            $location.path('login');
            //lookupService.clearBusiness();
            loginService.logout().then(function () {

            });
        };

        $rootScope.IsAdmin = function () {
            return loginService.isAdmin();
        };

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var restrictedPage = $.inArray($location.path(), ['/login', '/forgotpassword']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $rootScope.Auth = false;
                $location.path('login');
            }
            else if (next.allowOnlyAdmin != undefined && next.allowOnlyAdmin == true) {
                if (!loginService.isAdmin()) {
                    var returnUrl = $location.url();
                    $rootScope.Auth = false;
                    $location.path('login').search({ returnUrl: returnUrl });
                }
            }
        });
        $rootScope.Reports = [];
        $rootScope.Version = "";
        $rootScope.Business = {};
        $rootScope.Class = {};
        $rootScope.SubClass = {};
        $rootScope.Department = {};
        $rootScope.IsContextExist = false;
        $rootScope.CurrentPlaceHolder = null;
        $rootScope.DashBoardSearchResults = {
            DashBoardInfo: {},
            Attributes: [],
            StartWeek: 0,
            EndWeek: 0,
            TotalWeeksSelected: [],
            Season: {},
            Zones: []
        };

        //Call this method in dashboard controller whenever we are chnaing context.
        $rootScope.SetContext = function (business, department, _class, subclass) {
            $rootScope.Business = business;
            $rootScope.Class = _class;
            $rootScope.SubClass = subclass;
            $rootScope.Department = department;
            $rootScope.IsContextExist = true;

            //Just in case we need it.
            $rootScope.$broadcast('on-context-changed', {
                Business: business,
                Department: department,
                Class: _class,
                SubClass: subclass
            });
        };

        $rootScope.RemoveContext = function () {
            $rootScope.Business = {};
            $rootScope.Class = {};
            $rootScope.SubClass = {};
            $rootScope.Department = {};
            $rootScope.IsContextExist = false;
        };

        //It will be called in dashboard controller get the search results from
        //DB to set a results globally so that we can use it in placeholder controller
        //while saving it.
        $rootScope.SetDashBoardSearchResults = function (dashBoardData) {

            $rootScope.DashBoardSearchResults.DashBoardInfo = dashBoardData.DashBoardInfo;
            $rootScope.DashBoardSearchResults.Attributes = dashBoardData.Attributes;
            $rootScope.DashBoardSearchResults.StartWeek = dashBoardData.StartWeek;
            $rootScope.DashBoardSearchResults.EndWeek = dashBoardData.EndWeek;
            $rootScope.DashBoardSearchResults.TotalWeeksSelected = [];
            $rootScope.DashBoardSearchResults.LocationAttributes = dashBoardData.LocationAttributes;
            $rootScope.DashBoardSearchResults.Zones = dashBoardData.Zones;
            $rootScope.DashBoardSearchResults.EnableZones = dashBoardData.EnableZones;
            $rootScope.DashBoardSearchResults.StartWeekObj = dashBoardData.StartWeekObj;
            $rootScope.DashBoardSearchResults.EndWeekObj = dashBoardData.EndWeekObj;
            
            var season = null;

            if (dashBoardData.Season != null && dashBoardData.Season !== undefined) {
                season = dashBoardData.Season;
            }
            1
            $rootScope.SetSeasonTime(season, season.SeasonTime,
                $rootScope.DashBoardSearchResults.StartWeek,
                $rootScope.DashBoardSearchResults.EndWeek);

            $rootScope.$broadcast('after-search-executed',
                { DashBoardSearchResults: $rootScope.DashBoardSearchResults });
        };

        //We are calling this method while opening a placeholder popup
        //so that we can track all the item attributes we have on dashboard page and
        //can save them while saving placholder.
        $rootScope.SetItemAttributesForPlaceholder = function (itemAttributes) {
            $rootScope.DashBoardSearchResults.Attributes = itemAttributes;
        };

        $rootScope.SetSeasonTime = function (season, seasonTime, startWeek, endWeek) {

            if ($rootScope.DashBoardSearchResults !== null) {
                $rootScope.DashBoardSearchResults.StartWeek = startWeek;
                $rootScope.DashBoardSearchResults.EndWeek = endWeek;
            }

            if (season !== undefined && season != null)
                $rootScope.DashBoardSearchResults.Season = season;
        }

        $rootScope.ConserveSavedPlaceHolder = function (placeHolder) {
            $rootScope.CurrentPlaceHolder = placeHolder;
        };

        $rootScope.ClearSavedPlaceHolder = function () {
            $rootScope.CurrentPlaceHolder = null;
        };

        $rootScope.getVersion = function () {
            lookupService.getVersion().then(function (response) {
                $rootScope.Version = response;
            });
        };

        $rootScope.getReports = function () {
            reportService.getAllReports().then(function (response) {
                $rootScope.Reports = response;
            })
        };

        $rootScope.ReloadCache = function () {
            cacheService.ReloadCache()
                .then(function (response) {
                })
        };

        $rootScope.getVersion();

        $rootScope.getReports();

        $rootScope.ToggleLinks = function (enable) {
            $rootScope.EnableLinks = enable;
        }

        $rootScope.EnablePlaceholderbutton = function (enable) {
            $rootScope.PlaceholderButton = enable;
        }

    }]);;

//$rootScope.ShowLoader = true;
