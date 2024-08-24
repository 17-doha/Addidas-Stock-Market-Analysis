//This function rtrieve the data from a point and parsed as json file
function fetchDataAndUpdatePie()
{
    fetch('/get-pie')
    .then(response => response.json())
    .then(data => {
        updatePie(data);
    })
    .catch(error => console.error('Error:', error));
}


//updates a chart with the recieved data
function updatePie(data_pie)
{


 
    
    am5.ready(function() {

      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var root = am5.Root.new("piediv");
      
      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      
      // Create chart
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
      var chart = root.container.children.push(am5percent.PieChart.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50),
        layout: root.horizontalLayout
      }));
      
      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      var series = chart.series.push(am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "value",
        categoryField: "class"
      }));
      
      // Set data
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
      series.data.setAll(data_pie);
      
      // Disabling labels and ticks
      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);
      
      // Adding gradients
      series.slices.template.set("strokeOpacity", 0);
      series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
        stops: [{
          brighten: -0.8
        }, {
          brighten: -0.8
        }, {
          brighten: -0.5
        }, {
          brighten: 0
        }, {
          brighten: -0.5
        }]
      }));
      
      // Create legend
      // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
      var legend = chart.children.push(am5.Legend.new(root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        layout: root.verticalLayout
      }));
      // set value labels align to right
      legend.valueLabels.template.setAll({ 
        textAlign: "right",
         fill: am5.color("#000000"),
         fontSize: 40
         })
      // set width and max width of labels
      legend.labels.template.setAll({ 
        maxWidth: 1500,
        width: 700,
        fontSize: 40,
        fill: am5.color("#000000") 

      });
      
      legend.data.setAll(series.dataItems);
      
      
      // Play initial series animation
      // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
      series.appear(1000, 100);
     
      
      }); // end am5.ready()
    
}
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdatePie();
});  
//This function retrieves the data from a point and parses it as a JSON file



