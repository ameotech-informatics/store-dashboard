app.controller('chat-controller', ['$scope', '$rootScope', '$timeout', '$interval', 'chatService',
    function ($scope, $rootScope, $timeout, $interval,chatService) {
    $scope.ChatRoom = {
        Username: "",
        Password: "",
        ChatRoomPlaceHolderId: "",
        Message: ""
    };

    $scope.OnSendMessage = function ($event) {
        if ($event.keyCode === 13)
            $scope.OnSendMessageToChatRoom();
    }

    $scope.OnSendMessageToChatRoom = function () {

        $scope.ChatRoom.ChatRoomPlaceHolderId = $rootScope.CurrentPlaceHolder.Id;
        if ($scope.ChatRoom.ChatRoomPlaceHolderId === null || $scope.ChatRoom.ChatRoomPlaceHolderId === undefined || $scope.ChatRoom.ChatRoomPlaceHolderId === "") {
            return;
        }
        chatService.sendMessageToChatRoom($scope.ChatRoom).then(function (responce) {
            if (responce) {
                $scope.ChatRoom.Message = "";
            }
        });
    }

    
    $interval(function () {
        $scope.OnGetMessageFromChatRoom();
    }, 2000);

    $scope.ChatMessages = [];
    $scope.OnGetMessageFromChatRoom = function () {
        if ($rootScope.CurrentPlaceHolder === undefined || $rootScope.CurrentPlaceHolder == null) {
            return;
        }
        chatService.getMessageFromChatRoom($rootScope.CurrentPlaceHolder.Id).
            then(function (response) {
                if (response != null && response != undefined) {
                    $scope.ChatMessages = response;
                }
                console.log($scope.ChatMessages);
            })
    }


        //START CODE
    $interval(function () {
        $scope.OnGetUserListFromChatRoom();
    }, 2000);

    $scope.UserList = [];
    $scope.OnGetUserListFromChatRoom = function () {
        if ($rootScope.CurrentPlaceHolder === undefined || $rootScope.CurrentPlaceHolder == null) {
            return;
        }
        chatService.getUserListFromChatRoom($rootScope.CurrentPlaceHolder.Id).
            then(function (response) {
                if (response != null && response != undefined) {
                    $scope.UserList = response;
                }
                console.log($scope.UserList);
            })
    }
        //END CODE





}]);