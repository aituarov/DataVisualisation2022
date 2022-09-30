async function buildPlot() {
    //Get data
    const data = await d3.json("my_weather_data.json");

    //Parse date into proper format
    const dateParser = d3.timeParse("%Y-%m-%d");
    //Accessors for different values of JSON
    const yTemperatureMin = (d) => d.temperatureMin;
    const yTemperatureMax = (d) => d.temperatureMax;
    const xAccessor = (d) => dateParser(d.date);

    //Dimension of svg
    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 40,
            left: 40,
            bottom: 0,
            right: 0
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);

    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    //Scaling values of two variables:
    // As I checked yTemperatureMin has always lower values than yTemperatureMax,
    //      so domain values will be min of yTemperatureMin and max of yTemperatureMax

    const yScaler = d3.scaleLinear()
        .domain([d3.extent(data,yTemperatureMin)[0], d3.extent(data,yTemperatureMax)[1]])
        .range([dimension.boundedHeight,0]);
    svg
        .append("g")
        .attr("transform", `translate(${dimension.margin.left}, 0)`)      // This controls the vertical position of the Axis
        .call(d3.axisLeft(yScaler)); //adding y axis

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([dimension.margin.left,dimension.boundedWidth]);
    svg
        .append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(0,${dimension.boundedHeight})`)      // This controls the vertical position of the Axis
        .call(d3.axisBottom(xScaler));

    //generate yTemperatureMin line
    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yTemperatureMin(d)))

    //generate yTemperatureMax line
    var lineGenerator1 = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yTemperatureMax(d)))

    //appending path and set colors
    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke","blue");

    bounded.append("path")
        .attr("d",lineGenerator1(data))
        .attr("fill", "none")
        .attr("stroke","red");
}

buildPlot();