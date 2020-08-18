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
    });
}

init();
