//This function rtrieve the data from a point and parsed as json file
function fetchDataAndUpdateScatter()
{
    fetch('/get-scatter')
    .then(response => response.json())
    .then(data => {
        updateScatter(data);
    })
    .catch(error => console.error('Error:', error));
}


//updates a chart with the recieved data
function updateScatter(data_Scatter)
{



  // am5.ready(function() {

  //   // Create root element
  //   // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  //   var root = am5.Root.new("scatterdiv");
    
    
  //   // Set themes
  //   // https://www.amcharts.com/docs/v5/concepts/themes/
  //   root.setThemes([
  //     am5themes_Animated.new(root)
  //   ]);
    
    
  //   // Create chart
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/
  //   var chart = root.container.children.push(am5xy.XYChart.new(root, {
  //     panX: true,
  //     panY: true,
  //     wheelY: "zoomXY",
  //     pinchZoomX:true,
  //     pinchZoomY:true
  //   }));
    
    
  //   // Create axes
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  //   var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  //     renderer: am5xy.AxisRendererX.new(root, {}),
  //     tooltip: am5.Tooltip.new(root, {})
  //   }));
    
  //   xAxis.children.moveValue(am5.Label.new(root, {
  //     text: "Sales",
  //     x: am5.p50,
  //     centerX: am5.p50
  //   }), xAxis.children.length - 1);
    
  //   var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  //     renderer: am5xy.AxisRendererY.new(root, {
  //       inversed: false
  //     }),
  //     tooltip: am5.Tooltip.new(root, {})
  //   }));
    
  //   yAxis.children.moveValue(am5.Label.new(root, {
  //     rotation: -90,
  //     text: "Profit",
  //     y: am5.p50,
  //     centerX: am5.p50
  //   }), 0);
    
    
  //   // Create series
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  //   var series = chart.series.push(am5xy.LineSeries.new(root, {
  //     calculateAggregates: true,
  //     xAxis: xAxis,
  //     yAxis: yAxis,
  //     valueYField: "y",
  //     valueXField: "x",
  //     valueField: "value",
  //     seriesTooltipTarget:"bullet",
  //     tooltip: am5.Tooltip.new(root, {
  //       pointerOrientation: "horizontal",
  //       labelText: "[bold]{title}[/]\nSales: {valueY.formatNumber('#.0')}\nGDP: {valueX.formatNumber('#,###.')}\nProfit: {value.formatNumber('#,###.')}"
  //     })
  //   }));
    
  //   series.strokes.template.set("visible", false);
    
    
  //   // Add bullet
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
  //   var circleTemplate = am5.Template.new({});
  //   circleTemplate.adapters.add("fill", function(fill, target) {
  //     var dataItem = target.dataItem;
  //     if (dataItem) {
  //       return am5.Color.fromString(dataItem.dataContext.color);
  //     }
  //     return fill
  //   });
  //   series.bullets.push(function() {
  //     var bulletCircle = am5.Circle.new(root, {
  //       radius: 5,
  //       fill: series.get("fill"),
  //       fillOpacity: 0.8
  //     }, circleTemplate);
  //     return am5.Bullet.new(root, {
  //       sprite: bulletCircle
  //     });
  //   });
    
    
  //   // Add heat rule
  //   // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
  //   series.set("heatRules", [{
  //     target: circleTemplate,
  //     min: 3,
  //     max: 60,
  //     dataField: "value",
  //     key: "radius"
  //   }]);
    
  //   // Set data
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Setting_data
  //   series.data.setAll(data_Scatter);
    
    
  //   // Add cursor
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  //   chart.set("cursor", am5xy.XYCursor.new(root, {
  //     xAxis: xAxis,
  //     yAxis: yAxis,
  //     snapToSeries: [series]
  //   }));
    
    
  //   // Add scrollbars
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  //   chart.set("scrollbarX", am5.Scrollbar.new(root, {
  //     orientation: "horizontal"
  //   }));
    
  //   chart.set("scrollbarY", am5.Scrollbar.new(root, {
  //     orientation: "vertical"
  //   }));
    
    
  //   // Make stuff animate on load
  //   // https://www.amcharts.com/docs/v5/concepts/animations/
  //   series.appear(1000);
  //   chart.appear(1000, 100);
    
  //   }); // end am5.ready()
  am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("scatterdiv");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelY: "zoomXY",
      pinchZoomX:true,
      pinchZoomY:true
    }));
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    xAxis.children.moveValue(am5.Label.new(root, {
      text: "Sales",
      x: am5.p50,
      centerX: am5.p50,
      fill: am5.color("#ffffff"),
      fontSize: "1.5em"
    }), xAxis.children.length - 1);
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        inversed: false
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    yAxis.children.moveValue(am5.Label.new(root, {
      rotation: -90,
      text: "Profit",
      y: am5.p50,
      centerX: am5.p50,
      fill: am5.color("#ffffff"),
      fontSize: "1.5em"

    }), 0);
    let xRenderer = xAxis.get("renderer");
    xRenderer.labels.template.setAll({
        
      fill: am5.color("#ffffff"),
      fontSize: "1.5em"

    });
    let yRenderer = yAxis.get("renderer");
    yRenderer.labels.template.setAll({
        
      fill: am5.color("#ffffff"),
      fontSize: "1.5em"

    });
    
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      calculateAggregates: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "y",
      valueXField: "x",
      valueField: "value",
      seriesTooltipTarget:"bullet",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "[bold]{title}[/]\nProfit: {valueY.formatNumber('#.0')}\n Sales: {valueX.formatNumber('#,###.')}\nUnits Sold: {value.formatNumber('#,###.')}"
      })
    }));
    
    series.strokes.template.set("visible", false);
    
    
    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    var circleTemplate = am5.Template.new({});
    circleTemplate.adapters.add("fill", function(fill, target) {
      var dataItem = target.dataItem;
      if (dataItem) {
        return am5.Color.fromString(dataItem.dataContext.color);
      }
      return fill
    });
    series.bullets.push(function() {
      var bulletCircle = am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill"),
        fillOpacity: 0.8
      }, circleTemplate);
      return am5.Bullet.new(root, {
        sprite: bulletCircle
      });
    });
    
    
    // Add heat rule
    // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
    series.set("heatRules", [{
      target: circleTemplate,
      min: 5,
      max: 16,
      dataField: "value",
      key: "radius"
    }]);
    
    // Set data
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Setting_data
    series.data.setAll(data_Scatter);
    
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      snapToSeries: [series]
    }));
    
    
    // Add scrollbars
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    
    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));

    // var legend = chart.children.push(am5.Legend.new(root, {
    //   centerX: am5.percent(50),
    //   x: am5.percent(50),
    //   marginTop: 15,
    //   marginBottom: 15,
    // }));
    
    // legend.data.setAll();
    var titleLabel = am5.Label.new(root, {
      text: "Sales - Profit Graph",
      fontSize: 30,
      fontWeight: "500",
      marginBottom: 100,
      
      centerX: am5.percent(-140),
      centerY: am5.percent(26),

      fontFamily: "Courier New, Courier, monospace",
      fill: am5.color("#ffffff") 
    });

    titleLabel.set("y", 0);
    chart.children.unshift(titleLabel);
    
    
    // legend.labels.template.set("fill", am5.color("#ffffff"));
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
   
    
    }); // end am5.ready()
    
}
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateScatter();
});  
//This function retrieves the data from a point and parses it as a JSON file



