function fetchDataAndUpdateLine() {
  fetch('/get-line')
    .then(response => response.json())
    .then(data3 => {
      // Convert 'Month-Year' to timestamp in milliseconds
      data3.forEach(item => {
        let [year, month] = item['Month-Year'].split('-');
        item['Month-Year'] = new Date(`${year}-${month}-01`).getTime(); // Convert to timestamp
      });
      updateLine(data3);
    })
    .catch(error => console.error('Error:', error));
}

function updateLine(data3) {
  am5.ready(function() {
    console.log(data3);

    var root = am5.Root.new("scatterdiv");
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
        timeUnit: "month",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, { fill: am5.color("#024094B") })
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom",
      })
    }));

    // Define and configure the renderers for axes
    var xRenderer = xAxis.get("renderer");
    var yRenderer = yAxis.get("renderer");

    // Configure Y-axis renderer
    yRenderer.grid.template.setAll({
      location: 1
    });
    yRenderer.labels.template.setAll({
      fill: am5.color("#000000"),
      fontSize: 30
    });

    // Configure X-axis renderer
    xRenderer.labels.template.setAll({
      fill: am5.color("#000000"),
      fontSize: 30
    });

    // Add main series
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Operating Profit",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "Operating Profit",
      valueXField: "Month-Year",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      }),
      strokeWidth: 2, // Adjusted thickness for visibility
      stroke: am5.color(0x24094B), // Line color
    }));

    // Add axis range to highlight 2022
    var rangeDataItem = xAxis.makeDataItem({
      value: new Date(2022, 0, 1).getTime(),
      endValue: new Date(2022, 11, 31).getTime(),
    });

    var range = xAxis.createAxisRange(rangeDataItem);

    rangeDataItem.get("axisFill").setAll({
      fill: am5.color(0x9d79b5),
      fillOpacity: 0.2,
      visible: true
    });

    rangeDataItem.get("label").setAll({
      text: "Predicted Data (2022)",
      inside: true,
      rotation: 90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 10,
      fontSize: 30,
      fill: am5.color(0x000000)
    });

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
  fetchDataAndUpdateLine();
});
