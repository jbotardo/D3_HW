

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // data route
  var url = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function (sample) {


    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = panel.append("p");
      row.text(`${key}: ${value}`);
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  var url = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function (d) {


    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: d.otu_ids,
      y: d.sample_values,
      mode: 'markers',
      text: d.otu_labels,
      marker: {
        color: d.otu_ids,
        size: d.sample_values
      }
    };

    var data = [trace1];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1500
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data2 = [{
      values: d.sample_values.slice(0, 10),
      labels: d.otu_ids.slice(0, 10),
      text: d.otu_labels.slice(0, 10),
      type: 'pie'
    }];

    var layout = {
      showlegend: true,
    };

    Plotly.newPlot('pie', data2, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
