//Open variable for trendData to hold data
let trendData;

//Setup chart
const top_n = 12;
const height = 600;
const width = 960;
    
const margin = {
    top: 80,
    right: 0,
    bottom: 5,
    left: 0
};

let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

//Setup tick duration
const tickDuration = 450;

//Create svg wrapper to append into to hold chart  
const svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 600);

//Create title and caption
let title = svg.append('text')
    .attr('class', 'title')
    .attr('y', 24)
    .html('Google Keywords Trend 2020');
   
let caption = svg.append('text')
    .attr('class', 'caption')
    .attr('x', width)
    .attr('y', height-5)
    .style('text-anchor', 'end')
    .html('Source: Google Trends');

//Open variable to hold date
let date;
    
//Import data from csv
d3.csv('pytrends.csv').then(function(data) {
    console.log(data);

    //Set data
    trendData = data;

    //Create unique array of dates
    let dateList = trendData.map(d=> d.date);
    let dateSet = new Set(dateList);
    let uniqueDates = Array.from(dateSet);
    
    //Set dateIndex
    let dateIndex = 0

    //Start date with first element of uniqueDates array
    date = uniqueDates[0];

    //Format data
    data.forEach(d => {
        //Set values as numbers
        d.value = +d.value,
        d.lastValue = +d.lastValue,
        d.value = isNaN(d.value) ? 0 : d.value,
        d.colour = d3.hsl(Math.random()*360,0.75,0.75)
    });

    console.log(data);
    
    //Filter data to sort and slice by date
    let dateSlice = data.filter(d => d.date == date && !isNaN(d.value))
        .sort((a,b) => b.value - a.value)
        .slice(0, top_n);
  
    //Loop through dateSlice to assign rank
    dateSlice.forEach((d,i) => d.rank = i);
    
    console.log('dateSlice: ', dateSlice)
  
    //Create scales
    let x = d3.scaleLinear()
        .domain([0, d3.max(dateSlice, d => d.value)])
        .range([margin.left, width-margin.right-65]);
  
    let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height-margin.bottom, margin.top]);
  
    //Create x axis
    let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-margin.top-margin.bottom))
        .tickFormat(d => d3.format(',')(d));
  
    //Append and format svg elements
    svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);
  
    svg.selectAll('rect.bar')
        .data(dateSlice, d => d.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0)+1)
        .attr('width', d => x(d.value)-x(0)-1)
        .attr('y', d => y(d.rank)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour);
      
    svg.selectAll('text.label')
        .data(dateSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .style('text-anchor', 'end')
        .html(d => d.name);
      
    svg.selectAll('text.valueLabel')
        .data(dateSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.value)+5)
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .text(d => d3.format(',.0f')(d.lastValue));

    let dateText = svg.append('text')
        .attr('class', 'dateText')
        .attr('x', width-margin.right)
        .attr('y', height-25)
        .style('text-anchor', 'end')
        .html(date)
        .call(halo, 10);
    
    //Setup interval for ticker
    let ticker = d3.interval(e => {

        dateSlice = data.filter(d => d.date == date && !isNaN(d.value))
            .sort((a,b) => b.value - a.value)
            .slice(0,top_n);

        dateSlice.forEach((d,i) => d.rank = i);
     
        x.domain([0, d3.max(dateSlice, d => d.value)]); 
     
        svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);
    
        let bars = svg.selectAll('.bar').data(dateSlice, d => d.name);
    
        bars
            .enter()
            .append('rect')
            .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
            .attr('x', x(0)+1)
            .attr( 'width', d => x(d.value)-x(0)-1)
            .attr('y', d => y(top_n+1)+5)
            .attr('height', y(1)-y(0)-barPadding)
            .style('fill', d => d.colour)
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank)+5);
          
        bars
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('width', d => x(d.value)-x(0)-1)
                .attr('y', d => y(d.rank)+5);
            
        bars
            .exit()
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('width', d => x(d.value)-x(0)-1)
                .attr('y', d => y(top_n+1)+5)
                .remove();

        let labels = svg.selectAll('.label')
            .data(dateSlice, d => d.name);
     
        labels
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
            .style('text-anchor', 'end')
            .html(d => d.name)    
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
             
        labels
            .transition()
                .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
     
        labels
            .exit()
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value)-8)
                .attr('y', d => y(top_n+1)+5)
                .remove();
         
        let valueLabels = svg.selectAll('.valueLabel').data(dateSlice, d => d.name);
    
        valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => x(d.value)+5)
            .attr('y', d => y(top_n+1)+5)
            .text(d => d3.format(',.0f')(d.lastValue))
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
            
        valueLabels
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value)+5)
                .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                .tween("text", function(d) {
                    let i = d3.interpolateRound(d.lastValue, d.value);
                    return function(t) {
                        this.textContent = d3.format(',')(i(t));
                    };
                });
      
        valueLabels
            .exit()
            .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value)+5)
                .attr('y', d => y(top_n+1)+5)
                .remove();
    
        dateText.html(date);
     
        //Set ticker stop
        if(dateIndex == (uniqueDates.length-1)) ticker.stop();
        dateIndex+=1;
        date = uniqueDates[dateIndex];
    },tickDuration);
});

//Create function
const halo = function(text, strokeWidth) {
    text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .style('fill', '#ffffff')
        .style('stroke','#ffffff')
        .style('stroke-width', strokeWidth)
        .style('stroke-linejoin', 'round')
        .style('opacity', 1);
};