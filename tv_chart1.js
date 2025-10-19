const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 500 1600")
  .style("border", "1px solid black");

    d3.csv("data/brandcount.csv", d => {
  return {
    brand: d.brand,              
    count: +d["Count(model)"] 
  };


}).then(data => {
    data.sort((a, b) => d3.descending(a.count, b.count));
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count));

  createBarChart(data);
})

const createBarChart = (data) => {
  const svgWidth = 700;
const svgHeight = 600;
const xOffset = 100;
const barHeight = 30;

const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.count)])
  .range([0, svgWidth - xOffset - 250]);

const yScale = d3.scaleBand()
 .domain(data.map(d => d.brand))
 .range([0, 900])
 .padding(0.1);

const barAndLabel = svg
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  barAndLabel
    .append("rect")
    .attr("x", xOffset)
    .attr("y", 0) // y is handled by the group
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "blue");

    barAndLabel //brand
    .append("text")
    .text(d => d.brand) 
    .attr("x", 98)
    .attr("y", 8)
    .attr("text-anchor", "end")
    .style("font-family", "sans-serif")
    .style("font-size", "10px");

    barAndLabel //count
    .append("text")
    .text(d => d.count)
    .attr("x", d => 100 + xScale(d.count) + 4)
    .attr("y", 8)
    .style("font-family", "sans-serif")
    .style("font-size", "10px");



  //svg.selectAll("rect")
    //.data(data)
   // .join("rect")
   // .attr("class", d => `bar bar-${d.count}`)
   // .attr("x", xOffset)
   // .attr("y", d => yScale(d.brand))
    //.attr("width", d => xScale(d.count))
  // .attr("height", yScale.bandwidth())
    //.attr("fill", "blue");
    
    
};