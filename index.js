module.exports = function(kibana){
	return new kibana.Plugin({
		name: 'kbn_heatmap_vis',
		require: ['kibana', 'elasticsearch'],
		uiExports: {
			visTypes: [
				'plugins/kbn_heatmap_vis/kbn_heatmap_vis'
				]
		}
	});
};