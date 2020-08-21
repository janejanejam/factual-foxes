// create function for plots
function createPlots(month) {
   
    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

  
    svg.append("text")
        .attr("x", 100)   
        .attr("y", 20 )
        .attr("dy", "3.5em" )
        .attr("text-anchor", "start")  
        .style("font-size", "28px")  
        .style("font-weight", "bold")

    var pack = d3.pack()
        .size([width-150, height])
        .padding(1.5);

    d3.csv("top_queries.csv").then((data)=> {
        // console.log(data)

        // filter sample values by month 
        var monthly = data.filter(s => s.month === month);
        // console.log(monthly)

        monthly.avg_rank = +data["avg_rank"];
        monthly.keywords = data["keywords"];

        var color = d3.scaleOrdinal()
            .domain(monthly.map(function(d){ return d.keywords;}))
            .range(['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6',
            '#ffe9a8','#b9bfe3','#fddaec','#cccccc']);
    
        var root = d3.hierarchy({children: monthly})
            .sum(function(d) { return d.avg_rank; })
            .sort(function (a, b) {
                return b.avg_rank-a.avg_rank
            })
            console.log(root.links());

        var selection = svg.selectAll(".node")
            .data(pack(root).leaves());

        var node = selection.enter().append("g")
            .merge(selection)
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        selection.exit().remove();
    
        node.append("circle")
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.data.keywords); })
            .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);	
                
        var duration = 300;

        monthly.forEach(function(d, i) {
            // console.log(d.avg_rank);
            node.transition().duration(duration).delay(i * duration)
            .attr("r", d.avg_rank);
        });
        
        
        div.html(d.data.keywords + ": <br>"+d.data.avg_rank  )	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY) + "px");	
        })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
        });

        node.append("text")
            .text(function(d) { return d.data.keywords });
                // if (d.data.avg_rank > 748|| d.data.keywords == "Other" || d.data.keywords == "Fire"){
                
        
            // return "";});
    
        var selectionLegend = svg.selectAll(".legend")
            .data(monthly);

        var legend = selectionLegend.enter().append("g")
            .merge(selectionLegend)
            .attr("class","legend")
            .attr("transform", "translate(" + 780 + "," + 120+ ")")
            .html('');

        legend.append("rect")
            .attr("x", 0) 
            .attr("y", function(d, i) { return 20 * i; })
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", function(d) { return color(d.keywords)});
        
        legend.append("text")
            .attr("x", 25) 
            .attr("text-anchor", "start")
            .attr("dy", "1em") 
            .attr("y", function(d, i) { return 20 * i; })
            .text(function(d) {return d.keywords;})
            .attr("font-size", "12px"); 
        
        legend.append("text")
            .attr("x",31) 
            .attr("dy", "-.2em")
            .attr("y",-10)
            .text("Search Query")
            .attr("font-size", "17px"); 

        // selectionLegend.exit().remove();


    });

};

// create the function for the change event
function optionChanged(month) {
    createPlots(month);
}
// function optionChanged(month) {
//     ( "#selDataset" ).on("change", function() {
//         createPlots(month);
//     });
// };

// create the function for the initial data rendering
function init(i=0) {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.csv("top_queries.csv").then((data)=> {
        // console.log(data)
        
        //map to over data to get months out
        months = data.map(record => record.month)
        // console.log(months)

        //filter months to unique values
        unique_months = months.filter((value, index, array) => array.indexOf(value) === index)
        // console.log(unique_months)

        // get the month data to the dropdwown menu
        unique_months.forEach(function(month) {
            // month = record.month
            // console.log(month)
            dropdown.append("option").text(month).property("value");
        });

        // call the functions to display the data and the plots to the page
        createPlots(unique_months[i]);
    });
};

init();