//This function rtrieve the data from a point and parsed as json file
function fetchDataAndUpdateNew()
{
    fetch('/get-new')
    .then(response => response.json())
    .then(data => {
        updatenew(data);
    })
    .catch(error => console.error('Error:', error));
}


//updates a chart with the recieved data
function updatenew(data_new)
{


  am5.ready(function() {

      // Create root
      var root = am5.Root.new("newdiv"); 
      
      // Set themes
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      
      // Create chart
      var chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "none",
        projection: am5map.geoAlbersUsa(),
        layout: root.horizontalLayout
      }));
      
      // Create polygon series
      var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_usaLow,
        valueField: "value",
        calculateAggregates: true
      }));
      
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}: {value}"
      });
      
      polygonSeries.set("heatRules", [{
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0x4f3f87),
        max: am5.color(0x24094B),
        key: "fill"
      }]);
      
      polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
        heatLegend.showValue(ev.target.dataItem.get("value"));
      });

      polygonSeries.data.setAll(data_new);



      
      var heatLegend = chart.children.push(am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color(0x4f3f87),
        endColor: am5.color(0x24094B),
        startText: "Lowest",
        endText: "Highest",
        stepCount: 5
      }));
      
      heatLegend.startLabel.setAll({
        fontSize: 12,
      
        fill: heatLegend.get("startColor")
      });
      
      heatLegend.endLabel.setAll({
        fontSize: 12,

        fill: heatLegend.get("endColor")
      });

      
      // change this to template when possible
      polygonSeries.events.on("datavalidated", function () {
        heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
        heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
      });
      // var titleLabel = am5.Label.new(root, {
      //   text: "Total Sales of Each State in US",
      //   fontSize: 30,
      //   fontWeight: "500",
      //   textAlign: "center",
      //   x: am5.percent(50),
      //   centerX: am5.percent(50),
      //   paddingTop: 0,
      //   paddingBottom: 0,
      //   fill: am5.color("#000000") 
      // });
  
  
      // titleLabel.set("y", -10);
      // chart.children.unshift(titleLabel);

      }); // end am5.ready()
    

        
   
    
    
}
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateNew();
});  
//This function retrieves the data from a point and parses it as a JSON file



