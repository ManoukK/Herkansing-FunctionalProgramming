# De collectie in kaart brengen

## De opdracht
De opdracht is om een data visualisatie te maken van de database van het Tropen museum. De data visualisatie is statisch en de database word opgehaald met een query. Zo blijft de visualisatie altijd up to date. Het is ook de bedoeling dat we leren om data op te schonen en om functioneel code te schrijven. 

## Het concept 
Voor deze opdracht wil ik de objecten in de collectie letterlijk in kaart brengen. Via locaties wil ik die tonen op een wereldkaart en zo kan je zien waar juist veel of weinig objecten vandaan komen. Ik wil dat elk object een los punt heeft op de kaart zodat de drukte erg gaat opvallen. 

Mijn doelgroep voor dit concept zijn mensen die naar het museum komen en een goede/betere indruk willen krijgen van de hele collectie van het Tropen museum. Toen ik in het Tropen museum rond liep had ik ook echt niet het idee dat zij eigenlijk ontzettend veel objecten bezitten. Daar sta je ook niet snel bij stil en met deze wereldkaart wil ik dat wel bereiken. 

### Het resultaat
Ik heb mij heel erg laten inspireren door ruimte foto's van de aarde. Ik wilde voor deze opdracht dan ook de indruk geven alsof je vanuit de ruimte naar de wereld kijkt en een overzicht ziet van alle objecten en waar ze vandaan komen. 

