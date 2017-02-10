angular.module('mg-Services')
.service('reportService', ['apiconfig', 'api',
    function (apiconfig, api) {
        var reportService = {

            getAllReports: function () {
                return api.get(apiconfig.getReportUrl);
            }
            

        };
        return reportService;

    }]);