function drawScatterPlot(containerId, csvPath) {
  const width = 600, height = 600;
  const margin = { top: 50, right: 50, bottom: 60, left: 70 };

  // SVG
  const svg = d3.select(containerId)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv(csvPath).then(data => {
    data.forEach(d => {
      d.star2 = +d.star2;
      d.energy = +d.energy_consumpt;
    });

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.star2)])
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy)])
      .nice()
      .range([chartHeight, 0]);

    // Draw points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.star2))
      .attr("cy", d => y(d.energy))
      .attr("r", 4)
      .attr("fill", "teal")
      .attr("opacity", 0.7);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    // Axis labels
    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 45)
      .attr("text-anchor", "middle")
      .text("Star Rating");

    g.append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Energy Consumption (kWh/year)");
  });
}

drawScatterPlot("#ScatterPlot", "data/Ex5_TV_Energy.csv");