![Schermafbeelding 2020-01-28 om 15 13 13](https://user-images.githubusercontent.com/45541885/73271380-c150d000-41e0-11ea-80a9-dbbf727380aa.png)

## Installatie

#### Vizhub
Voor deze opdracht heb ik in vizhub gewerkt (zie de link: https://vizhub.com/ManoukK/10ad4e38a33a4a00ba3c9e610c0727be) Vizhub werkt met een bundle.js die al jouw code omzet naar gescripte code. De bundle.js heb je nodig om gebruik te maken van mijn data visualisatie. Ik raad aan om mijn data visualisatie in vizhub te forken en daarmee verder te werken want lokaal werken met deze code werkt niet omdat de bundle.js zich niet update. 

#### D3.js
Voor de data visualisatie maak ik gebruik van D3.js. Dat kan je installeren met deze script tag:
```js
<script src="https://unpkg.com/d3@5.11.0/dist/d3.min.js"></script>
```
De script tag zet je bovenaan in de head. 

D3.js kan je ook lokaal installeren. Als je dat liever wilt raad ik je aan om naar de site van d3.js te gaan. Daar leggen ze heel goed uit hoe je dit kan doen. 

#### Topojson en geo projection
Voor de wereldkaart maak ik ook gebruik van topojson en de geo projection die in d3 zit. Deze twee elementen moet je met een script tag nog wel installeren voordat je er gebruik van kan maken. Deze twee script tags zet je bovenaan in de head. 
```js
    <script src="https://unpkg.com/topojson@3.0.2/dist/topojson.min.js"></script>
    <script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
```

## De database
De database van het Tropen museum is ontzettend groot. Het bevat alle objecten en foto's die zij in hun collectie hebben zitten. Elk object heeft waardes eraan hangen zoals een foto, land, titel ect. Met deze gegevens is het mogelijk om allerlei soorten data visualisaties te maken. Via sparql is het mogelijk om specifieke objecten uit de database te filteren zodat je bijvoorbeeld alleen objecten toont uit een bepaalt land of zelfs categorie. 

#### Wat heb ik ermee gedaan?
Uit de database had ik eigenlijk alle objecten nodig die een land en een locatie (lat en long waardes) hadden. Ik wilde zoveel mogelijk objecten op de kaart laten zien waardoor ik niet veel wilde filteren. Ik had eerst in gedachte om ook foto's te tonen maar als ik dat zou doen betekende het dat er nog minder objecten op de kaart te zien waren dus heb ik het hierbij gelaten. De continenten had ik als waarde niet nodig omdat mijn D3 code kijkt naar de landen en de lat en long waardes. 

### De query die ik heb gebruikt
Via sparql heb ik een query gebruikt die de lat en long ophaald en de land namen van alle objecten. Voor de query en heb je een aantal standaard prefixes nodig om errors te voorkomen. Als je wilt kan je er een limit op geven van het aantal objecten wat opgehaald worden uit de database maar ik heb er voor gekozen om dit niet te doen. 
```js
`PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
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
```

Je hebt ook een endpoint nodig. Dit ik die ik heb gebruikt: 
```js
const endpoint = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-13/sparql'
```

Als je de data voor het eerst binnen krijgt is het nog moeilijk om bij de values te komen van de items. De array ziet er dan ook zo uit. Om dan bij de values te komen moet je langere code schrijven wat op den duur heel irritant kan worden. Je moet dan elke keer .value aangeven omdat je die nodig hebt en niet bijvoorbeeld de type. 

![Schermafbeelding 2020-01-27 om 11 26 12](https://user-images.githubusercontent.com/45541885/73269013-48e81000-41dc-11ea-886b-457d11d16688.png)

Door dit stukje code te schrijven als je de data inlaad zorg je ervoor dat je de data "opschoont" en dat je veel sneller bij de values kan dan als je dat niet doet. Door Number ervoor te schrijven zorg je er ook gelijk voor dat de values nummers worden in plaats van strings. 
```js
 .then(results => {
    console.log(results)
    		results.map(result => {
    			result.lat = Number(result.lat.value)
    			result.long = Number(result.long.value)
    			result.countryName = result.landLabel.value
    }) 
```

Nu ziet de array met de items er zo uit. Je ziet dat de values, die eerst "verstopt" zaten, nu gelijk achter de keys staan van het item. 

![Schermafbeelding 2020-01-27 om 10 55 28](https://user-images.githubusercontent.com/45541885/73269587-65387c80-41dd-11ea-98ba-88768d273ccc.png)

## Features 
- [x] Elk land heeft zijn eigen kleur zodat je onderscheid kan maken tussen de landen
- [x] Een tooltip die bij elk object aangeeft uit welk land dat komt
- [ ] Het zou nog heel cool zijn als je de wereldbol kan draaien of dat het langzaam zelf draait 
- [ ] Het zou ook nog heel gaaf zijn als je een foto ziet van het object (maar hoe veel objecten hou je op de kaart dan over?)

## Documentatie (wiki linkjes) 
- Wat ik moet herkansen: https://github.com/ManoukK/Herkansing-FunctionalProgramming/wiki/Wat-moet-ik-herkansen%3F
- Mijn proces: https://github.com/ManoukK/Herkansing-FunctionalProgramming/wiki/Mijn-proces
- De code in detail: https://github.com/ManoukK/Herkansing-FunctionalProgramming/wiki/De-code-in-detail
- Reflectie: https://github.com/ManoukK/Herkansing-FunctionalProgramming/wiki/Reflectie

#### Documentatie wat de vorige keer al goed was en wat ik dus niet hoefde te herkansen 
- Fucntional programming: https://github.com/ManoukK/functional-programming/wiki/Functional-programming
- Data opschonen: https://github.com/ManoukK/functional-programming/wiki/Data-opschonen

## Bronnenlijst 
- De basis wereldkaart code: https://www.youtube.com/watch?v=Qw6uAg3EO64
- De wereldkaart vorm: https://github.com/d3/d3-geo-projection
- Kleuren template: https://observablehq.com/@d3/color-schemes
- De tooltip: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
- Code functioneel schrijven: https://vizhub.com/Razpudding/6b3c5d10edba4c86babf4b6bc204c5f0?edit=files&file=index.js

## Credits 
- Laurens had een soortgelijk concept gemaakt en daar heb ik qua functioneel schrijven veel aan gehad 
- Curran die heel duidelijk in een filmpje liet zien hoe je een basis wereldkaart moet maken in d3.js
- Ik heb ook veel gehad aan oude projecten en codes die ik heb geschreven in d3.js 

