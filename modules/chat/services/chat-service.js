angular.module('mg-Services')
.service('chatService', ['$http', '$q', 'apiconfig', 'api', function ($http, $q, apiconfig, api) {

    var chatService = {
        getMessageFromChatRoom: function (placeholderId) {
            return api.get(apiconfig.getMessageFromChatRoomUrl + "?placeholderId=" + placeholderId);
        },

        sendMessageToChatRoom: function (chatRoomObject) {
            return api.post(apiconfig.sendMessageToChatRoomUrl, chatRoomObject);
        },

        getUserListFromChatRoom: function (placeholderId) {
            return api.get(apiconfig.getUserListFromChatRoomUrl + "?placeholderId=" + placeholderId);
        }
    };

    return chatService;

}]);