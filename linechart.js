function drawLineChart(containerId, csvPath) {
  const width = 900, height = 600;
  const margin = { top: 50, right: 50, bottom: 60, left: 70 };

  // SVG
  const svg = d3.select(containerId)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto");

  // Chart group
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv(csvPath).then(data => {
    data.forEach(d => {
      d.Year = +d.Year;
      d.AvgPrice = +d["Average Price (notTas-Snowy)"];
    });

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Year))
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AvgPrice)])
      .nice()
      .range([chartHeight, 0]);

    // Line generator
    const line = d3.line()
      .x(d => x(d.Year))
      .y(d => y(d.AvgPrice));

    // Draw line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    g.append("g")
      .call(d3.axisLeft(y));

    // Axis labels
    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 40)
      .attr("text-anchor", "middle")
      .text("Year");

    g.append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Average Price (¢/kWh)");
  });
}

drawLineChart("#LineChart", "data/Ex5_ARE_Spot_Prices.csv");