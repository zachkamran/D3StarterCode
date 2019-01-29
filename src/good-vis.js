import {scaleLinear, scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import {select} from 'd3-selection';
import {min, max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';

// In this file, starting from this function you will produce your "good" visualization
// code should be encapsulated within functions
// you are encouraged to write utility methods and import them, as indicated above
// we have placed an SVG in the dom (accessible via the selector #thevis)
// where you should place your work
export function goodVis(data) {
  const margin = {top: 30, right: 10, bottom: 20, left: 0};
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScale = scaleLinear().range([0, width]);

  const yScale = scaleLinear().range([height, 0]);

  const xValue = d => parseFloat(d.percentage);
  const yValue = d => parseFloat(d.recovery);

  const color = scaleOrdinal(schemeCategory10);

  const svg = select('#thevis')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  xScale.domain([min(data, xValue) - 1, max(data, xValue) + 3]);
  yScale.domain([min(data, yValue) - 1, max(data, yValue) + 3]);

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
    .text('Percent of Total Injuries');

  // Add the y Axis
  svg.append('g')
    .attr('transform', 'translate(20,0)')
    .call(axisLeft(yScale));

  // text label for the y axis
  svg.append('text')
    .attr('transform', 'rotate(-90) translate(60, 30)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Recovery Time');

  svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('r',5)
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)))
    .style('fill', d => color(d.part));

  // draw legend
  const legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function transMove(d, i) {
      return `translate(0,${ i * 20 })`;
    });

  // draw legend colored rectangles
  legend.append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', color);

  // draw legend text
  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function getText(d) {
      return d;
    });

}

