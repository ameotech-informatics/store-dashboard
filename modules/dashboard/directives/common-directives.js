app.directive('progressBar', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var watchFor = attrs.progressBarWatch;

            // update now
            var val = scope[watchFor];
            element.attr('aria-valuenow', val)
              .css('width', val + "%");

            // watch for the value
            scope.$watch(watchFor, function (val) {
                element.attr('aria-valuenow', val)
                  .css('width', val + "%");
            })
        }
    }
});

app.directive('mgMask', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var mask = attrs.mgMask;
            $(element).mask(mask, { placeholder: mask });
        }
    }
})