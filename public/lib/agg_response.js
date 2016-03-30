
define(function (require) {
  return function boxplotProvider(Private, Notifier) {
    var _ = require('lodash');
    var arrayToLinkedList = require('ui/agg_response/hierarchical/_array_to_linked_list');

    var notify = new Notifier({
      location: 'Boxplot chart response converter'
    });

    var nodes = [];

    return function (vis, resp) {

        var metric = vis.aggs.bySchemaGroup.metrics[0];
        var children = vis.aggs.bySchemaGroup.buckets;
        children = arrayToLinkedList(children);

        var firstAgg = children[0];
        var aggData = resp.aggregations[firstAgg.id];

        var max_value = 0;
		var min_value = 0;
		var bool_first = true;

        nodes = [];

        _.each(aggData.buckets, function (d, i) {

            var min = 0;
            var max = 0;

            if (d[vis.aggs.byTypeName["max"][0].id].value >= d[vis.aggs.byTypeName["min"][0].id].value) {
                min = d[vis.aggs.byTypeName["min"][0].id].value;
                max = d[vis.aggs.byTypeName["max"][0].id].value;
            } else {
                min = d[vis.aggs.byTypeName["max"][0].id].value;
                max = d[vis.aggs.byTypeName["min"][0].id].value;
            }

            if (bool_first) {
				max_value = max;
				min_value = min;
				bool_first = false;
			}
			else {
				if (min < min_value) min_value = min;
				if (max > max_value) max_value = max;
			}

            nodes.push({ 'bucket': d.key, 'doc_count': d.doc_count, 'mean' : d[vis.aggs.byTypeName["avg"][0].id].value, 'min': min, 'max': max, 'percentiles': d[vis.aggs.byTypeName["percentiles"][0].id].values });
        });

        var chart = {
            'max_value' : max_value,
			'min_value' : min_value,
            'data': nodes
        };


      return chart;
    };
  };
});
