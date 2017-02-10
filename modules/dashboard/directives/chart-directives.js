
angular.module('mg-Directives', [])

.directive('clustorGraph', ['$timeout', function ($timeout) {

    return {
        restrict: 'EA',
        replace: true,
        template: '<div><div class="chartdiv" id="clustorGraphContainer" />' +
                    '<div id="tooltip" class="thetooltip"><p id="tooltiptext" style="margin:0">default</p>' +
                  '</div></div>',
        scope: {
            datasource: '=',
            watchfor: '@',
            subclassros: '='
        },
        link: function (scope, element, attr) {

            var $tooltip = $('#tooltip');
            $tooltip.hide();
            var $text = $('#tooltiptext');

            displayTooltip = function (text, left) {
                $text.text(text);
                $tooltip.show();
                $tooltip.css('left', parseInt(left) + 24 + 'px');
            };

            var timer;

            hideTooltip = function (e) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    $tooltip.fadeOut();
                }, 1000);
            };

            scope.clustorChart = null;

            $("#clustor-graph-container").resize(function () {
                if (scope.clustorChart != null) {
                    scope.bind();
                }
            });

            scope.bind = function () {

                var seriesList = [];
                var rosArr = [];
                angular.forEach(scope.datasource, function (item) {

                    seriesList.push({
                        name: item.BrandName,
                        x: item.ROS,
                        y: item.Sales,
                        percLikelihood: item.PercLikelihood
                    });

                    rosArr.push(item.ROS);

                });

                var max = 0;

                if (rosArr.length > 0) {
                    max = rosArr.max();
                    max = max + 0.25;
                }

                scope.clustorChart = new Highcharts.Chart({

                    chart: {
                        renderTo: 'clustorGraphContainer',
                        type: 'bubble',
                        zoomType: 'xy'
                    },
                    legend: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        formatter: function () {
                            return this.point.options.name + '<br/>Rate of Sale:' + this.point.options.x + '<br/>Likelihood Of Sales:'
                                + this.point.options.y + '<br/>Percentile Likelihood in Cluster:' + this.point.options.percLikelihood + '%'
                        }
                    },
                    xAxis: [{
                        title: {
                            text: ''
                        },
                        min: 0,
                        max: max > 0 ? max : null,
                        plotLines: [{
                            color: '#6D869F', // Color value                            
                            value: scope.subclassros, // Value of where the line will appear
                            width: 2, // Width of the line    
                            label: {
                                text: 'SubClass ROS', // Content of the label. 
                                align: 'left', // Positioning of the label. 
                                style: { "color": "#6D869F", "font-size": "10px" }
                            },
                            events: {
                                mouseover: function (e) {
                                    displayTooltip('SubClassROS: ' + scope.subclassros, this.svgElem.d.split(' ')[1]);
                                },
                                mouseout: hideTooltip
                            }
                        }]
                    }],
                    yAxis: [{
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            color: '#6D869F',
                            width: 2,
                            value: 1
                        }]
                    }],

                    plotOptions: {
                        bubble: {
                            maxSize: 20
                        }
                    },

                    series: [{
                        data: seriesList
                    }],
                }, function (chart) {
                    angular.forEach(chart.series[0].data, function (data) {

                        var point = data;

                        var text = chart.renderer.text(data.name).add();

                        textBBox = text.getBBox();
                        var x = point.plotX < 200 ? (point.plotX + 50) : point.plotX - (textBBox.width - 40);
                        var y = point.plotY + chart.plotTop - 10;
                        text.attr({ x: x, y: y });

                        //text = chart.renderer.text(
                        //    data.name,
                        //    point.plotX < 300 ? (point.plotX + chart.plotLeft) : (point.plotX - chart.plotLeft - 50),
                        //    point.plotY + chart.plotTop - 10
                        //).attr({
                        //    zIndex: 5
                        //}).add();
                    });

                });
            };

            //scope.__clustorWidth = $("#clustor-graph-container").width();
            //function __check() {

            //    var width = $("#clustor-graph-container").width();

            //    if (width != scope.__clustorWidth) {
            //        var tempScrollTop = $(window).scrollTop();
            //        scope.bind();
            //        $(window).scrollTop(tempScrollTop);
            //    }
            //    $timeout(__check, 1000);
            //}
            //__check();



            scope.$watch('watchfor', function (val) {
                if (val === "true") {
                    var tempScrollTop = $(window).scrollTop();
                    scope.bind();
                    $(window).scrollTop(tempScrollTop);
                }
            });
        }
    };


}])

.directive('volumeGrade', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            datasource: '=',
            watchfor: '@',
            isEcom: '='
        },
        template: '<div><div id="volumeGrade" /></div>',

        link: function (scope, element, attr) {

            $("#volumeGradeContainer").resize(function () {
                scope.bind();
            });

            scope.bind = function () {

                if (scope.datasource == null || scope.datasource.GradeCounts === undefined)
                    return;

                var gradeNames = [];
                var searies = [];
                highGrades = [];
                avgGrades = [];

                var volumeGrades = scope.datasource.GradeCounts;

                angular.forEach(volumeGrades, function (item) {

                    if (gradeNames.indexOf(item.GradeName) < 0)
                        gradeNames.push(item.GradeName);

                    highGrades.push(Math.round(parseFloat(item.MaxCCHighVolume)));
                    avgGrades.push(Math.round(parseFloat(item.AvgCCHighVolume)));
                });

                if (!scope.isEcom) {

                    searies.push({
                        name: "Max CC",
                        data: highGrades
                    });
                    searies.push({
                        name: "Avg CC",
                        data: avgGrades
                    });

                }
                else {
                    searies.push({
                        name: "Max CC",
                        data: highGrades
                    });
                    searies.push({
                        name: "Avg CC",
                        data: avgGrades
                    });
                }

                $('#volumeGrade').highcharts({
                    chart: {
                        type: 'bubble'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: gradeNames//!scope.isEcom ? ['High Volume', 'Low Volume'] : ["eComG"]
                    },
                    yAxis: {
                        title: {
                            text: 'CC Count (MAX/AVG)'
                        }
                    },
                    tooltip: {
                        useHTML: true,
                        //pointFormat: this.series.name + '<br/>' + this.x + ':' + this.y +
                        //        "<br/>Info : <div style='width:30px; white-space: pre-wrap;'>" + scope.datasource.Info + "</div>",
                        formatter: function () {
                            return this.series.name + '<br/>' + this.x + ':' + this.y +
                                "<br/>Info : <div style='white-space: normal;width:150px;!important;'>" + scope.datasource.Info + "</div>";
                        }
                    },
                    plotOptions: {
                        bubble: {
                            maxSize: 20
                        }
                    },
                    series: searies
                    //series: !scope.isEcom ? [{
                    //    name: 'Max CC',
                    //    data: [scope.datasource.MaxCC, scope.datasource.MinCC] //High, Low
                    //}, {
                    //    name: 'Avg CC',
                    //    data: [scope.datasource.MaxAvgCC, scope.datasource.MinAvgCC]
                    //}] :

                    //[{
                    //    name: 'Max CC',
                    //    data: [scope.datasource.MaxCC] //High, Low
                    //}, {
                    //    name: 'Avg CC',
                    //    data: [scope.datasource.MaxAvgCC]
                    //}]
                });
            }

            scope.$watch('watchfor', function (val) {

                if (val === "true") {
                    var tempScrollTop = $(window).scrollTop();
                    scope.bind();
                    $(window).scrollTop(tempScrollTop);
                }
            });
        }
    };

}]);

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};