# WARNING - NOT WORKING - WILL BE IN A WHILE - STAY TUNED

# Kibana Heatmap Visualization Plugin

This is a Heatmap diagram visType for Kibana, version 4.4.1.

This plugin is based on the exceptional D3 library,
by @mbostock [D3 Gallery](https://github.com/mbostock/d3/wiki/Gallery) (Thanks!).

![Screenshot]()

##Installation Steps

(Theses are optional, you can just copy the kbn_heatmap_vis folder into
KIBANA_HOME/src/plugins) and run kibana.

```
git clone https://github.com/JuanCarniglia/kbn_heatmap_vis.git 
cd kbn_heatmap_vis
npm install
npm run build
cp -R build/kbn_heatmap_vis/ KIBANA_HOME/installedPlugins
```

##How does it work

Basically, this plugin takes the information from Elasticsearch, generates a JSON structure, which is:

```json
{}
```
