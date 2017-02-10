angular.module('mg-Services')
.service('userService', ['apiconfig', 'api',
    function (apiconfig, api) {
        var userService = {
            createUser: function (userModel) {
                return api.post(apiconfig.createUserUrl, userModel);
            },
            getUsers: function () {
                return api.get(apiconfig.getUsersUrl);
            },
            getUser: function (Id) {
                return api.get(apiconfig.getUserApi + '?userId=' + Id);
            },
            getCurrentUser: function (Id) {
                return api.get(apiconfig.getUserApi);
            },
            updateUser: function (user) {
                return api.post(apiconfig.updateUserUrl, user);
            },
            deleteUser: function (userId) {
                return api.get(apiconfig.deleteUserUrl + '?userId=' + userId);
            },
            Search: function (seachInputs) {
                return api.get(apiconfig.searchUserUrl + '?name=' + seachInputs);
            },
            getRoles: function () {
                return api.get(apiconfig.getRolesUrl);
            },
            getGroups: function () {
                return api.get(apiconfig.getallgroupsUrl);
            },
            getUserGroups: function (userId) {
                return api.get(apiconfig.getUserGroupsUrl + '?userId=' + userId);
            },
            changePassword: function (passwordEncr) {
                return api.post(apiconfig.changePasswordUrl + "?passwordEncr=" + passwordEncr);
            },
            editProfile: function (user) {
                return api.post(apiconfig.editUserProfileUrl, user);
            }

        };
        return userService;

    }]);