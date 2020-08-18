// create function for plots
function createPlots(month) {
    // getting data from the csvfile
    d3.csv("top_queries.csv").then((data)=> {
        console.log(data)
        
        // filter sample values by month 
        var monthly = data.month.filter(s => s.month === month)[0];
        console.log(monthly);
      
        // The bubble chart
        var trace1 = {
            x: monthly.keywords,
            y: monthly.avg_rank,
            mode: "markers",
            marker: {
                size: monthly.avg_rank,
                color: monthly.keywords
            },
            text: monthly.month
  
        };
  
        // set the layout for the bubble plot
        var layout_b = {
            xaxis:{title: "Average Google Search Ranking"},
            height: 600,
            width: 1000
        };
  
        // creating data variable 
        var data1 = [trace1];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
      });
  }  
// create the function to get the necessary data
function getInfo(month) {
    // read the csvfile to get data
    d3.csv("top_queries.csv").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        // console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.month === month)[0];

        // select demographic panel to put data
        var rankInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new month info
        rankInfo.html("");

        // grab the necessary demographic data data for the month and append the info to the panel
        Object.entries(result).forEach((key) => {   
                rankInfo.append("h5").text(key[0] + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(month) {
    createPlots(month);
    getInfo(month);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.csv("top_queries.csv").then((data)=> {
        // console.log(data)

        // get the month data to the dropdwown menu
        data.month.forEach(function(month) {
            dropdown.append("option").text(month).property("value");
        });

        // call the functions to display the data and the plots to the page
        createPlots(data.month[0]);
        getInfo(data.month[0]);
    });
}

init();
