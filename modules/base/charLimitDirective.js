app.directive('limit', function () {
    return {

        restrict: 'EA',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {

            function validate(text) {

                if (text) {
                    var modelValue = attr.limit;
                    if (modelValue === undefined || modelValue == null
                        || modelValue <= 0 || modelValue === "") {
                        modelValue = 50;
                    }

                    var totalLength = text.length;

                    if (totalLength <= modelValue) {
                        ngModelCtrl.$setViewValue(text);
                        ngModelCtrl.$render();
                    }
                    else {
                        ngModelCtrl.$setViewValue(scope.prevText);
                        ngModelCtrl.$render();
                        return scope.prevText;
                    }
                    scope.prevText = text;
                    return text;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(validate)

        }
    };
})