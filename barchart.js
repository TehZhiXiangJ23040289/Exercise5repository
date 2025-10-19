function drawBarChart(containerId, csvPath) {
  const width = 800, height = 500;
  const margin = { top: 40, right: 20, bottom: 80, left: 70 };

  const svg = d3.select(containerId)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto");

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv(csvPath).then(data => {
    data.forEach(d => {
      d.MeanEnergy = +d["Mean(Labelled energy consumption (kWh/year))"];
    });

    // X: categories
    const x = d3.scaleBand()
      .domain(data.map(d => d.Screen_Tech))
      .range([0, chartWidth])
      .padding(0.2);

    // Y: values
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.MeanEnergy)])
      .nice()
      .range([chartHeight, 0]);

    // Draw bars
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Screen_Tech))
      .attr("y", d => y(d.MeanEnergy))
      .attr("width", x.bandwidth())
      .attr("height", d => chartHeight - y(d.MeanEnergy))
      .attr("fill", "steelblue");

    // Bar labels
    g.selectAll("text.value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", d => x(d.Screen_Tech) + x.bandwidth() / 2)
      .attr("y", d => y(d.MeanEnergy) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.MeanEnergy.toFixed(1))
      .style("font-size", "12px");

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y));

    // Axis labels
    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 60)
      .attr("text-anchor", "middle")
      .text("Screen Technology");

    g.append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Mean Energy Consumption (kWh/year)");
  });
}

// Call function
drawBarChart("#BarChart", "data/Ex5_TV_energy_55inchtv_byScreenType.csv");