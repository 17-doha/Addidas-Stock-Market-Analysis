//This function rtrieve the data from a point and parsed as json file
function fetchDataAndUpdateProfit()
{
    fetch('/get-profit')
    .then(response => response.json())
    .then(data => {
        updateProfit(data);
    })
    .catch(error => console.error('Error:', error));
}


//updates a chart with the recieved data
function updateProfit(data_profit)
{

    am5.ready(function() {


        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("profitdiv");
        
        
        var myTheme = am5.Theme.new(root);
        
        myTheme.rule("Grid", ["base"]).setAll({
          strokeOpacity: 0.1
        });
        
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root),
          myTheme
        ]);
        
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panY",
          wheelY: "zoomY",
          paddingLeft: 0,
          layout: root.verticalLayout
        }));
        
        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarY", am5.Scrollbar.new(root, {
          orientation: "vertical"
        }));
        
        
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yRenderer = am5xy.AxisRendererY.new(root, {
          
        });
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
          categoryField: "class",
          renderer: yRenderer,
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        yRenderer.grid.template.setAll({
          location: 1
        })
        yRenderer.labels.template.setAll({
          
          fill: am5.color("#000000"),
          fontSize: 30

    
        });
        
        
        yAxis.data.setAll(data_profit);
        
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
          min: 0,
          maxPrecision: 0,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 40,
            strokeOpacity: 0.1
          })
        }));
        let xRenderer = xAxis.get("renderer");
        xRenderer.labels.template.setAll({
          
          fill: am5.color("#000000"),
          fontSize: 20
        });
    
        
        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legend = chart.children.push(am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        }));
        legend.labels.template.setAll({ 
          
          fontSize: 30,
          fill: am5.color("#000000") 
  
        });
        
        
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name, fieldName) {
          var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: name,
            stacked: true,
            xAxis: xAxis,
            yAxis: yAxis,
            baseAxis: yAxis,
            valueXField: fieldName,
            categoryYField: "class"
          }));
        
          series.columns.template.setAll({
            tooltipText: "{name}, {categoryY}: {valueX}",
            tooltipY: am5.percent(90)
          });
          series.data.setAll(data_profit);
        
          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          series.appear();
        
          series.bullets.push(function () {
            return am5.Bullet.new(root, {
              sprite: am5.Label.new(root, {
                text: "{valueX}",
                fill: root.interfaceColors.get("alternativeText"),
                centerY: am5.p50,
                centerX: am5.p50,
                populateText: true
              })
            });
          });
        
          legend.data.push(series);
        }
        
      makeSeries("Northeast", "Northeast");
      makeSeries("South", "South");
      makeSeries("West", "West");
      makeSeries("Midwest", "Midwest");
      makeSeries("Southeast", "Southeast");
        
      legend.labels.template.set("fill", am5.color("#000000"));
      var titleLabel = am5.Label.new(root, {
        text: "The Highest Sales in Each Sales Method in Each Region",
        fontSize: 50,
        fontWeight: "500",
        marginBottom: 100,
        
        centerX: am5.percent(-35),
        centerY: am5.percent(-95),
  
        fontFamily: "Arial, Helvetica, sans-serif",
        fill: am5.color("#000000") 
      });
  
      titleLabel.set("y", 0);
      chart.children.unshift(titleLabel);
     
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        
        }); // end am5.ready()


  
    
}
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateProfit();
});  
//This function retrieves the data from a point and parses it as a JSON file



