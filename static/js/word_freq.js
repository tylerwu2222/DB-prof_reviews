// configuration parameters
const W_WIDTH = window.innerWidth, W_HEIGHT = window.innerHeight;
var config = {
  "vw": W_WIDTH * 0.75,
  "vh": W_HEIGHT,
  // "inner_vw": INNER * W_WIDTH - PADDING_H,
  // "inner_vh": INNER * W_HEIGHT - PADDING_V,
  "anim_speed": 3000
}
var margin = ({top: 50, right: 20, bottom: 40, left: 100});

// display and select words on click
const select_words = () => {};

// plot points
const render_stats = (data) =>{
  const t = d3.transition().duration(config.anim_speed).ease(d3.easeCubic);
  console.log(data);
  console.log(data.map(d => d.count));
  const stat_svg = d3.select("#stat-svg")
    .style("width", '100%')
    .style("height", config.vh + 'px')
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

  // axes, labels, title
  const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.count)])
  .range([margin.left, config.vw - margin.right])
  const xAxis = d3.axisBottom().scale(xScale);
  stat_svg.append("g").attr('class','xaxis');
  stat_svg.select('g.xaxis')    
      .attr("transform", "translate(0," + (config.vh-margin.bottom) + ")")
      .transition(t)
      .call(xAxis);
  const xLabel = stat_svg.append("text")
      .attr("class", "xlabel");
  stat_svg.select('.xlabel')
      .attr("text-anchor", "middle")
      .attr("x", (config.vw+ margin.left)/2 )
      .attr("y",config.vh)
      .text('Count (should be percent)');

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.word))
    .range([margin.top,config.vh - margin.bottom]);
  const yAxis = d3.axisLeft().scale(yScale);
  stat_svg.append("g").attr('class','yaxis');
  stat_svg.select('g.yaxis')    
      .attr("transform", "translate("+ (margin.left) + ",0)")
      .transition(t)
      .call(yAxis);
  const yLabel = stat_svg.append("text")
      .attr("class", "ylabel");
  stat_svg.select('.ylabel')
      .attr("text-anchor", "middle")
      .attr("x", -config.vh/2)
      .attr("y",margin.top)
      .attr("transform", "rotate(-90)")
      .text('Word');

  stat_svg.append('text')
    .attr('y',-10)
    .text('Word Frequencies for Male vs. Female Professors');
  
  // plot data
  stat_svg.append("g")
    .selectAll("circle")
    .data(data)
    .join(enter => enter.append("circle")
      .attr("cx", d => xScale(0)) //p
      .attr("cy", d => yScale(d.word)) //p
      .call(enter => enter.transition(t)
      .attr("fill", d => d3.schemeSet1[d.gender === "male" ? 1 : 0])
      .attr("gender",d => d.gender)
      .attr("count", d => d.count)
      .attr("cx", d => xScale(d.count)) //p
      .attr("cy", d => yScale(d.word)) //p
      .attr("r", 5)
      // .attr("width", d => d.sex === "M" ? xM(0) - xM(d.value) : xF(d.value) - xF(0))
      .attr("height", yScale.bandwidth())
      ),
      update => update
            .call(update => update.transition(t)
            ),
      exit => exit
            .call(exit => exit.transition()
            .attr('height',0)
            .attr('y',config.inner_vh)
            .remove()
            )
    );
};

// load male and female freq data
d3.csv('../static/data/prof_word_freqs_tidy.csv')
.then(data => {
  // console.log(data);
  data.forEach(d => {
    d.count = +d.count;
  });  
  // data.sort((a, b) => (a.count > b.count) ? -1 : 1)
  data = data.slice(0,20)
  render_stats(data);
});