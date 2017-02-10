angular.module('mgApp')

.directive('storeWeekSlider', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            watcher: "@"
        },
        template: '<div><div id="amount"></div><div id="slider-range"></div>',
        link: function (scope, element, attr) {

            //scope.$watch('datasource', function (val) {
            //if (val == "true") {
            // scope.weeks = scope.datasource;
            /// if (scope.weeks !== undefined) {
            //$(".jslider").remove();
            //$(element).val("0;0");
            $timeout(function () {
                $("#slider-range").slider({
                    range: true,
                    min: 0,
                    max: 500,
                    values: [75, 300],
                    slide: function (event, ui) {
                         $("#amount").html("$" + ui.values[0] + " - $" + ui.values[1]);
                    }
                });
            }, 1000);

            //var slider = $(element).slider({
            //    from: scope.weeks[0].WeekNum,
            //    to: scope.weeks[scope.weeks.length - 1].WeekNum,
            //    //heterogeneity: ['50/100', '75/250'],
            //    //scale: [scope.weeks[0].WeekNum, '|', scope.weeks[scope.weeks.length - 1].WeekNum],
            //    limits: false,
            //    step: 1,
            //    skin: 'blue',
            //    calculate: function (value) {
            //        if (value > 0)
            //            value = value - 1;
            //        if (scope.weeks[value] !== undefined) {
            //            return scope.weeks[value].WeekCode;
            //        }
            //        return "";
            //    }
            //});

            // var j = $(slider).data("jslider");
            //if (j)
            //  j.update();
            //  }
            //}
            // });
        }
    };

}])