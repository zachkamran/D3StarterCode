const domReady = require('domready');
import {select} from 'd3-selection';
import {csv} from 'd3-fetch';
import {goodVis} from './good-vis';
import {badVis} from './bad-vis';

// NO NEED TO EDIT THIS FILE
// this file simply provides a very rudimentary router to
// access the visualizations you create in the other files
domReady(() => {
  const mode = window.location.href.split('/#')[1];
  // if no mode is select provide links to appropriate modes
  if (!mode || !(mode === 'bad' || mode === 'good')) {
    // if we are the router root then hide the return link
    select('.return-link').attr('class', 'return-link hide');
    // build links for accessing the visualizations
    ['good', 'bad'].forEach(key => {
      select('.link-holder')
        .append('a')
        .attr('href', `http://localhost:9966/#${key}`)
        .attr('class', 'intro-link')
        .text(`${key} vis`)
        .on('click', () => location.reload());
    });
    return;
  }
  // This calls d3's wrapper on the fetch API which converts a target file to a jsob blob
  csv('./data/asics.csv')
    .then(data => (mode === 'good' ? goodVis : badVis)(data.slice(0, 11)));
});
