# Kibana Heatmap Visualization Plugin

This is a Heatmap diagram visType for Kibana, version 4.4.1.

This plugin is based on the exceptional D3 library,
by @mbostock [D3 Gallery](https://github.com/mbostock/d3/wiki/Gallery) (Thanks!).

If you really liked this and feel like making a donation : <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=juan.carniglia@gmail.com&lc=AR&item_name=JuanCarniglia&item_number=1000&currency_code=USD&bn=PP-DonationsBF:btn_donate_LG.gif:NonHosted">
<img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" alt="Contribute!" />
</a>

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
{ "data" : [
  { "timestamp" : "2016-03-01T09:00:00", "value" : { "value" : "1000" }},
  { "timestamp" : "2016-03-01T10:00:00", "value" : { "value" : "1000" }},
  { "timestamp" : "2016-03-01T11:00:00", "value" : { "value" : "1000" }},
  { "timestamp" : "2016-03-01T12:00:00", "value" : { "value" : "1000" }},
  { "timestamp" : "2016-03-01T13:00:00", "value" : { "value" : "1000" }},
  { "timestamp" : "2016-03-01T14:00:00", "value" : { "value" : "1000" }},
  { "timestamp" : "2016-03-01T15:00:00", "value" : { "value" : "1000" }}
  ]
}
```

This visualization displays a grid whith columns for days and rows for hours. Each square is then fill
with a different color, depending on the document count for that particular date/hour.

Still there is some work to do, but I'll get to it soon.

