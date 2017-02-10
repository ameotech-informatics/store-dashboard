angular.module('mg-Services')
.service('appService', ['$http', '$q', 'apiconfig', 'api', function ($http, $q, apiconfig, api) {

    var appService = {
        calculateGraphs: function (searchModel) {
            return api.post(apiconfig.calculateGraphUrl, searchModel);
        },

        calculateStoreCountSegments: function (searchModel) {
            return api.post(apiconfig.storeCountSegmentUrl, searchModel);
        },

        getSeasonProfiles: function (searchModel)
        {
            return api.post(apiconfig.seasonProfileUrl, searchModel);
        },

        getRos: function (searchModel)
        {
            return api.post(apiconfig.rosUrl, searchModel);
        },
        getDashboardData: function (searchModel) {
            
            return api.post(apiconfig.dashboardDataUrl, searchModel);
        }
        
    };

    return appService;

}]);