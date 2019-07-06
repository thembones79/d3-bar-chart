fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then(resp => resp.json())
  .then(resp => {
    const gdpData = resp.data;

    const w = 1000;
    const h = 500;
    const padding = 60;

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(gdpData, d => new Date(d[0])),
        d3.max(gdpData, d => new Date(d[0]))
      ])
      .range([padding, w - padding]);


    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdpData, d => d[1])])
      .range([0, h]);

    const reversedScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdpData, d => d[1])])
      .range([h, 0]);

    const svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "green")
      .attr("class", "firstBar");

    const tooltip = d3
      .select(".chart")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(reversedScale);
    const barWidth = (w - 2 * padding) / d3.max(gdpData, (d, i) => i);

    const defs = svg.append("defs");

    const gradient = defs
      .append("linearGradient")
      .attr("id", "svgGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("class", "start")
      .attr("offset", "0%")
      .attr("stop-color", "red")
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("class", "end")
      .attr("offset", "100%")
      .attr("stop-color", "blue")
      .attr("stop-opacity", 1);

    svg
      .selectAll("rect")
      .data(gdpData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * barWidth)
      .attr("y", (d, i) => h - yScale(d[1]))
      .attr("width", 3.5)
      .attr("height", (d, i) => yScale(d[1]))
      .attr("fill", "url(#svgGradient)")
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("transform", "translate(" + padding + ", " + -padding + ")")
      .on("mouseover", (d, i) => {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(
            "<p><strong>" +
              d[0].substring(0, 7) +
              "</strong></p>" +
              "<p>" +
              "$" +
              d[1] +
              " Billion</p>"
          )
          .attr("data-date", d[0])
          .style("left", i * barWidth + 30 + "px")
          .style("top", h - 100 + "px")
          .style("transform", "translate(6px,-110px)");
      })
      .on("mouseout", d => {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ", " + -padding + ")")
      .attr("id", "y-axis")
      .call(yAxis);
  });
