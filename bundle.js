(function (d3$1, topojson) {
	'use strict';

	// Bron: https://www.youtube.com/watch?v=Qw6uAg3EO64

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
}`;

	const endpoint = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-13/sparql';

	const svg = d3$1.select('svg');
	const circleSize = 2;
	//soort kaart gevonden op: https://github.com/d3/d3-geo-projection
	const projection = d3$1.geoGilbert();
	//hier stop je de projection in van hierboven zodat het weer welke vorm het moet krijgen
	const pathGenerator = d3$1.geoPath().projection(projection);

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


	setupWorldMap();
	makeWorldMap();
	makeCircles();

	//dit zorgt ervoor dat het de curves krijgt die je wilt ipv recht in het hele scherm
	function setupWorldMap(){
	  svg
	    .append('path')
	    .attr('class', 'sphere')
	    .attr('d', pathGenerator({ type: 'Sphere' }));
	}

	function makeWorldMap() {
	  //Met deze link worden de landen gemaakt (het is een npm package)
	  d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
	    .then(data => {
	    console.log("data uit de world atlas libary:", data);
	    //De landen wil je op de kaart zien dat doe je door eerst de landen eruit te halen 
	    //die "verstopt" zitten in data.objects.countries 
	    //hier roep je de feature aan met twee parameters
	    const countries = topojson.feature(data, data.objects.countries);
	    //nu word voor elk land in de array een pad/vorm aangemaakt 
	    svg
	      .selectAll('path')
	      .data(countries.features)
	      .enter()
	      .append('path')
	      .attr('class', 'country')
	      .attr('d', pathGenerator);
	  });
	}

	function makeCircles() {  
	  fetch(endpoint +"?query="+ encodeURIComponent(query) + "&format=json")
	    .then(data => data.json())
	  	.then(json => json.results.bindings)
	    .then(results => {
	    console.log(results);
	    		results.map(result => {
	    			result.lat = Number(result.lat.value);
	    			result.long = Number(result.long.value);
	    			result.countryName = result.landLabel.value;
	    }); 
	    
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
				.html('Country:' + '<br/>' + (d.countryName));
		})
			.on('mouseout', function(d){ tooltip.style('display', 'none');});
		});
	}

}(d3, topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEJyb246IGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9UXc2dUFnM0VPNjRcbi8vIEJyb246IGh0dHBzOi8vdml6aHViLmNvbS9SYXpwdWRkaW5nLzZiM2M1ZDEwZWRiYTRjODZiYWJmNGI2YmMyMDRjNWYwP2VkaXQ9ZmlsZXMmZmlsZT1pbmRleC5qc1xuXG5pbXBvcnQgeyBzZWxlY3QsIFxuICAgICAgICBqc29uLCBcbiAgICAgICAgZ2VvUGF0aCwgXG4gICAgICAgIGdlb0dpbGJlcnRcbiAgICAgICB9IGZyb20gJ2QzJztcblxuLy9mZWF0dXJlIHpldCB0b3BvanNvbiBvbSBuYWFyIGdlb2pzb25cbmltcG9ydCB7IGZlYXR1cmUgfSBmcm9tICd0b3BvanNvbic7XG5cbmNvbnN0IHF1ZXJ5ID0gYFBSRUZJWCB3Z3M4NDogPGh0dHA6Ly93d3cudzMub3JnLzIwMDMvMDEvZ2VvL3dnczg0X3BvcyM+XG5cdFBSRUZJWCBnZW86IDxodHRwOi8vd3d3Lm9wZW5naXMubmV0L29udC9nZW9zcGFycWwjPlxuXHRQUkVGSVggc2tvczogPGh0dHA6Ly93d3cudzMub3JnLzIwMDQvMDIvc2tvcy9jb3JlIz5cblx0UFJFRklYIGduOiA8aHR0cDovL3d3dy5nZW9uYW1lcy5vcmcvb250b2xvZ3kjPlxuXHRQUkVGSVggcmRmOiA8aHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIz5cblx0UFJFRklYIHJkZnM6IDxodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjPlxuXG5cdFNFTEVDVCA/bGF0ID9sb25nID9sYW5kTGFiZWwgV0hFUkUge1xuIFx0XHQ/c3ZjbiBza29zOmV4YWN0TWF0Y2gvd2dzODQ6bGF0ID9sYXQgLlxuIFx0XHQ/c3ZjbiBza29zOmV4YWN0TWF0Y2gvd2dzODQ6bG9uZyA/bG9uZyAuXG4gXHRcdD9zdmNuIHNrb3M6ZXhhY3RNYXRjaC9nbjpwYXJlbnRDb3VudHJ5ID9sYW5kIC5cbiBcdFx0P2xhbmQgZ246bmFtZSA/bGFuZExhYmVsIC5cbn1gXG5cbmNvbnN0IGVuZHBvaW50ID0gJ2h0dHBzOi8vYXBpLmRhdGEubmV0d2Vya2RpZ2l0YWFsZXJmZ29lZC5ubC9kYXRhc2V0cy9pdm8vTk1WVy9zZXJ2aWNlcy9OTVZXLTEzL3NwYXJxbCdcblxuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKVxuY29uc3QgY2lyY2xlU2l6ZSA9IDJcbi8vc29vcnQga2FhcnQgZ2V2b25kZW4gb3A6IGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1nZW8tcHJvamVjdGlvblxuY29uc3QgcHJvamVjdGlvbiA9IGdlb0dpbGJlcnQoKVxuLy9oaWVyIHN0b3AgamUgZGUgcHJvamVjdGlvbiBpbiB2YW4gaGllcmJvdmVuIHpvZGF0IGhldCB3ZWVyIHdlbGtlIHZvcm0gaGV0IG1vZXQga3JpamdlblxuY29uc3QgcGF0aEdlbmVyYXRvciA9IGdlb1BhdGgoKS5wcm9qZWN0aW9uKHByb2plY3Rpb24pXG5cbi8vYnJvbiB0b29sdGlwOiBodHRwczovL2JsLm9ja3Mub3JnL2FsYW5kdW5uaW5nLzI3NGJmMjQ4ZmQwZjM2MmQ2NDY3NDkyMGU4NWMxZWI3XG5jb25zdCB0b29sdGlwID0gZDMuc2VsZWN0KCdib2R5JykuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sVGlwJyk7XG5jb25zdCBjb2xvciA9IGNvbG9yUGFsZXR0ZSgpO1xuXG5jb25zdCB3aWR0aCA9ICtzdmcuYXR0cignd2lkdGgnKTtcbmNvbnN0IGhlaWd0aCA9ICtzdmcuYXR0cignaGVpZ3RoJyk7XG5cbi8vY29kZSB2YW4gTGF1cmVucyB1aXQgemlqbiB2aXpodWIgd2VyZWxka2FhcnQ6IC8vaHR0cHM6Ly92aXpodWIuY29tL1JhenB1ZGRpbmcvYjQyYzIwNzIxODAzNDg2NTg1NDIyMTJiOTE2MTRiODJcbi8vb29rIGdlYnJ1aWt0IHZvb3IgbWlqbiBiYXIgY2hhcnQgaHR0cHM6Ly92aXpodWIuY29tL01hbm91a0svYzU3NTdjMzlmZDc0NDA2NmFhNjQ2NjhiMDJhOTI3ODU/ZWRpdD1maWxlcyZmaWxlPWluZGV4LmpzJm1vZGU9ZnVsbFxuZnVuY3Rpb24gY29sb3JQYWxldHRlKCkge1xuXHRcdHJldHVybiBkMy5zY2FsZU9yZGluYWwoZDMuc2NoZW1lUmRQdVs5XSlcbn1cblxuXG5zZXR1cFdvcmxkTWFwKClcbm1ha2VXb3JsZE1hcCgpXG5tYWtlQ2lyY2xlcygpXG5cbi8vZGl0IHpvcmd0IGVydm9vciBkYXQgaGV0IGRlIGN1cnZlcyBrcmlqZ3QgZGllIGplIHdpbHQgaXB2IHJlY2h0IGluIGhldCBoZWxlIHNjaGVybVxuZnVuY3Rpb24gc2V0dXBXb3JsZE1hcCgpe1xuICBzdmdcbiAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAuYXR0cignY2xhc3MnLCAnc3BoZXJlJylcbiAgICAuYXR0cignZCcsIHBhdGhHZW5lcmF0b3IoeyB0eXBlOiAnU3BoZXJlJyB9KSlcbn1cblxuZnVuY3Rpb24gbWFrZVdvcmxkTWFwKCkge1xuICAvL01ldCBkZXplIGxpbmsgd29yZGVuIGRlIGxhbmRlbiBnZW1hYWt0IChoZXQgaXMgZWVuIG5wbSBwYWNrYWdlKVxuICBkMy5qc29uKCdodHRwczovL3VucGtnLmNvbS93b3JsZC1hdGxhc0AxLjEuNC93b3JsZC8xMTBtLmpzb24nKVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiZGF0YSB1aXQgZGUgd29ybGQgYXRsYXMgbGliYXJ5OlwiLCBkYXRhKVxuICAgIC8vRGUgbGFuZGVuIHdpbCBqZSBvcCBkZSBrYWFydCB6aWVuIGRhdCBkb2UgamUgZG9vciBlZXJzdCBkZSBsYW5kZW4gZXJ1aXQgdGUgaGFsZW4gXG4gICAgLy9kaWUgXCJ2ZXJzdG9wdFwiIHppdHRlbiBpbiBkYXRhLm9iamVjdHMuY291bnRyaWVzIFxuICAgIC8vaGllciByb2VwIGplIGRlIGZlYXR1cmUgYWFuIG1ldCB0d2VlIHBhcmFtZXRlcnNcbiAgICBjb25zdCBjb3VudHJpZXMgPSBmZWF0dXJlKGRhdGEsIGRhdGEub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIC8vbnUgd29yZCB2b29yIGVsayBsYW5kIGluIGRlIGFycmF5IGVlbiBwYWQvdm9ybSBhYW5nZW1hYWt0IFxuICAgIHN2Z1xuICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAuZGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY291bnRyeScpXG4gICAgICAuYXR0cignZCcsIHBhdGhHZW5lcmF0b3IpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG1ha2VDaXJjbGVzKCkgeyAgXG4gIGZldGNoKGVuZHBvaW50ICtcIj9xdWVyeT1cIisgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KSArIFwiJmZvcm1hdD1qc29uXCIpXG4gICAgLnRoZW4oZGF0YSA9PiBkYXRhLmpzb24oKSlcbiAgXHQudGhlbihqc29uID0+IGpzb24ucmVzdWx0cy5iaW5kaW5ncylcbiAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHRzKVxuICAgIFx0XHRyZXN1bHRzLm1hcChyZXN1bHQgPT4ge1xuICAgIFx0XHRcdHJlc3VsdC5sYXQgPSBOdW1iZXIocmVzdWx0LmxhdC52YWx1ZSlcbiAgICBcdFx0XHRyZXN1bHQubG9uZyA9IE51bWJlcihyZXN1bHQubG9uZy52YWx1ZSlcbiAgICBcdFx0XHRyZXN1bHQuY291bnRyeU5hbWUgPSByZXN1bHQubGFuZExhYmVsLnZhbHVlXG4gICAgfSkgXG4gICAgXG5cdHN2Z1xuXHRcdC5zZWxlY3RBbGwoJ2NpcmNsZScpXG5cdFx0LmRhdGEocmVzdWx0cylcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0LmF0dHIoJ2NsYXNzJywgJ2NpcmNsZXMnKVxuXHRcdC5hdHRyKCdjeCcsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdHJldHVybiBwcm9qZWN0aW9uKFtkLmxvbmcsIGQubGF0XSlbMF1cblx0XHR9KVxuXHRcdC5hdHRyKCdjeScsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdHJldHVybiBwcm9qZWN0aW9uKFtkLmxvbmcsIGQubGF0XSlbMV1cblx0XHR9KVxuXHRcdC5hdHRyKCdyJywgY2lyY2xlU2l6ZSsncHgnKVxuXHRcdC8vIC5zdHlsZSgnZmlsbCcsICdvcmFuZ2UnKVxuXHRcdC5zdHlsZSgnZmlsbCcsIGQgPT4gY29sb3IoZC5jb3VudHJ5TmFtZSkpXG5cdFx0Lm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbihkKXtcblx0XHRcdHRvb2x0aXBcblx0XHRcdC8vemV0IGhldCBpbiBoZXQgbWlkZGVuIHZhbiB3YWFyIGRlIG11aXMgaXNcblx0XHRcdC5zdHlsZSgnbGVmdCcsIGQzLmV2ZW50LnBhZ2VYIC0gNTAgKyAncHgnKVxuXHRcdFx0Ly9kZSBob29ndGUgdmFuIHdhYXIgaGV0IGJvdmVuIGRlIG11aXMgendlZWZ0IGdlcmVrZW5kIHZhbmFmIGhldCBtaWRkZW4gdmFuIGRlIHBvcHVwXG5cdFx0XHQuc3R5bGUoJ3RvcCcsIGQzLmV2ZW50LnBhZ2VZIC0gNzAgKyAncHgnKVxuXHRcdFx0Ly9oZXQgbW9ldCBpbmxpbmUgYmxvY2sgemlqbiBvbWRhdCBqZSBlciB6byB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zIGVuIHBhZGRpbmdzIGFhbiBcblx0XHRcdC8va2FuIGdldmVuIGVuIGhldCBuZWVtdCBnZWVuIHJ1aW10ZSBpbiBiZXNsYWcgem9hbHMgYmxvY2sgZGF0IHdlbCBkb2V0LiBcblx0XHRcdC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpXG5cdFx0XHQvL3Rla3N0IGluIGhldCBibG9ramVcblx0XHRcdC5odG1sKCdDb3VudHJ5OicgKyAnPGJyLz4nICsgKGQuY291bnRyeU5hbWUpKVxuXHR9KVxuXHRcdC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihkKXsgdG9vbHRpcC5zdHlsZSgnZGlzcGxheScsICdub25lJyk7fSk7XG5c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