angular.module('mg-Services')
.service('lookupService', ['$http', '$q', 'apiconfig', 'api', function ($http, $q, apiconfig, api) {
    var __businesses = [];
    var lookupService = {
        business: [],
        getSeasonMapping: function (bizCode, depCode, clsCode, subclsCode) {
            return api.get(apiconfig.seasonMappingUrl + "?businessUnitCode=" + bizCode + "&departmentCode=" + depCode
                + "&classCode=" + clsCode + "&subClassCode=" + subclsCode);
        },

        getItemFilters: function () {
            return api.get(apiconfig.loadItemAttributes);
        },

        getItemAttributesByContext: function (businessUnitCode, departmentCode, classCode, subClassCode, placeholderId) {

            return api.get(apiconfig.loadItemAttributesByContext
                + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode
                + "&classCode=" + classCode + "&subClassCode=" + subClassCode + "&placeholderId=" + placeholderId);
        },

        getLocationFilters: function (bizCode, depCode, clsCode, subclsCode) {
            return api.get(apiconfig.loadLocationAttributes + "?businessUnitCode=" + bizCode + "&departmentCode=" + depCode
                + "&classCode=" + clsCode + "&subClassCode=" + subclsCode);
        },

        getZones: function (bizCode, depCode, clsCode, subclsCode) {
            return api.get(apiconfig.loadZones + "?businessUnitCode=" + bizCode + "&departmentCode=" + depCode
                + "&classCode=" + clsCode + "&subClassCode=" + subclsCode);
        },

        clearBusinesses: function () {
            __businesses = [];
        },

        getDepartmentsByBizCode: function (businessUnitCode) {
            return api.get(apiconfig.loadDepartmentUrl + "?businessUnitCode=" + businessUnitCode);
        },

        getSubClasses: function (businessUnitCode, departmentCode, classCode) {

            return api.get(apiconfig.loadSubClassesUrl
              + "?businessUnitCode=" + businessUnitCode
              + "&departmentCode=" + departmentCode
              + "&classCode=" + classCode);
        },

        getBusinesses: function () {
            return api.get(apiconfig.getBusinessesUrl);
        },

        getContexts: function (callback) {

            if (!__businesses || __businesses.length <= 0) {
                api.get(apiconfig.loadBusinesesUrl).then(function (result) {
                    __businesses = result;
                    if (callback && callback != undefined) {
                        callback(result);
                    }
                });
            }
            else {
                if (callback && callback != undefined) {
                    callback(__businesses);
                }
            }
        },

        getClassesByBizCodeAndDepartMentCode: function (businessUnitCode, departmentCode) {

            return api.get(apiconfig.loadClassesUrl
                + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode);
        },

        getPlaceHolderVendorAttributes: function (businessUnitCode, departmentCode, classCode, subClassCode) {
            return api.get(apiconfig.loadPlaceHolderVendorAttributesByContextUrl
                + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode +
                "&classCode=" + classCode + "&subClassCode=" + subClassCode);
        },

        getPlaceHolderProductAttributes: function (businessUnitCode, departmentCode, classCode, subClassCode) {
            return api.get(apiconfig.loadPlaceHolderProductAttributesByContextUrl
                + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode +
                "&classCode=" + classCode + "&subClassCode=" + subClassCode);
        },

        getVersion: function () {
            return api.get(apiconfig.getVersionUrl);
        }
    }

    return lookupService;
}]);