angular.module('mg-Services')
.service('cacheService', ['apiconfig', 'api',
    function (apiconfig, api) {
        var cacheService = {

            ReloadCache: function () {
                return api.get(apiconfig.getCacheUrl);
            }


        };
        return cacheService;

    }]);