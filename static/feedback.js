//This function rtrieve the data from a point and parsed as json file
function fetchDataAndUpdatefeedback()
{
    fetch('/get-feedback')
    .then(response => response.json())
    .then(data => {
        updatefeedback(data);
    })
    .catch(error => console.error('Error:', error));
}
function updateproduct(data)
{
am5.ready(function(data) {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("feedbackdiv");
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX"
    }));
    
    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    var xRenderer = am5radar.AxisRendererCircular.new(root, {});
    xRenderer.labels.template.setAll({
      radius: 10
    });
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "category",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      max: 10,
      renderer: am5radar.AxisRendererRadial.new(root, {
        minGridDistance: 20
      })
    }));
    
    yAxis.get("renderer").labels.template.set("forceHidden", true);
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "category"
    }));
    
    series.columns.template.setAll({
      tooltipText: "{categoryX}: {valueY}",
      templateField: "columnSettings",
      strokeOpacity: 0,
      width: am5.p100
    });
    
    // Set data
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
    var data = [{
      category: "Health",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }, {
      category: "Career",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
                }
    }, {
      category: "Love",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }, {
      category: "Spirituality",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }, {
      category: "Family",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }, {
      category: "Money",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }, {
      category: "Fun",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }, {
      category: "Friends",
      value: 0,
      columnSettings: {
        fill: chart.get("colors").next()
      }
    }];
    
    series.data.setAll(data);
    xAxis.data.setAll(data);
    
    // Animate chart
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    series.appear(1000);
    chart.appear(1000, 100);
    
    // Function for updating value
    function setValue(index, value) {
      
      // Set value
      var row = data[index];
      row.value = value;
      console.log(row)
      series.data.setIndex(index, {
        category: row.category,
        value: value,
        columnSettings: row.columnSettings
      });
      
      // Reveal next question
      var areas = document.getElementsByClassName("area");
      for(var i = 0; i < areas.length; i++) {
        areas[i].style.display = (index + 1) === i ? "block" : "none";
      }
      
    }
    
    }); // end am5.ready()
}
    document.addEventListener('DOMContentLoaded', function() {
        fetchDataAndUpdatefeedback();
    }); 