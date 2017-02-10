angular.module('mg-Services')
.service('groupService', ['apiconfig', 'api',
    function (apiconfig, api) {
        var groupService = {

            createGroup: function (groupModel) {
                return api.post(apiconfig.createGroupUrl, groupModel);
            },
            getAllGroups: function () {
                return api.get(apiconfig.getallgroupsUrl);
            },
            Search: function (seachInputs) {
                return api.get(apiconfig.searchgroupUrl + '?Name=' + seachInputs);
            },
            updateGroup: function (group) {
                return api.post(apiconfig.updateGroupUrl, group);
            },
            deleteGroup: function (groupId) {
                return api.get(apiconfig.deleteGroupUrl + '?groupId=' + groupId);
            },
            getGroup: function (Id) {
                return api.get(apiconfig.getGroupUrl + '?groupId=' + Id);
            },
            getAllContexts: function () {
                return api.get(apiconfig.getAllContextUrl);
            },
            getContextByGroup: function (groupId)
            {
                return api.get(apiconfig.getContextByGroupUrl + '?groupId=' + groupId);
            }

        };
        return groupService;

    }]);