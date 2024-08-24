function fetchDataAndUpdateSeason() {
    fetch('/get-Season')
      .then(response => response.json())
      .then(data3 => {

        updateSeason(data3);
      })
      .catch(error => console.error('Error:', error));
  }
  
  
  function updateSeason(data3) {
  
    am5.ready(function() {
      console.log(data3);
  
      var root = am5.Root.new("Seasondiv");
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
  
      // Create chart
      var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0
      }));
  
      // Add cursor
      var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
      }));
      cursor.lineY.set("visible", false);
  
      // Create axes
      var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));
  
      var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom",
        })
      }));
  
      // Add series
      var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Operating Profit",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "Operating Profit",
        valueXField: "Season",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        }),
        strokeWidth: 50, // Set the thickness of the line
        stroke: am5.color(0x24094B), // Line color
      }));
  
      // Add scrollbar
      chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
      }));
  
      // Set data
      series.data.setAll(data3);
  
      // Make stuff animate on load
      series.appear(1000);
      chart.appear(1000, 100);
  
    });
  
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateSeason();
  });
  