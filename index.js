const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let dataSet;

let tooltipArray = [];
const addToolTip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "rgb(171, 190, 217)")
    .style("border-radius", "5px")
    .style("visibility", "hidden")

d3.json(dataURL)
    .then((data, error) => {
        if(error) {
            console.log(error);
        } else {
            dataSet = data;
            const value = data.data
            console.log(value);
            drawMap();
        }
    })

const drawMap = () => {
    const height = 600;
    const width = 1000;
    const padding = 60;

    const value = dataSet.data[1]
    console.log(value);

    let gdpMAP = dataSet.data.map((d)=>{
        return d[1]
    });
    console.log(gdpMAP);
    const gdpMax = d3.max(gdpMAP);
    console.log(gdpMax);

    let canvas = d3.select("body")
        .append("svg")
        .attr("id", "canvas")
        .attr("width", width)

    const xScale = d3.scaleLinear()
        .domain([0, dataSet.data.length - 1])
        .range([padding, width-padding]);

    const datesArr = dataSet.data.map((d)=>{
        return new Date(d[0]);
    })
    console.log(datesArr);
    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArr), d3.max(datesArr)])
        .range([padding, width-padding]);

    const xAxis = d3.axisBottom(xAxisScale)

    canvas.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height- padding) + ")");

    const yScaleHeight = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([0, height - (2 * padding)]);

    const yScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([height-padding, padding]);

    const yAxis = d3.axisLeft(yScale);

    canvas.append("g")
        .call(yAxis)
        .attr("transform", "translate(" + padding + ",0)")
        .attr("id", "y-axis")

    canvas.selectAll("rect")
        .data(dataSet.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date",  (d)=>{return d[0]})
        .attr("data-gdp", (d)=>{return d[1]})
        .attr("x", (d,i)=> xScale(i))
        .attr("y", (d,i)=> {
            return ((height-padding)-yScaleHeight(d[1]))
        })
        .attr("width", (width-(2 * padding)) / dataSet.data.length)
        .attr("height", (d)=> {
            return yScaleHeight(d[1])
        })
        .attr("fill", (d,i)=> {
            if (i % 2 === 0) {
                return "teal"
            } else {
                return "limegreen"
            }
        })
        .on("mouseover", (e , d ) => {
            let yearFormat = dataSet.data.map(()=>{
                let quarter;
                let testQuarter = d[0].substring(5, 7);

                if (testQuarter === '01') {
                    quarter = 'Q1';
                } else if (testQuarter === '04') {
                    quarter = 'Q2';
                } else if (testQuarter === '07') {
                    quarter = 'Q3';
                } else if (testQuarter === '10') {
                    quarter = 'Q4';
                }
                return d[0].substring(0, 4) + ' ' + quarter;
            });
            let gdpFormat = dataSet.data.map(()=>{
                return d[1]
            });
            let dataDate = dataSet.data.map(()=> {
                return d[0]
            })
            tooltipArray = [`Year: ${yearFormat[1]}`, `GDP: ${gdpFormat[1]}`];
            addToolTip.style('visibility', 'visible')
                .style("opacity", 1)
                .style("position", 'absolute')
                .attr("data-date", `${dataDate[1]}`)
                .style("top", `${e.clientY}px`)
                .style("left", `${e.clientX}px`)
                .selectAll("h1")
                .data(tooltipArray)
                .join("h1")
                .style("font-size", "10px")
                .text((text) => text)
                .style("visibility", "visible")
        })
        .on("mouseout", function () {
            addToolTip.style("visibility", "hidden")
                .style("opacity", 0)
        })
}