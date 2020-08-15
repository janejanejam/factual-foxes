Plotly.d3.csv('./topkey.csv', function(err, rows){
                function unpack(rows, key, keyword = 'how') {
return rows.filter(function (row){return row.keyword==keyword}).map(function(row) { return row[key]; });
}
function updatemap(e){
    var keyword =  d3.select("#dropdown").node().value
    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: unpack(rows, 'state', keyword),
        z: unpack(rows, 'value', keyword),
        text: unpack(rows, 'query',keyword),
        autocolorscale: true
    }];
    var layout = {
        title: 'July 2020 Pytrend Keyword Questions in the US',
            geo:{
                scope: 'usa',
                countrycolor: 'rgb(255, 255, 255)',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                showlakes: true,
                lakecolor: 'rgb(255, 255, 255)',
                subunitcolor: 'rgb(255, 255, 255)',
                lonaxis: {},
                lataxis: {}
            }
        };
    Plotly.newPlot("plot", data,layout)
    console.log(data)
}
d3.select('#dropdown').on("change",updatemap);


var data = [{
    type: 'choropleth',
    locationmode: 'USA-states',
    locations: unpack(rows, 'state'),
    z: unpack(rows, 'value'),
    text: unpack(rows, 'State'),
    autocolorscale: true
}];
console.log(data)

var layout = {
title: 'July 2020 Pytrend Keyword Questions in the US',
    geo:{
        scope: 'usa',
        countrycolor: 'rgb(255, 255, 255)',
        showland: true,
        landcolor: 'rgb(217, 217, 217)',
        showlakes: true,
        lakecolor: 'rgb(255, 255, 255)',
        subunitcolor: 'rgb(255, 255, 255)',
        lonaxis: {},
        lataxis: {}
    }
};
Plotly.newPlot("plot", data, layout, {showLink: false});
}); 


