angular.module('mgApp')

.filter('markdown', function () {
    return function (input) {
        if (input == null || input === undefined || input === '')
            return "";

        return input.substring(0, 8) + "...";
    };
})

.directive('noteBox', function () {
    return {
        restrict: 'EA',
        scope: {
            ngModel: "="
        },
        template: '<div>' +
                    '<a tooltip="{{ngModel}}" href="javascript:" ng-show="!enableShow" ng-click="onClickModel($event)" class="form-control lesspad">{{ngModel | markdown}}</a>' +
                      '<p ng-show="enableShow" class="noteAttrP">' +
                        '<textarea rows="5" cols="25" class="textareacontainer form-control noteTextArea" ng-blur="onblur()" ng-model="ngModel"></textarea>' +
                      '</p>' +
                  '</div>',
        link: function (scope, element, attr, ngModelCtrl) {

            //scope.modelText = ngModelCtrl.$viewValue;
            //scope.boxModel = scope.modelText;
            scope.enableShow = false;
            scope.onClickModel = function ($event) {
                scope.enableShow = true;

                var timeout = setTimeout(function () {
                    $($event.target).parent("div").find(".textareacontainer")[0].focus();
                    clearTimeout(timeout);
                }, 500);
            };

            scope.onblur = function ($event) {
                scope.enableShow = false;
            };
        }
    };
})

.directive('numbersOnly', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {

            function validate(text) {
                if (text) {

                    var mask = attr.numbersOnly;

                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(validate)
        }
    };

}])

.directive('uiSelectRequired', function () {
    return {
        require: 'ngModel',
        link: function postLink(scope, element, attrs, ngModel) {
            var required = attrs.uiSelectRequired;
            if (required === "true") {
                ngModel.$validators.required = function (value) {
                    if (value == "")
                        return false;
                    if (value === undefined || value == null)
                        return false;

                    return true;
                    //return (value !== undefined && value != null && value != '');
                };
            }
        }
    };
})

.directive('floatOnly', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {

            scope.prevText = "";

            function validate(text) {
                if (text) {

                    //var patt = new RegExp(/^[0-9]*\.[0-9]*$/);
                    ///var res = patt.test(text);

                    var res = text.match(/^[0-9]*\.?[0-9]*$/);

                    if (res == null || res == "" || res === undefined) {
                        transformedInput = scope.prevText;
                    }
                    else {
                        transformedInput = text;
                    }

                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();

                    scope.prevText = transformedInput;
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(validate)
        }
    };

}])

.directive('mgCamera', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: ['<div class="html-camera">',
            '<div style="height:250px;width:250px;margin:0px auto;"><video id="video" style="height:250px;width:250px;" autoplay></video></div>',
            '</div>', ].join(''),

        link: function (scope, element, attr, ngModelCtrl) {

            // var mobileTemplate = '<div class="html-camera"><input type="file" capture="camera" accept="image/*" id="cameraInput" name="cameraInput"><canvas id="canvas"></canvas></div>';

            //Detect If device is a mobile device----'<canvas id="canvas" style="display:none;"></canvas>',

            scope.executed = false;
            // Put event listeners into place
            var videoPlaying = false;
            var canvas = document.getElementById("canvas");
            var video = document.getElementById("video");
            var context = canvas.getContext("2d");
            var videoObj = { "video": true };
            var errBack = function (error) {
                console.log("Video capture error: ", error.code);
            };
            var userMedia = function () {

                if (scope.executed)
                    return;

                scope.executed = true;
                if (navigator.webkitGetUserMedia) { // WebKit-prefixed

                    navigator.webkitGetUserMedia(videoObj, function (stream) {
                        video.src = window.URL.createObjectURL(stream);
                        video.play();
                        videoPlaying = true;
                    }, errBack);
                }
                else if (navigator.mozGetUserMedia) { // Firefox-prefixed
                    navigator.mozGetUserMedia(videoObj, function (stream) {
                        video.src = window.URL.createObjectURL(stream);
                        video.play();
                        videoPlaying = true;
                    }, errBack);
                }
                else if (navigator.getUserMedia) { // Standard
                    navigator.getUserMedia(videoObj, function (stream) {
                        video.src = stream;
                        video.play();
                        videoPlaying = true;
                    }, errBack);
                }

            };

            var timeout = setTimeout(function () {
                userMedia();
                clearTimeout(timeout);
            }, 1000);

            document.getElementById('btnClick').addEventListener('click', function () {
                if (videoPlaying) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    var data = canvas.toDataURL('image/webp');
                    $rootScope.$broadcast('onSnapShotCreated', data);
                }
            }, false);
        }

    };
}])

app.directive('moneyFormat', ['$filter', function ($filter) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            ctrl.$formatters.unshift(function () {
                return $filter('number')(ctrl.$modelValue);
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                    b = $filter('number')(plainNumber);

                elem.val(b);

                return plainNumber;
            });
        }
    };
}]);