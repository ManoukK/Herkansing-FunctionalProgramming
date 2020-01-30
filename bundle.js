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
  const tooltip = d3$1.select('body').append('div').attr('class', 'toolTip');
  const color = colorPalette();

  //code van Laurens uit zijn vizhub wereldkaart: //https://vizhub.com/Razpudding/b42c2072180348658542212b91614b82
  //ook gebruikt voor mijn bar chart https://vizhub.com/ManoukK/c5757c39fd744066aa64668b02a92785?edit=files&file=index.js&mode=full
  function colorPalette() {
  		return d3$1.scaleOrdinal(d3$1.schemeRdPu[9])
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
      console.log(countries);
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
  		.on('mouseout', function(d){ 
      		tooltip
          .style('display', 'none');});
  	});
  }

}(d3, topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEJyb246IGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9UXc2dUFnM0VPNjRcbi8vIEJyb246IGh0dHBzOi8vdml6aHViLmNvbS9SYXpwdWRkaW5nLzZiM2M1ZDEwZWRiYTRjODZiYWJmNGI2YmMyMDRjNWYwP2VkaXQ9ZmlsZXMmZmlsZT1pbmRleC5qc1xuXG5pbXBvcnQgeyBzZWxlY3QsIFxuICAgICAgICBqc29uLCBcbiAgICAgICAgZ2VvUGF0aCwgXG4gICAgICAgIGdlb0dpbGJlcnQsXG4gICAgICAgIHNjYWxlT3JkaW5hbCxcbiAgICAgICAgc2NoZW1lUmRQdVxuICAgICAgIH0gZnJvbSAnZDMnO1xuXG4vL2ZlYXR1cmUgemV0IHRvcG9qc29uIG9tIG5hYXIgZ2VvanNvblxuaW1wb3J0IHsgZmVhdHVyZSB9IGZyb20gJ3RvcG9qc29uJztcblxuY29uc3QgcXVlcnkgPSBgUFJFRklYIHdnczg0OiA8aHR0cDovL3d3dy53My5vcmcvMjAwMy8wMS9nZW8vd2dzODRfcG9zIz5cblx0UFJFRklYIGdlbzogPGh0dHA6Ly93d3cub3Blbmdpcy5uZXQvb250L2dlb3NwYXJxbCM+XG5cdFBSRUZJWCBza29zOiA8aHR0cDovL3d3dy53My5vcmcvMjAwNC8wMi9za29zL2NvcmUjPlxuXHRQUkVGSVggZ246IDxodHRwOi8vd3d3Lmdlb25hbWVzLm9yZy9vbnRvbG9neSM+XG5cdFBSRUZJWCByZGY6IDxodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjPlxuXHRQUkVGSVggcmRmczogPGh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSM+XG5cblx0U0VMRUNUID9sYXQgP2xvbmcgP2xhbmRMYWJlbCBXSEVSRSB7XG4gXHRcdD9zdmNuIHNrb3M6ZXhhY3RNYXRjaC93Z3M4NDpsYXQgP2xhdCAuXG4gXHRcdD9zdmNuIHNrb3M6ZXhhY3RNYXRjaC93Z3M4NDpsb25nID9sb25nIC5cbiBcdFx0P3N2Y24gc2tvczpleGFjdE1hdGNoL2duOnBhcmVudENvdW50cnkgP2xhbmQgLlxuIFx0XHQ/bGFuZCBnbjpuYW1lID9sYW5kTGFiZWwgLlxufWA7XG5cbmNvbnN0IGVuZHBvaW50ID0gJ2h0dHBzOi8vYXBpLmRhdGEubmV0d2Vya2RpZ2l0YWFsZXJmZ29lZC5ubC9kYXRhc2V0cy9pdm8vTk1WVy9zZXJ2aWNlcy9OTVZXLTEzL3NwYXJxbCc7XG5cbmNvbnN0IHN2ZyA9IHNlbGVjdCgnc3ZnJyk7XG5jb25zdCBjaXJjbGVTaXplID0gMjtcblxuLy9zb29ydCBrYWFydCBnZXZvbmRlbiBvcDogaHR0cHM6Ly9naXRodWIuY29tL2QzL2QzLWdlby1wcm9qZWN0aW9uXG5jb25zdCBwcm9qZWN0aW9uID0gZ2VvR2lsYmVydCgpO1xuLy9oaWVyIHN0b3AgamUgZGUgcHJvamVjdGlvbiBpbiB2YW4gaGllcmJvdmVuIHpvZGF0IGhldCB3ZWVyIHdlbGtlIHZvcm0gaGV0IG1vZXQga3JpamdlblxuY29uc3QgcGF0aEdlbmVyYXRvciA9IGdlb1BhdGgoKS5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG4vL2Jyb24gdG9vbHRpcDogaHR0cHM6Ly9ibC5vY2tzLm9yZy9hbGFuZHVubmluZy8yNzRiZjI0OGZkMGYzNjJkNjQ2NzQ5MjBlODVjMWViN1xuY29uc3QgdG9vbHRpcCA9IHNlbGVjdCgnYm9keScpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbFRpcCcpO1xuY29uc3QgY29sb3IgPSBjb2xvclBhbGV0dGUoKTtcblxuLy9jb2RlIHZhbiBMYXVyZW5zIHVpdCB6aWpuIHZpemh1YiB3ZXJlbGRrYWFydDogLy9odHRwczovL3Zpemh1Yi5jb20vUmF6cHVkZGluZy9iNDJjMjA3MjE4MDM0ODY1ODU0MjIxMmI5MTYxNGI4MlxuLy9vb2sgZ2VicnVpa3Qgdm9vciBtaWpuIGJhciBjaGFydCBodHRwczovL3Zpemh1Yi5jb20vTWFub3VrSy9jNTc1N2MzOWZkNzQ0MDY2YWE2NDY2OGIwMmE5Mjc4NT9lZGl0PWZpbGVzJmZpbGU9aW5kZXguanMmbW9kZT1mdWxsXG5mdW5jdGlvbiBjb2xvclBhbGV0dGUoKSB7XG5cdFx0cmV0dXJuIHNjYWxlT3JkaW5hbChzY2hlbWVSZFB1WzldKVxufTtcblxuc2V0dXBXb3JsZE1hcCgpO1xubWFrZVdvcmxkTWFwKCk7XG5tYWtlQ2lyY2xlcygpO1xuXG4vL2RpdCB6b3JndCBlcnZvb3IgZGF0IGhldCBkZSBjdXJ2ZXMga3Jpamd0IGRpZSBqZSB3aWx0IGlwdiByZWNodCBpbiBoZXQgaGVsZSBzY2hlcm1cbmZ1bmN0aW9uIHNldHVwV29ybGRNYXAoKXtcbiAgc3ZnXG4gICAgLmFwcGVuZCgncGF0aCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ3NwaGVyZScpXG4gICAgLmF0dHIoJ2QnLCBwYXRoR2VuZXJhdG9yKHsgdHlwZTogJ1NwaGVyZScgfSkpO1xufTtcblxuZnVuY3Rpb24gbWFrZVdvcmxkTWFwKCkge1xuICAvL01ldCBkZXplIGxpbmsgd29yZGVuIGRlIGxhbmRlbiBnZW1hYWt0IChoZXQgaXMgZWVuIG5wbSBwYWNrYWdlKVxuICBkMy5qc29uKCdodHRwczovL3VucGtnLmNvbS93b3JsZC1hdGxhc0AxLjEuNC93b3JsZC8xMTBtLmpzb24nKVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiZGF0YSB1aXQgZGUgd29ybGQgYXRsYXMgbGliYXJ5OlwiLCBkYXRhKVxuICAgIC8vRGUgbGFuZGVuIHdpbCBqZSBvcCBkZSBrYWFydCB6aWVuIGRhdCBkb2UgamUgZG9vciBlZXJzdCBkZSBsYW5kZW4gZXJ1aXQgdGUgaGFsZW4gXG4gICAgLy9kaWUgXCJ2ZXJzdG9wdFwiIHppdHRlbiBpbiBkYXRhLm9iamVjdHMuY291bnRyaWVzIFxuICAgIC8vaGllciByb2VwIGplIGRlIGZlYXR1cmUgYWFuIG1ldCB0d2VlIHBhcmFtZXRlcnNcbiAgICBjb25zdCBjb3VudHJpZXMgPSBmZWF0dXJlKGRhdGEsIGRhdGEub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIGNvbnNvbGUubG9nKGNvdW50cmllcyk7XG4gICAgLy9udSB3b3JkIHZvb3IgZWxrIGxhbmQgaW4gZGUgYXJyYXkgZWVuIHBhZC92b3JtIGFhbmdlbWFha3QgXG4gICAgc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdjb3VudHJ5JylcbiAgICAgIC5hdHRyKCdkJywgcGF0aEdlbmVyYXRvcik7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gbWFrZUNpcmNsZXMoKSB7ICBcbiAgZmV0Y2goZW5kcG9pbnQgK1wiP3F1ZXJ5PVwiKyBlbmNvZGVVUklDb21wb25lbnQocXVlcnkpICsgXCImZm9ybWF0PWpzb25cIilcbiAgICAudGhlbihkYXRhID0+IGRhdGEuanNvbigpKVxuICBcdC50aGVuKGpzb24gPT4ganNvbi5yZXN1bHRzLmJpbmRpbmdzKVxuICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpXG4gICAgXHRcdHJlc3VsdHMubWFwKHJlc3VsdCA9PiB7XG4gICAgXHRcdFx0cmVzdWx0LmxhdCA9IE51bWJlcihyZXN1bHQubGF0LnZhbHVlKVxuICAgIFx0XHRcdHJlc3VsdC5sb25nID0gTnVtYmVyKHJlc3VsdC5sb25nLnZhbHVlKVxuICAgIFx0XHRcdHJlc3VsdC5jb3VudHJ5TmFtZSA9IHJlc3VsdC5sYW5kTGFiZWwudmFsdWVcbiAgICB9KTsgXG4gICAgXG5cdHN2Z1xuXHRcdC5zZWxlY3RBbGwoJ2NpcmNsZScpXG5cdFx0LmRhdGEocmVzdWx0cylcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ2NpcmNsZScpXG5cdFx0LmF0dHIoJ2NsYXNzJywgJ2NpcmNsZXMnKVxuXHRcdC5hdHRyKCdjeCcsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdHJldHVybiBwcm9qZWN0aW9uKFtkLmxvbmcsIGQubGF0XSlbMF1cblx0XHR9KVxuXHRcdC5hdHRyKCdjeScsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdHJldHVybiBwcm9qZWN0aW9uKFtkLmxvbmcsIGQubGF0XSlbMV1cblx0XHR9KVxuXHRcdC5hdHRyKCdyJywgY2lyY2xlU2l6ZSsncHgnKVxuXHRcdC5zdHlsZSgnZmlsbCcsIGQgPT4gY29sb3IoZC5jb3VudHJ5TmFtZSkpXG5cdFx0Lm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbihkKXtcblx0XHRcdHRvb2x0aXBcblx0XHRcdC8vemV0IGhldCBpbiBoZXQgbWlkZGVuIHZhbiB3YWFyIGRlIG11aXMgaXNcblx0XHRcdC5zdHlsZSgnbGVmdCcsIGQzLmV2ZW50LnBhZ2VYIC0gNTAgKyAncHgnKVxuXHRcdFx0Ly9kZSBob29ndGUgdmFuIHdhYXIgaGV0IGJvdmVuIGRlIG11aXMgendlZWZ0IGdlcmVrZW5kIHZhbmFmIGhldCBtaWRkZW4gdmFuIGRlIHBvcHVwXG5cdFx0XHQuc3R5bGUoJ3RvcCcsIGQzLmV2ZW50LnBhZ2VZIC0gNzAgKyAncHgnKVxuXHRcdFx0Ly9oZXQgbW9ldCBpbmxpbmUgYmxvY2sgemlqbiBvbWRhdCBqZSBlciB6byB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zIGVuIHBhZGRpbmdzIGFhbiBcblx0XHRcdC8va2FuIGdldmVuIGVuIGhldCBuZWVtdCBnZWVuIHJ1aW10ZSBpbiBiZXNsYWcgem9hbHMgYmxvY2sgZGF0IHdlbCBkb2V0LiBcblx0XHRcdC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpXG5cdFx0XHQvL3Rla3N0IGluIGhldCBibG9ramVcblx0XHRcdC5odG1sKCdDb3VudHJ5OicgKyAnPGJyLz4nICsgKGQuY291bnRyeU5hbWUpKVxuXHR9KVxuXHRcdC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihkKXsgXG4gICAgXHRcdHRvb2x0aXBcbiAgICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTt9KTtcblx0fSk7XG59OyJdLCJuYW1lcyI6WyJzZWxlY3QiLCJnZW9HaWxiZXJ0IiwiZ2VvUGF0aCIsInNjYWxlT3JkaW5hbCIsInNjaGVtZVJkUHUiLCJmZWF0dXJlIl0sIm1hcHBpbmdzIjoiOzs7RUFBQTs7RUFjQSxNQUFNLEtBQUssR0FBRyxDQUFDOzs7Ozs7Ozs7Ozs7Q0FZZCxDQUFDLENBQUM7O0VBRUgsTUFBTSxRQUFRLEdBQUcsc0ZBQXNGLENBQUM7O0VBRXhHLE1BQU0sR0FBRyxHQUFHQSxXQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDMUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDOzs7RUFHckIsTUFBTSxVQUFVLEdBQUdDLGVBQVUsRUFBRSxDQUFDOztFQUVoQyxNQUFNLGFBQWEsR0FBR0MsWUFBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7RUFHdkQsTUFBTSxPQUFPLEdBQUdGLFdBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztFQUN0RSxNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQzs7OztFQUk3QixTQUFTLFlBQVksR0FBRztJQUN0QixPQUFPRyxpQkFBWSxDQUFDQyxlQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7O0VBR3BDLGFBQWEsRUFBRSxDQUFDO0VBQ2hCLFlBQVksRUFBRSxDQUFDO0VBQ2YsV0FBVyxFQUFFLENBQUM7OztFQUdkLFNBQVMsYUFBYSxFQUFFO0lBQ3RCLEdBQUc7T0FDQSxNQUFNLENBQUMsTUFBTSxDQUFDO09BQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7T0FDdkIsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOztFQUdsRCxTQUFTLFlBQVksR0FBRzs7SUFFdEIsRUFBRSxDQUFDLElBQUksQ0FBQyxxREFBcUQsQ0FBQztPQUMzRCxJQUFJLENBQUMsSUFB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