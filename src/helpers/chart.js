import * as d3 from 'd3';
import { feature } from 'topojson-client';

import { createEducationGroupsArr } from './createEducationGroupsArr';
import { mapColoring } from './mapColoring';

const render = (educationDataJSON, countyDataJSON, ref, width, height) => {
  const svg = d3.select(ref.current);

  // define space for the Choropleth map
  const margin = { top: 0, right: 0, bottom: 0, left: 150 };
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  // Set up the projection for the US map
  d3.geoAlbersUsa();
  const counties = feature(countyDataJSON, countyDataJSON.objects.counties);

  // Assign an id based on related fibs to each object with educational data
  const objById = educationDataJSON.reduce((accumulator, d) => {
    accumulator[d.fips] = d;
    return accumulator;
  }, {});

  // Re-assign education properties to the array with counties data
  counties.features.forEach((d) => {
    Object.assign(d.properties, objById[d.id]);
  });

  // Define constants for the map and legend
  const countyFip = (d) => d.properties.fips;
  const countyName = (d) => d.properties.area_name;
  const countyState = (d) => d.properties.state;
  const countyEducation = (d) => d.properties.bachelorsOrHigher;

  const numOfSections = 8;
  const minEducationLevel = d3.min(counties.features, countyEducation);
  const maxEducationLevel = d3.max(counties.features, countyEducation);
  const section = Math.round(
    (maxEducationLevel - minEducationLevel) / numOfSections
  );
  const groupsArr = createEducationGroupsArr(
    minEducationLevel,
    numOfSections,
    section
  );
  const legendWidth = 300;
  const legendBarWidth = legendWidth / numOfSections;

  // Define the color scheme
  const colorPalette = d3.schemeGreens[numOfSections];

  // Create and position axes text labels and the title
  const titleText = 'United States Educational Attainment';
  const titleXAxisPos = -innerHeight / 2;
  const titleYAxisPos = -100;

  const subtitleText =
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)";
  const subtitleYAxisPos = titleYAxisPos + 22;

  // define and append map to the svg
  const map = svg
    .append('g')
    .attr('id', 'map')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // append the title section
  const titleSection = map
    .append('g')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)');

  titleSection
    .append('text')
    .attr('id', 'title')
    .attr('x', titleXAxisPos)
    .attr('y', titleYAxisPos)
    .text(titleText);

  titleSection
    .append('text')
    .attr('id', 'description')
    .attr('x', titleXAxisPos)
    .attr('y', subtitleYAxisPos)
    .text(subtitleText);

  // Default settings for the tooltips
  let tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  // Append counties' info to the map
  map
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', d3.geoPath())
    .attr('data-fips', (d) => countyFip(d))
    .attr('data-education', (d) => countyEducation(d))
    .attr('fill', (d) =>
      mapColoring(countyEducation(d), colorPalette, groupsArr)
    )
    .on('mouseover', (d) => {
      tooltip.transition().duration(200).style('opacity', 0.8);
      tooltip
        .html(`${countyName(d)}, ${countyState(d)}: ${countyEducation(d)}%`)
        .style('left', d3.event.pageX - 100 + 'px')
        .style('top', d3.event.pageY - 80 + 'px')
        .attr('data-education', countyEducation(d));
    })
    .on('mouseout', (d) => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

  // Add the legend to the visualization
  const legend = svg
    .append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${innerWidth / 2 + 150}, -580)`);

  const tempScale = d3
    .scaleLinear()
    .domain([minEducationLevel, maxEducationLevel])
    .range([0, legendWidth]);

  const legendXAxis = d3
    .axisBottom(tempScale)
    .tickValues(groupsArr)
    .tickFormat((d) => Math.round(d) + '%')
    .tickSizeOuter(0);

  legend
    .append('g')
    .attr('id', 'legend-x-axis')
    .attr('transform', `translate(0, ${innerHeight + 10})`)
    .call(legendXAxis);

  legend
    .selectAll('rect')
    .data(groupsArr)
    .enter()
    .append('rect')
    .attr('class', 'legend-rect')
    .attr('x', (d, i) => i * legendBarWidth)
    .attr('transform', `translate(0, ${innerHeight - 10})`)
    .attr('width', legendBarWidth)
    .attr('height', 20)
    .attr('fill', (d) => mapColoring(d, colorPalette, groupsArr)); //fill with palette accordingly
};

export { render };
