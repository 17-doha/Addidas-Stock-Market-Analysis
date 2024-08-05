//This function rtrieve the data from a point and parsed as json file
function fetchDataAndUpdateChart()
{
    fetch('/get-data')
    .then(response => response.json())
    .then(data => {
        updateChart(data);
    })
    .catch(error => console.error('Error:', error));
}


//updates a chart with the recieved data
function updateChart(data)
{


  am5.ready(function() {


    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      paddingLeft: 0,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        fontSize: "1.5em"
      })
    );

    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true
    })
    
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "Method",
      renderer: xRenderer,
      fontSize: "1.5em",
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    xRenderer.grid.template.setAll({
      location: 1,
      fill: am5.color("#000000"),
      fontSize: "1.5em"
    })
    
    xAxis.data.setAll(data);
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));
    
    xRenderer.labels.template.setAll({
        
      fill: am5.color("#000000"),
      fontSize: "1.5em"

    });
    let yRenderer = yAxis.get("renderer");
    yRenderer.labels.template.setAll({
        
      fill: am5.color("#000000"),
      fontSize: "1.5em"

    });
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "Method"
      }));
    
      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0
      });
    
      series.data.setAll(data);
    
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();
    
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

    
      legend.data.push(series);
    }
    
    makeSeries("Foot Locker", "Foot Locker");
    makeSeries("Walmart", "Walmart");
    makeSeries("Sports Direct", "Sports Direct");
    makeSeries("West Gear", "West Gear");
    makeSeries("Kohl's", "Kohl's");
    makeSeries("Amazon", "Amazon");
    var titleLabel = am5.Label.new(root, {
      text: "Profit of Each Retailer for Each Sales Method",
      fontSize: 30,
      fontWeight: "500",
      marginBottom: 100,
      
      centerX: am5.percent(-135),
      centerY: am5.percent(26),

      fontFamily: "Courier New, Courier, monospace",
      fill: am5.color("#000000") 
    });

    titleLabel.set("y", 0);
    chart.children.unshift(titleLabel);
    
    legend.labels.template.set("fill", am5.color("#000000"));
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    
    }); // end am5.ready()
    
    
}
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart();
});  
//This function retrieves the data from a point and parses it as a JSON file



