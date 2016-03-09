define(function (require) {
  return function heatmapProvider(Private, Notifier) {
    var _ = require('lodash');
    var arrayToLinkedList = require('ui/agg_response/hierarchical/_array_to_linked_list');
    var notify = new Notifier({
      location: 'Heatmap chart response converter'
    });

    var nodes = [];

    var bucket_temp = null;
    var bucket_position = 0;

    function processEntryRecursive(data, parent) {

		_.each(data.buckets, function(d, i) {
			nodes.push( { "timestamp" : d.key_as_string.substring(0,19) , "value" : {"PM2.5" : d.doc_count }});
		});

    };

    return function (vis, resp) {

      var metric = vis.aggs.bySchemaGroup.metrics[0];
      var children = vis.aggs.bySchemaGroup.buckets;
      children = arrayToLinkedList(children);

      if (!children)  {
        return { 'children' : { 'children' : null }};
      }

      var firstAgg = children[0];
      var aggData = resp.aggregations[firstAgg.id];

      nodes = [];

      processEntryRecursive(aggData, nodes);

      var chart = {
        'data' : nodes
      };

      return chart;
    };
  };
});
