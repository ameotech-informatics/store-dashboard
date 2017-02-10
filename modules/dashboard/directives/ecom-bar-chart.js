app.directive('ecomBarChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            watchfor: '@',
            avgProductTypeRos: '@',
            avgHistoricalRos: '@'
        },
        template: '<div><div id="containerest" style="width: 100%; height: 230px;"></div></div>',
        link: function (scope, element, attr) {

            scope.createChart = function () {

                $('#containerest').highcharts({
                    chart: {
                        renderTo: 'containerest',
                        type: 'bar'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: []
                    },
                    tooltip: {
                        formatter: function () {
                            return this.series.name + ' : ' + this.point.options.y
                        }
                    },
                    series: [{
                        name: "Avg. Historical SubClass ROS",
                        ros: parseInt(scope.avgHistoricalRos),
                        color: '#082C7C',
                        dataLabels: {

                            enabled: true,
                            align: 'right',
                            color: '#FFFFFF',
                            x: -5,
                            y: -30,
                            formatter: function () {
                                return "Avg. Historical SubClass ROS";
                            }
                        },
                        showInLegend: false,

                        data: [parseFloat(scope.avgHistoricalRos)],

                    }, {
                        name: "Avg. Product Type ROS",
                        ros: scope.avgProductTypeRos,
                        grouping: false,
                        dataLabels: {
                            inside: true,
                            enabled: true,
                            align: 'right',
                            color: '#FFFFFF',
                            x: -5,
                            y: 0,
                            formatter: function () {
                                return "Avg. Product Type ROS";
                            }
                        },
                        color: '#12BBDC',
                        showInLegend: false,
                        pointPadding: 0.3,
                        zIndex: 10,
                        data: [parseFloat(scope.avgProductTypeRos)]
                    }]
                });
            }

            scope.$watch('watchfor', function (val) {

                if (val === "true") {
                    var tempScrollTop = $(window).scrollTop();
                    scope.createChart();
                    $(window).scrollTop(tempScrollTop);
                }
            });

            $("#ecom-graph-containerS").resize(function () {
                scope.createChart();
            });


        }
    };
}]);

app.directive('ecomPerceLikely', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            watchfor: '@',
            avgPerceLikeliHood: "@"
        },
        template: '<div><div id="perlikehood" style="width: 100%; height: 230px;"></div></div>',
        link: function (scope, element, attr) {

            $("#perce-graph-container").resize(function () {
                scope.createPieChart();
            });

            scope.createPieChart = function () {

                // Build the chart
                $('#perlikehood').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        verticalAlign: 'middle',
                        floating: true,
                        text: scope.avgPerceLikeliHood + '%',
                        color: '#d9534f'
                    },
                    colors: ['#ED561B'],
                    tooltip: {
                        formatter: function () {
                            return this.series.name + ' : ' + +scope.avgPerceLikeliHood + '%'
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: false
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Pecentile Likelihood',
                        data: [
                            [parseInt(scope.avgPerceLikeliHood)]
                        ]
                    }]
                });
            }

            scope.$watch('watchfor', function (val) {

                if (val === "true") {
                    var tempScrollTop = $(window).scrollTop();
                    scope.createPieChart();
                    $(window).scrollTop(tempScrollTop);
                }
            });

        }
    };
});