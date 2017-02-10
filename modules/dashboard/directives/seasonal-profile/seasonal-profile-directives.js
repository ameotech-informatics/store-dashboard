//angular.module('mg-Directives', [])

app.directive('seasonProfile', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            datasource: '=',
            zones: '=',
            watchfor: '@',
            weekfrom: "@",
            weekto: "@",
            zonechange: '@',
            startweek: '=',
            endweek: "=",
            season: '='
        },
        templateUrl: 'modules/dashboard/directives/seasonal-profile/seasonal-profile-view.html',

        link: function (scope, element, attr) {

            var colors = ["#5bc0de", "#d9534f", "#5cb85c", "#f0ad4e"];

            $(".container-seasonal-profile").resize(function (e) {

                $timeout(function () {
                    var tempScrollTop = $(window).scrollTop();
                    scope.bindseasonal();
                    $(window).scrollTop(tempScrollTop);
                }, 1000);
            });
            scope.enableZone = true;
            scope.bindseasonal = function () {

                if (scope.datasource.length <= 0)
                    return;

                var seriesList = [];
                var categories = [];
                var maxY = [];

                angular.forEach(scope.zones, function (zone) {
                    var series = { name: zone.Name, data: [], selectedWeek: null, enabled: true, selectedWeekObj: null };
                    if (zone.WeekNum != null && zone.WeekNum !== undefined) {
                        series.selectedWeek = zone.WeekNum;
                    }
                    else {
                        series.enabled = false;
                    }

                    if (typeof scope.season !== 'undefined') {
                        angular.forEach(scope.season.SeasonTime, function (time) {
                            if (time.WeekCode === zone.SelectedWeekCode) {
                                series.selectedWeekObj = time;
                            }
                        });
                    }

                    angular.forEach(scope.datasource, function (item) {

                        if (categories.indexOf(item.WeekNum) < 0) {
                            categories.push(item.WeekNum);
                        }

                        if (item.ZoneName === zone.Name) {
                            //series.data.push(item.SeasonalProfile);
                            series.data.push({
                                SP: item.SeasonalProfile,
                                WK: item.WeekNum,
                                SPQ: item.SeasonalProfileQtr,
                                Location: item.ZoneName,
                                ValidWeek: false
                            });
                        }
                    });

                    series.data = series.data.sort(function (a, b) {
                        return a.WK - b.WK;
                    });

                    maxY.push(d3.max(series.data, function (d) { return d.SP; }));

                    seriesList.push(series);
                });

                categories = categories.sort(function (a, b) {
                    return a - b;
                });

                maxY = maxY.sort(function (a, b) {
                    return b - a;
                });

                function InitChart() {

                    $(".tooltips").remove();

                    d3.select("#visualisation").selectAll("svg > *").remove();

                    var color = function (index) {
                        if (index <= 3) {
                            return colors[index];
                        }
                        var i = Math.floor((Math.random() * 3) + 1);
                        return colors[i];
                    } //d3.scale.category10();

                    var containerWidth = $(".container-seasonal-profile").width();
                    if (containerWidth <= 0) {
                        containerWidth = 350;
                    }

                    var vis = d3.select("#visualisation"),
                        WIDTH = containerWidth,
                        HEIGHT = 150,
                        MARGINS = {
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 50
                        },

                        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([1, 52]),

                        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, maxY.length > 0 ? maxY[0].toFixed(2) : 2]),

                        xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")

                    yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left").ticks(6);

                    vis.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);

                    vis.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                        .call(yAxis);

                    var lineGen = d3.svg.line()
                        .x(function (d) {
                            return xScale(d.WK);
                        })
                        .y(function (d) {
                            return yScale(d.SP);
                        })
                        .interpolate("basis");

                    function getPathData(data, weekfrom, weekto) {
                        var dataToReturn = [];
                        if (weekfrom > 0)
                            weekfrom = (weekfrom - 1);
                        if (weekto > 0)
                            weekto = (weekto - 1);
                        for (var index = weekfrom; index <= weekto; index++) {
                            dataToReturn.push(data[index]);
                        }
                        return dataToReturn;
                    }

                    var yearSpan = false;

                    angular.forEach(seriesList, function (item, index) {

                        var weekFrom = parseInt(scope.weekfrom);
                        var weekTo = parseInt(scope.weekto);
                        var zoneWeek = null;
                        var firstPath = { bold: false, data: [] };
                        var secondPath = { bold: true, data: [] };
                        var thirdPath = { bold: false, data: [] };
                        var yearMatch = false;
                        if (item.selectedWeek != null) {
                            weekFrom = parseInt(item.selectedWeek);
                        }
                        if (typeof item.selectedWeekObj !== 'undefined') {
                            zoneWeek = item.selectedWeekObj;
                        }


                        angular.forEach(item.data, function (seriesData) {
                            var validWeek = false;

                            if (zoneWeek != null && parseInt(zoneWeek.Year) == parseInt(scope.endweek.Year)) {
                                if (seriesData.WK >= weekFrom && seriesData.WK <= weekTo) {
                                    validWeek = true;
                                }
                            }
                            else if (scope.startweek !== undefined && scope.endweek !== undefined
                              && parseInt(scope.startweek.Year) != parseInt(scope.endweek.Year)) {

                                if (seriesData.WK >= weekFrom || seriesData.WK <= weekTo) {
                                    validWeek = true;
                                }
                            }
                            else if (seriesData.WK >= weekFrom && seriesData.WK <= weekTo) {
                                validWeek = true;
                            }

                            seriesData.ValidWeek = validWeek;
                        });

                        if (weekFrom >= 0 && weekTo > 0) {

                            //If we have cross year span. e.g 2016WK40 -> 2017WK10
                            if (scope.startweek !== undefined && scope.endweek !== undefined
                                && parseInt(scope.startweek.Year) != parseInt(scope.endweek.Year)) {
                                yearSpan = true;
                                if (scope.enableZone && zoneWeek != null && parseInt(zoneWeek.Year) == parseInt(scope.endweek.Year)) {
                                    yearMatch = true;

                                    firstPath.data = getPathData(item.data, 0, weekFrom);
                                    secondPath.data = getPathData(item.data, weekFrom, weekTo);
                                    thirdPath.data = getPathData(item.data, weekTo, item.data.length - 1);
                                }
                                else {
                                    firstPath.data = getPathData(item.data, weekFrom, item.data.length - 1);
                                    secondPath.data = getPathData(item.data, 0, weekTo);
                                    thirdPath.data = getPathData(item.data, weekTo, weekFrom);
                                }
                            }
                            else {
                                firstPath.data = getPathData(item.data, 0, weekFrom);
                                secondPath.data = getPathData(item.data, weekFrom, weekTo);
                                thirdPath.data = getPathData(item.data, weekTo, item.data.length - 1);
                            }
                        }
                        else {
                            firstPath.data = item.data;
                        }

                        vis.append('svg:path')
                            .attr("pathname", item.name)
                            .attr('d', lineGen(firstPath.data))
                            .attr('stroke', color(index))
                            .attr('stroke-width', (item.enabled && yearSpan && !yearMatch) ? 5 : 2)
                            .attr('fill', 'none');

                        createCirlces(firstPath.data, vis, index, item.name, weekFrom, weekTo);

                        if (secondPath.data.length > 0) {
                            vis.append('svg:path')
                                .attr("pathname", item.name)
                               .attr('d', lineGen(secondPath.data))
                               .attr('stroke', color(index))
                               .attr('stroke-width', (item.enabled) ? 5 : 2)
                               .attr('fill', 'none');

                            createCirlces(secondPath.data, vis, index, item.name, weekFrom, weekTo);
                        }

                        if (thirdPath.data.length > 0) {
                            vis.append('svg:path')
                                .attr("pathname", item.name)
                               .attr('d', lineGen(thirdPath.data))
                               .attr('stroke', color(index))
                               .attr('stroke-width', 2)
                               .attr('fill', 'none');

                            createCirlces(thirdPath.data, vis, index, item.name, weekFrom, weekTo);
                        }
                    });

                    var div;

                    var circlemouseover = function (__this, d, weekFrom, weekTo) {
                        var currentCircle = d3.select(__this);

                        div = d3.select("body")
                              .append("div")  // declare the tooltip div 
                              .attr("class", "tooltip tooltips")
                              .style("opacity", 0);

                        currentCircle.attr("stroke-width", 10)
                               .attr("stroke-opacity", 0.6);

                        var border = currentCircle.attr('fill');

                        div.style("opacity", .9);

                        div.html(
                            '<span style="text-align:left;">FW: ' + d.WK + '<br/>Location Zone : '
                            + d.Location + '<br/>Avg. Seasonal Profile : ' + d.SP.toFixed(2) + '' +
                            '<br/>Valid Week : ' + d.ValidWeek + '</span>')
                            .style("left", (d3.event.pageX - 91) + "px")
                            .style("top", (d3.event.pageY - 115) + "px")
                            .style('background', 'none repeat scroll 0 0 #ffffff')
                        .style('border', '1px solid ' + border + '')
                        .style("display", 'block');
                    };

                    var circlemouseout = function (__this) {
                        d3.select(__this)
                                   .attr("stroke-width", 1)
                                    .attr("stroke", d3.select(__this).attr("stroke"))
                                    .attr("fill", d3.select(__this).attr("stroke"))
                                      .attr("opacity", "0.5");

                        div.style("display", 'none');
                        div.remove();
                    };

                    function createCirlces(data, vis, index, zonename) {
                        vis.append("g").selectAll("dot")
                         .data(function (d) { return data })
                         .enter()
                         .append("circle")
                         .attr("r", 1)
                         .attr("opacity", 0.5)
                         .attr("circlename", zonename)
                         .attr("cx", function (dd) { return xScale(dd.WK) })
                         .attr("cy", function (dd) { return yScale(dd.SP) })
                         .attr("fill", color(index))
                         .attr("stroke", function (d) { return color(index) })
                         .on("mouseover", function (d) {
                             circlemouseover(this, d);
                         })
                           .on("mouseout", function (d) {
                               circlemouseout(this);
                           });
                    }

                    scope.paths = [];
                    scope.pathnames = [];

                    vis.selectAll("path").each(function (d, i) {
                        var path = d3.select(this);
                        if (path.attr("pathname") !== null
                            && path.attr("pathname") !== "") {
                            var name = path.attr("pathname");
                            if (scope.pathnames.indexOf(name) < 0) {
                                scope.paths.push({
                                    name: name,
                                    color: path.attr("stroke"),
                                    d3Path: path,
                                    active: true
                                });
                                scope.pathnames.push(name);
                            }
                        }
                    });

                    scope.$apply(function () {
                        scope.paths = scope.paths;
                    });

                    scope.HandlePath = function (path, $event) {
                        var active = path.active;
                        var button = angular.element($event.target);
                        if (active) {
                            button.css("background-color", "#eee");
                            button.css("color", "#444");
                            button.css("opacity", "0.5");
                        }
                        else {
                            button.css("background-color", path.color);
                            button.css("color", "#FFFFFF");
                            button.css("opacity", "10");
                        }

                        vis.selectAll("path").each(function (d, i) {
                            var d3path = d3.select(this);
                            if (d3path.attr("pathname") !== null
                                && d3path.attr("pathname") !== "") {
                                var name = d3path.attr("pathname");
                                if (name !== undefined && name === path.name) {
                                    if (active) {
                                        d3path.attr("stroke-opacity", "0");
                                        //path.active = false;
                                    }
                                    else {
                                        //path.active = true;
                                        d3path.attr("stroke-opacity", "3");
                                    }
                                }
                            }
                        });

                        vis.selectAll("circle").each(function (d, i) {
                            var d3circle = d3.select(this);
                            // d3circle = $(d3circle);
                            if (d3circle.attr("circlename") !== null
                                && d3circle.attr("circlename") !== "") {
                                var cname = d3circle.attr("circlename");
                                if (cname !== undefined && cname === path.name) {
                                    if (active) {
                                        d3circle.attr("stroke-opacity", "0");
                                        d3circle.attr("opacity", "0");
                                        d3circle.on('mouseover', null);
                                        d3circle.on('mouseout', null);
                                    }
                                    else {
                                        d3circle.attr("stroke-opacity", "0.5");
                                        d3circle.attr("opacity", "0.5");

                                        d3circle.on('mouseover', null);
                                        d3circle.on('mouseout', null);

                                        d3circle.on("mouseover", function (d) {
                                            circlemouseover(this, d);
                                        }).on("mouseout", function (d) {
                                            circlemouseout(this);
                                        });
                                        //d3circle.attr("stroke-width", "0");
                                    }
                                }
                            }
                        });
                        path.active = !active;
                        //d3.select(path.d3Path).attr("stroke-opacity", "3");
                    }
                }

                InitChart();
            }

            scope.$watch('watchfor', function (val) {
                var time = setTimeout(function () {
                    if (val === "true") {
                        var tempScrollTop = $(window).scrollTop();
                        scope.bindseasonal();
                        $(window).scrollTop(tempScrollTop);
                    }
                    clearTimeout(time);
                }, 500);
            });

            //Fired when we change zone
            scope.$watch('zonechange', function (val) {
                var time = setTimeout(function () {
                    //     if (val === "true") {
                    var tempScrollTop = $(window).scrollTop();
                    scope.bindseasonal();
                    $(window).scrollTop(tempScrollTop);
                    //   }
                    clearTimeout(time);
                }, 500);
            });

            scope.$watch('weekfrom', function (val) {
                var time = setTimeout(function () {
                    //if (parseInt(scope.weekto) <= 0 && parseInt(scope.weekto) < parseInt(scope.weekfrom))
                    //  return;

                    var tempScrollTop = $(window).scrollTop();
                    scope.bindseasonal();
                    $(window).scrollTop(tempScrollTop);
                    clearTimeout(time);
                }, 500);
            });

            scope.$watch('weekto', function (val) {
                var time = setTimeout(function () {
                    var tempScrollTop = $(window).scrollTop();
                    scope.bindseasonal();
                    $(window).scrollTop(tempScrollTop);
                    clearTimeout(time);
                }, 500);
            });
        }
    };

}]);