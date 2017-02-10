angular.module('mg-Services')
.service('placeHolderService', ['$http', '$q', 'apiconfig', 'api', function ($http, $q, apiconfig, api) {
    var __businesses = [];
    var placeHolderService = {

        loadPlaceholders: function (businessUnitCode) {
            return api.get(apiconfig.getBUPlaceholderUrl + '?businessUnitCode=' + businessUnitCode);
        },

        linkPlaceholderToBusinessUnitCode: function (placeholderId, selectedContextBusinessUnitCode, businessUnitCode) {

            return api.post(apiconfig.copyAsPlaceholderUrl,
                {
                    SelectBusinessUnitCode: selectedContextBusinessUnitCode,
                    PlaceholderId: placeholderId,
                    BusinessUnitCode: businessUnitCode
                });
        },

        getPlaceHolderVendorAttributes: function (businessUnitCode, departmentCode, classCode, subClassCode, placeholderId) {
            return api.get(apiconfig.placeHolderVendorAttributesUrl
                + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode +
                "&classCode=" + classCode + "&subClassCode=" + subClassCode + "&placeholderId=" + placeholderId);
        },

        getPlaceHolderProductAttributes: function (businessUnitCode, departmentCode, classCode, subClassCode, placeholderId) {
            return api.get(apiconfig.placeHolderProductAttributesUrl
                + "?businessUnitCode=" + businessUnitCode + "&departmentCode=" + departmentCode +
                "&classCode=" + classCode + "&subClassCode=" + subClassCode + "&placeholderId=" + placeholderId);
        },

        savePlaceHolder: function (placeHolder) {
            return api.post(apiconfig.saveplaceHolderUrl, placeHolder);
        },

        copyPlaceHolder: function (placeHolder) {
            return api.post(apiconfig.copyplaceHolderUrl, placeHolder);
        },

        getPlaceHolders: function (placeHolder) {
            return api.get(apiconfig.getPlaceholdersUrl);
        },
        getWeeks: function (weeks) {
            return api.get(apiconfig.loadWeeks);
        },


        DeletePlaceHolder: function (placeHolderIds) {
            return api.post(apiconfig.DeletePlaceHolderUrl, placeHolderIds);
        },

        Search: function (seachInputs) {
            return api.post(apiconfig.searchPlaceHolderUrl, seachInputs);
        },

        getPlaceHolder: function (placeHolderId, businessUnitCode) {
            return api.get(apiconfig.getPlaceholderUrl + '?placeHolderId=' + placeHolderId + '&businessUnitCode=' + businessUnitCode);
        },

        changeAttributes: function (changedAttributes) {
            return api.post(apiconfig.changeAttirbutesUrl, changedAttributes);
        },

        loadWeeks: function () {
            return api.get(apiconfig.loadWeeks);
        },
        loadStyleMerchNameList: function () {
            return api.get(apiconfig.loadStyleMerchUrl);
        },
        checkCCName: function (placeholderName) {
            return api.get(apiconfig.checkPlaceholderNameUrl + '?placeholderName=' + placeholderName);
        },

        saveProductAttributes: function (changedProductAttributes) {
            return api.post(apiconfig.saveProductAttributesUrl, changedProductAttributes);
        },
        saveVendorAttributes: function (changedVendorAttributes) {
            return api.post(apiconfig.saveVendorAttributesUrl, changedVendorAttributes);
        },

        saveDashboardAttributes: function (changedDashboardAttributes) {

            return api.post(apiconfig.saveDashboardAttributesUrl, changedDashboardAttributes);
        },
    }

    return placeHolderService;
}]);
