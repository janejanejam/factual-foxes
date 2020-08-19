// create function for plots
function createPlots(month) {
    // getting data from the csvfile
    d3.csv("./static/bubble/top_queries.csv").then((data)=> {
        // console.log(data)
        
        // filter sample values by month 
        var monthly = data.filter(s => s.month === month);
        // console.log(monthly);
      
        // The bubble chart
        var trace1 = {
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 3, 4, 5],
            mode: "markers",
            marker: {
                size: monthly.map(m => m.avg_rank * 15),
                // color: monthly.keywords
                // (Math.max(m.avg_rank))
            },
            text: monthly.map(m => m.keywords)
  
        };
  
        // set the layout for the bubble plot
        var layout_b = {
            // xaxis:{title: "Average Google Search Ranking"},
            height: 800,
            width: 1200
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
    // getInfo(month);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.csv("./static/bubble/top_queries.csv").then((data)=> {
        // console.log(data)
        
        //extract unique months


        //map to over data to get months out
        months = data.map(record => record.month)
        // console.log(months)

        //filter months to unique values
        unique_months = months.filter((value, index, array) => array.indexOf(value) === index)
        // console.log(unique_months)

        //append unique months to dropdown


        // get the month data to the dropdwown menu
        unique_months.forEach(function(month) {
            // month = record.month
            // console.log(month)
            dropdown.append("option").text(month).property("value");
        });

        // call the functions to display the data and the plots to the page
        createPlots(unique_months[0]);
    });
}

init();
