angular.module('mg-Services')
.service('filterService', ['$http', '$q', 'apiconfig', 'api', function ($http, $q, apiconfig, api) {

    var filterService = {
        getFilters: function (businessUnitCode, departmentCode, classCode, subClassCode) {
            return api.get(apiconfig.loadFiltersUrl
                   + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode
                + "&classCode=" + classCode + "&subClassCode=" + subClassCode);
        }
    };

    return filterService;

}]);