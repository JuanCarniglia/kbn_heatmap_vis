define(function (require) {
  require('ui/agg_table');
  require('ui/agg_table/agg_table_group');

  require('plugins/kbn_heatmap_vis/kbn_heatmap_vis.less');
  require('plugins/kbn_heatmap_vis/kbn_heatmap_vis_controller');

  require('ui/registry/vis_types').register(KbnHeatmapVisProvider);

  function KbnHeatmapVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    return new TemplateVisType({
      name: 'kbn_heatmap',
      title: 'Heatmap Diagram',
      icon: 'fa-table',
      description: 'Cool D3 Heatmap',
      template: require('plugins/kbn_heatmap_vis/kbn_heatmap_vis.html'),
      params: {
        defaults: {
          showText: true,
          showValues: true,
          showMetricsAtAllLevels: false
        },
        editor: require('plugins/kbn_heatmap_vis/kbn_heatmap_vis_params.html') /*'<vislib-basic-options></vislib-basic-options>'*/
      },
      hierarchicalData: function (vis) {
        return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Split Size',
          min: 1,
          max: 1,
          defaults: [
            {type: 'count', schema: 'metric'}
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'Time Frame',
          aggFilter: '!geohash_grid',
          min: 0,
          max: 1
        }
      ]),
      requiresSearch: true
    });
  }

  // export the provider so that the visType can be required with Private()
  return KbnHeatmapVisProvider;
});
