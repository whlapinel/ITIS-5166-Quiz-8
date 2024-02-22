renderCharts();
async function renderCharts() {
    const data = await getData();
    renderPieChart(data);
    renderD3Donut(data);
}
async function getData() {
    const response = await axios.get('http://localhost:3000/api/budget');
    console.log(response.data);
    return response.data;
}
async function renderPieChart(data) {
    const ctx = document.getElementById('myChart');
    const labels = data.map(item => item.title);
    const values = data.map(item => item.budget);
    const colors = data.map(item => item.color);
    console.log(labels, values);
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'budget',
                data: values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
    });
}
async function renderD3Donut(data) {
    async function convertData(data) {
        // const response = await axios.get('http://localhost:3000/budget');
        // const data = response.data;
        const obj = {};
        data.map(item => {
            obj[item.title] = item.budget;
        });
        console.log("converted data: " + obj);
        return obj;
    }
    const convertedData = await convertData(data);
    console.log(convertedData);

    // set the dimensions and margins of the graph
    const width = 500,
        height = 500,
        margin = 100;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);


    // create color mapping
    const colorMapping = data.reduce((acc, item) => {
        acc[item.title] = item.color;
        return acc;
    }, {});


    // assign different color to each item
    // const color = d3.scaleOrdinal()
    //     .domain(data.map(item => item.budget))
    //     .range(data.map(item => item.color));


    // set the color scale
    // const color = d3.scaleOrdinal()
    //     .domain(data.map(item => item.title))
    //     .range(data.map(item => item.color));

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d[1])
    const data_ready = pie(Object.entries(convertedData))

    // The arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('path') // Correct the selection to target the paths you're creating
    .data(data_ready)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => colorMapping[d.data[0]]) // Correctly apply the color mapping
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

    d3.selectAll('allSlices')
        .data(data_ready)
        .style('fill', function (d) {
            return colorMapping[d.title]; // Use the mapping to set color
        });

    // Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
            const posA = arc.centroid(d) // line insertion in the slice
            const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            const posC = outerArc.centroid(d); // Label position = almost the same as posB
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg
        .selectAll('allLabels')
        .data(data_ready)
        .join('text')
        .text(d => d.data[0])
        .attr('transform', function (d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function (d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
}
