import {scaleLinear, scaleOrdinal, scaleBand} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import {select} from 'd3-selection';
import {min, max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {legendSize} from 'd3-svg-legend';
import 'd3-transition';

// In this file, starting from this function you will produce your "bad" visualization
// code should be encapsulated within functions
// you are encouraged to write utility methods and import them, as indicated above
// we have placed an SVG in the dom (accessible via the selector #thevis)
// where you should place your work
export function badVis(data) {
  const margin = {top: 30, right: 10, bottom: 20, left: 0};
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const xScale = scaleLinear().range([0, width]);
  const parts = [];
  data.forEach(function getParts(d) {
    parts.push(d.part);
  });

  const yScale = scaleBand().domain(parts).range([height, 0]);

  const xValue = d => parseFloat(d.recovery);
  const sValue = d => parseFloat(d.percentage);
  const yValue = d => d.part;

  const color = scaleOrdinal(schemeCategory10);
  const svg = select('#thevis')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  xScale.domain([min(data, xValue) - 1, max(data, xValue) + 3]);
  const size = scaleLinear().domain([0, max(data, sValue) + 5]).range([10, 30]);

  // Add the x Axis
  svg.append('g')
    .attr('transform', `translate(0,${ height })`)
    .call(axisBottom(xScale));

  // text label for the x axis
  svg.append('text')
    .attr('transform',
      `translate(${ width / 2 } ,${
      height + margin.top + 20 })`)
    .style('text-anchor', 'middle')
    .text('Recovery Time');

  // Add the y Axis
  svg.append('g')
    .attr('transform', 'translate(50,0)')
    .call(axisLeft(yScale));

  // text label for the y axis
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Part');

  svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('r', d => size(sValue(d)))
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
    .style('fill', d => color(d.part));

  svg.append('g')
    .attr('class', 'legendSize')
    .attr('transform', `translate(${ width - 120 },20)`);

  const sizeLegend = legendSize()
    .scale(size)
    .shape('circle')
    .shapePadding(15)
    .labelOffset(20)
    .orient('vertical')
    .title('Percent of injuries');

  svg.select('.legendSize')
    .call(sizeLegend);

}

