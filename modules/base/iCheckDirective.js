
app.directive('icheckbox', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        require: 'ngModel',
        scope: {
            clickHandler: '&',
            model: '=ngModel'
        },
        link: function ($scope, element, $attrs, ngModel) {

            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch('model', function (newValue) {
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkedClass: 'ichkBoxBlue',//'icheckbox_flat-blue',
                    checkboxClass: 'fa fa-check-square',//'icheckbox_flat-blue',
                    //radioClass: 'iradio_flat-aero',
                    uncheckedClass: 'icon-check-empty ichkBoxGray',
                    hoverClass: 'test'

                }).on('ifChanged', function (event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            ngModel.$setViewValue(event.target.checked);
                            if ($scope.clickHandler !== undefined)
                                $scope.clickHandler();
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            ngModel.$setViewValue(value);
                            if ($scope.clickHandler !== undefined)
                                $scope.clickHandler();
                        });
                    }
                });
            });
        }
    };
}]);