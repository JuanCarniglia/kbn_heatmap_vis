'use strict';

module.exports = function(kibana){

	return new kibana.Plugin({
		name: 'kbn_boxplot_vis',
		require: ['kibana'],
		uiExports: {
			visTypes: [
				'plugins/kbn_boxplot_vis/kbn_boxplot_vis'
				]
			}
	});
};
