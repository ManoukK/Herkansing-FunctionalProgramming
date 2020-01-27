// Bron: https://www.youtube.com/watch?v=Qw6uAg3EO64
// Bron: https://vizhub.com/Razpudding/6b3c5d10edba4c86babf4b6bc204c5f0?edit=files&file=index.js

import { select, 
        json, 
        geoPath, 
        geoGilbert
       } from 'd3';

//feature zet topojson om naar geojson
import { feature } from 'topojson';

const query = `PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
	PREFIX geo: <http://www.opengis.net/ont/geosparql#>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX gn: <http://www.geonames.org/ontology#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

	SELECT ?lat ?long ?landLabel WHERE {
 		?svcn skos:exactMatch/wgs84:lat ?lat .
 		?svcn skos:exactMatch/wgs84:long ?long .
 		?svcn skos:exactMatch/gn:parentCountry ?land .
 		?land gn:name ?landLabel .
}`

const endpoint = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-13/sparql'

const svg = select('svg')
const circleSize = 2
//soort kaart gevonden op: https://github.com/d3/d3-geo-projection
const projection = geoGilbert()
//hier stop je de projection in van hierboven zodat het weer welke vorm het moet krijgen
const pathGenerator = geoPath().projection(projection)

//bron tooltip: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
const tooltip = d3.select('body').append('div').attr('class', 'toolTip');
const color = colorPalette();

const width = +svg.attr('width');
const heigth = +svg.attr('heigth');

//code van Laurens uit zijn vizhub wereldkaart: //https://vizhub.com/Razpudding/b42c2072180348658542212b91614b82
//ook gebruikt voor mijn bar chart https://vizhub.com/ManoukK/c5757c39fd744066aa64668b02a92785?edit=files&file=index.js&mode=full
function colorPalette() {
		return d3.scaleOrdinal(d3.schemeRdPu[9])
}


setupWorldMap()
makeWorldMap()
makeCircles()

//dit zorgt ervoor dat het de curves krijgt die je wilt ipv recht in het hele scherm
function setupWorldMap(){
  svg
    .append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({ type: 'Sphere' }))
}

function makeWorldMap() {
  //Met deze link worden de landen gemaakt (het is een npm package)
  d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
    .then(data => {
    console.log("data uit de world atlas libary:", data)
    //De landen wil je op de kaart zien dat doe je door eerst de landen eruit te halen 
    //die "verstopt" zitten in data.objects.countries 
    //hier roep je de feature aan met twee parameters
    const countries = feature(data, data.objects.countries);
    //nu word voor elk land in de array een pad/vorm aangemaakt 
    svg
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
  })
}

function makeCircles() {  
  fetch(endpoint +"?query="+ encodeURIComponent(query) + "&format=json")
    .then(data => data.json())
  	.then(json => json.results.bindings)
    .then(results => {
    console.log(results)
    		results.map(result => {
    			result.lat = Number(result.lat.value)
    			result.long = Number(result.long.value)
    			result.countryName = result.landLabel.value
    }) 
    
	svg
		.selectAll('circle')
		.data(results)
		.enter()
		.append('circle')
		.attr('class', 'circles')
		.attr('cx', function(d) {
			return projection([d.long, d.lat])[0]
		})
		.attr('cy', function(d) {
			return projection([d.long, d.lat])[1]
		})
		.attr('r', circleSize+'px')
		// .style('fill', 'orange')
		.style('fill', d => color(d.countryName))
		.on('mouseover', function(d){
			tooltip
			//zet het in het midden van waar de muis is
			.style('left', d3.event.pageX - 50 + 'px')
			//de hoogte van waar het boven de muis zweeft gerekend vanaf het midden van de popup
			.style('top', d3.event.pageY - 70 + 'px')
			//het moet inline block zijn omdat je er zo width, height, margins en paddings aan 
			//kan geven en het neemt geen ruimte in beslag zoals block dat wel doet. 
			.style('display', 'block')
			//tekst in het blokje
			.html('Country:' + '<br/>' + (d.countryName))
	})
		.on('mouseout', function(d){ tooltip.style('display', 'none');});
	})
}