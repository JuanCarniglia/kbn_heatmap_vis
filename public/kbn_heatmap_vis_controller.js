define(function (require) {

    var module = require('ui/modules').get('kibana/kbn_heatmap_vis', ['kibana']);

    var d3 = require('d3');
    var _ = require('lodash');
    var $ = require('jquery');

    module.controller('KbnHeatmapVisController',
        function ($scope, $element, $rootScope, Private) {

            var heatmapAggResponse = Private(require('./lib/agg_response'));

	        var svgRoot = $element[0];
			var margin = 50;
			var width = 700;
			var height = 500;

			var color = d3.scale.category20c();

            var rect = null;

			var itemSize = 10,
			cellSize = itemSize-1,
			margin = {top:50,right:50,bottom:50,left:55};

		  //formats
		  var hourFormat = d3.time.format('%H'),
			dayFormat = d3.time.format('%j'),
			timeFormat = d3.time.format('%Y-%m-%dT%X'),
			monthDayFormat = d3.time.format('%m.%d');

		  //data vars for rendering
		  var dateExtent = null,
			data = null,
			dayOffset = 0,
			colorCalibration = ['#f6faaa','#FEE08B','#FDAE61','#F46D43','#D53E4F','#9E0142'],
			dailyValueExtent = {};

		  //axises and scales
		  var axisWidth = 0 ,
			axisHeight = itemSize*24,
			xAxisScale = d3.time.scale(),
			xAxis = d3.svg.axis()
			  .orient('top')
			  .ticks(d3.time.days,3)
			  .tickFormat(monthDayFormat),
			yAxisScale = d3.scale.linear()
			  .range([0,axisHeight])
			  .domain([0,24]),
			yAxis = d3.svg.axis()
			  .orient('left')
			  .ticks(12)
			  .tickFormat(d3.format('02d'))
			  .scale(yAxisScale);


            var node, root;


	        var _buildVis = function _buildVis(root) {

                initCalibration();

                // Some legends and descriptions
                d3.select('[role="lessLabel"]').value($scope.vis.params.lessLabel);
                d3.select('[role="moreLabel"]').value($scope.vis.params.moreLabel);

                if (!$scope.vis.params.showCalibration) {
                    d3.select('[role="calibration"]').style({'display': 'none'});
                } else d3.select('[role="calibration"]').style({'display': ''});

                if (!$scope.vis.params.showDescription) {
                    d3.select('[role="description"]').style({'display': 'none'});
                } else d3.select('[role="description"]').style({'display': ''});


                var svg = d3.select('[role="heatmap"]');

                data = root;

                var heatmap = svg
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('width', width - margin.left - margin.right)
                    .attr('height', height - margin.top - margin.bottom)
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var rect = null;

                data.forEach(function (valueObj) {
	                valueObj['date'] = timeFormat.parse(valueObj['timestamp']);
	                var day = valueObj['day'] = monthDayFormat(valueObj['date']);

	                var dayData = dailyValueExtent[day] = dailyValueExtent[day] || [1000, -1];
	                var pmValue = valueObj['value']['value'];
	                dayData[0] = d3.min([dayData[0], pmValue]);
	                dayData[1] = d3.max([dayData[1], pmValue]);
	            });

	            dateExtent = d3.extent(data, function (d) {
	                return d.date;
	            });

	            axisWidth = itemSize * (dayFormat(dateExtent[1]) - dayFormat(dateExtent[0]) + 1);

				//render axises
				xAxis.scale(xAxisScale.range([0,axisWidth]).domain([dateExtent[0],dateExtent[1]]));

				svg.append('g')
				  .attr('transform','translate('+margin.left+','+margin.top+')')
				  .attr('class','x axis')
				  .call(xAxis)
				.append('text')
				  .text($scope.vis.params.xAxisLabel)
				  .attr('transform','translate('+axisWidth+',-20)');

	            svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .attr('class', 'y axis')
                    .call(yAxis)
                    .append('text')
                        .text($scope.vis.params.yAxisLabel)
                        .attr('transform', 'translate(-30,' + axisHeight + ') rotate(-90)');

				//render heatmap rects
				dayOffset = dayFormat(dateExtent[0]);
				rect = heatmap.selectAll('rect')
					.data(data)
					.enter().append('rect')
					  .attr('width',cellSize)
					  .attr('height',cellSize)
					  .attr('x',function(d){
							return itemSize*(dayFormat(d.date)-dayOffset);
						})
					.attr('y',function(d){
						return hourFormat(d.date)*itemSize;
						})
					.attr('fill','#ffffff');


	            rect.filter(function (d) {
	                return d.value['value'] > 0;
	            }).append('title').text(function (d) {
	                return monthDayFormat(d.date) + ' ' + d.value['value'];
	            });

                var renderByCount = true;

				rect.filter(function (d) {
					return d.value['value'] >= 0;
				}).transition().delay(function (d) {
					return (dayFormat(d.date) - dayOffset) * 15;
				}).duration(500).attrTween('fill', function (d, i, a) {
					//choose color dynamicly
					var colorIndex = d3.scale.quantize().range([0, 1, 2, 3, 4, 5]).domain(renderByCount ? [0, 500] : dailyValueExtent[d.day]);

					return d3.interpolate(a, colorCalibration[colorIndex(d.value['value'])]);
				});



	        };



			function initCalibration() {

                var svgCalibration = d3.select('[role="calibration"]');

				svgCalibration.select('svg')
                    .selectAll('rect')
                    .data(colorCalibration)
                    .enter()
                    .append('rect')
                    .attr('width', cellSize)
                    .attr('height', cellSize)
                    .attr('x', function (d, i) {
                        return i * itemSize;
		            })
                    .attr('fill', function (d) {
			            return d;
		            });
			};

			var _render = function _render(data) {
				d3.select('[role="heatmap"]').selectAll('g').remove();
				_buildVis(data.data);
			};

			$scope.$watch('esResponse', function (resp) {
				if (resp) {
					var chartData = heatmapAggResponse($scope.vis, resp);
					_render(chartData);
				}
			});
        });
    });
