# De collectie in kaart brengen

### De opdracht
De opdracht is om een data visualisatie te maken van de database van het Tropen museum. De data visualisatie is statisch en de database word opgehaald met een query. Zo blijft de visualisatie altijd up to date. Het is ook de bedoeling dat we leren om data op te schonen en om functioneel code te schrijven. 

### Het concept 
Voor deze opdracht wil ik de objecten in de collectie letterlijk in kaart brengen. Via locaties wil ik die tonen op een wereldkaart en zo kan je zien waar juist veel of weinig objecten vandaan komen. Ik wil dat elk object een los punt heeft op de kaart zodat de drukte erg gaat opvallen. 

Mijn doelgroep voor dit concept zijn mensen die naar het museum komen en een goede/betere indruk willen krijgen van de hele collectie van het Tropen museum. Toen ik in het Tropen museum rond liep had ik ook echt niet het idee dat zij eigenlijk ontzettend veel objecten bezitten. Daar sta je ook niet snel bij stil en met deze wereldkaart wil ik dat wel bereiken. 

### Het resultaat
Ik heb mij heel erg laten inspireren door ruimte foto's van de aarde. Ik wilde voor deze opdracht dan ook de indruk geven alsof je vanuit de ruimte naar de wereld kijkt en een overzicht ziet van alle objecten en waar ze vandaan komen. 

> foto van het resultaat

### Installatie

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
