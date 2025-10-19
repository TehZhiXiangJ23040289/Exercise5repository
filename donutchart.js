function drawDonutChart(containerId, csvPath) {
  const width = 600, height = 600;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

  const svg = d3.select(containerId)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto");

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  d3.csv(csvPath).then(data => {
    data.forEach(d => {
      d.MeanEnergy = +d["Mean(Labelled energy consumption (kWh/year))"];
    });

    const pie = d3.pie().value(d => d.MeanEnergy);
    const arc = d3.arc()
      .innerRadius(radius * 0.5)  // donut hole
      .outerRadius(radius);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.Screen_Tech))
      .range(d3.schemeSet2);

    // Draw slices
    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.Screen_Tech))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    // Add labels inside slices
    g.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .text(d => d.data.Screen_Tech);
  });
}

// Call function
drawDonutChart("#DonutChart", "data/Ex5_TV_energy_Allsizes_byScreenType.csv");