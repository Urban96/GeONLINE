/*The MIT License (MIT)

Copyright (c) 2019 Morgan Herlocker

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Copyright (c) 2020, Mapbox

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Mapbox GL JS nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


-------------------------------------------------------------------------------

Contains code from glfx.js

Copyright (C) 2011 by Evan Wallace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

--------------------------------------------------------------------------------

Contains a portion of d3-color https://github.com/d3/d3-color

Copyright 2010-2016 Mike Bostock
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the author nor the names of contributors may be used to
  endorse or promote products derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

//Základní definice mapy
mapboxgl.accessToken = 'ENTER YOUR ACCESS TOKEN';
var map = new mapboxgl.Map({
	container: 'map', //Div, ve kterém se vykreslí mapa
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [15.468749999999998, 49.63917719651036], //Počáteční pozice
	zoom: 5 //Zoom level
});

map.addControl(new mapboxgl.FullscreenControl()); //Tlačítko Fullscreen
map.addControl(new mapboxgl.NavigationControl()); //Tlačítka navigace a ovládání mapy

//Tlačítko geolokace
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
  );


//Deklarace globální proměnné, je použita ve více funkcích
var result;


//Funkce, která po kliknutí zobrazí atributy
map.on('click', function(e) {

  var propertiesCheck = document.getElementById("properties-check"); //Hodnota z checkboxu zda uživatel chce vidět atributy

  if (propertiesCheck.checked == true) {
    OpenProperties(); //Zobrazí panel s atributy
    document.getElementById("properties").innerHTML = ""; //Vymaže atributy
    var features = map.queryRenderedFeatures(e.point);
    var displayProperties = [
    'properties'
    ];

    var displayFeatures = features.map(function(feat) {
      var displayFeat = {};
      displayProperties.forEach(function(prop) {
        displayFeat[prop] = feat[prop];
      });
      return displayFeat;
    });

    var properties1 = JSON.stringify(
      displayFeatures,
      null,
      2
      );

    //Rozdělení atributů do řádků
    var sliced1 = properties1.split('"properties": {');
    var sliced2 = sliced1[1].split('}');
    var sliced3 = sliced2[0].split(',');

    if (sliced3[0] == "") {
      document.getElementById('properties').innerHTML = "There are no properties.";
    }

    for(var z = 0; z < sliced3.length; z++) { //Výpis pole s hodnotami do atributového panelu
      document.getElementById('properties').innerHTML += sliced3[z] + "</br>";
    }
  }
});


//Definice globální proměnné pole, do které se budou ukládat data
var toggleableLayerIds = [];

for (var i = 0; i < toggleableLayerIds.length; i++) {
 var id = toggleableLayerIds[i];

 var link = document.createElement('a');
 link.href = '#';
 link.className = 'active';
 link.textContent = id;



//Funkce, která umožňuje vypínat a zapínat aktivní vrstvy
link.onclick = function(e) {
 var clickedLayer = this.textContent;
 e.preventDefault();
 e.stopPropagation();

 var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

 if (visibility === 'visible') {
   map.setLayoutProperty(clickedLayer, 'visibility', 'none');
   this.className = '';
 } else {
   this.className = 'active';
   map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
 }
};

var layers = document.getElementById('layers');
layers.appendChild(link);
}

var uploadedLayers = 1; //Počítadlo vrstev, které jsou nahrány přes Upload

//Upload souboru ve formátu GeoJSON
document.getElementById('import').onclick = function() {
 var files = document.getElementById('selectFiles').files;
  if (document.getElementById('selectFiles').files[0] === undefined) { //Kontrola zda byl vybrán soubor
  	alert("Select a file!");
  }

  var extension = files[0].name.split('.').pop(); //Vrátí příponu souboru

  if (extension !== "geojson") { //Kontrola zda byl vybrán soubor ve formátu GeoJSON
  	alert("Upload the file in geoJSON format!");
  }


  if (files.length <= 0) {
   return false;
 }
 var fr = new FileReader();

 fr.onload = function(e) { 
   result = JSON.parse(e.target.result);
   var formatted = JSON.stringify(result, null, 2);
   var fileName = document.getElementById("file-name").value;



    //Podmínka která zjišťuje, zda uživatel zadal jméno vrstvy. Pokud ne, převezme se název souboru
    if (fileName == "") {
    	fileName = files[0].name + uploadedLayers;

    }
    else {
    	fileName = document.getElementById("file-name").value  + uploadedLayers;
    }

    var editLayer = document.getElementById("edit-layer");

    //Zjistí zda se jedná o bodovou, liniovou nebo polygonovou vrstvu
    if (editLayer.checked == true) {
      if (((result.features[0].geometry.type) == "Point") || ((result.features[0].geometry.type) == "MultiPoint")){
        document.getElementById('upload-point').style.display = 'block';
        document.getElementById('upload-line').style.display = 'none';
        document.getElementById('upload-polygon').style.display = 'none';
        document.getElementById('uploadLayer').style.display = 'block';
      }
      else if (((result.features[0].geometry.type) == "LineString") || ((result.features[0].geometry.type) == "MultiLineString")){
        document.getElementById('upload-point').style.display = 'none';
        document.getElementById('upload-line').style.display = 'block';
        document.getElementById('upload-polygon').style.display = 'none';
        document.getElementById('uploadLayer').style.display = 'block';
      }
      else if (((result.features[0].geometry.type) == "Polygon") || ((result.features[0].geometry.type) == "MultiPolygon")){
        document.getElementById('upload-point').style.display = 'none';
        document.getElementById('upload-line').style.display = 'none';
        document.getElementById('upload-polygon').style.display = 'block';
        document.getElementById('uploadLayer').style.display = 'block';
      }
    }
    else {
      document.getElementById('upload-point').style.display = 'none';
      document.getElementById('upload-line').style.display = 'none';
      document.getElementById('upload-polygon').style.display = 'none';
      document.getElementById('uploadLayer').style.display = 'none';

        //Pokud se jedná o bodovou vrstvu, nahraje se vrstva do mapy s předem definovanou symbologií
        if (((result.features[0].geometry.type) == "Point") || ((result.features[0].geometry.type) == "MultiPoint")){
          map.addLayer({
           'id': fileName,
           'type': 'circle',
           'source': {
             'type': 'geojson',
             'data': result
           },
           'paint': {
             'circle-radius': 6,
             'circle-color': '#B42222'
           },
         });
          document.getElementById('legend-div').innerHTML += "<h4>" + fileName + "</h4></br>";
          document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:6pt;height:6pt; background-color:#B42222; border-radius: 50%; opacity:1; display:inline-block;\"></span></br><hr>";
        }
        //Pokud se jedná o polygonovou vrstvu, nahraje se vrstva do mapy s předem definovanou symbologií
        else if (((result.features[0].geometry.type) == "Polygon") || ((result.features[0].geometry.type) == "MultiPolygon")) {
          map.addLayer({
           'id': fileName,
           'type': 'fill',
           'source': {
             'type': 'geojson',
             'data': result
           },
           'paint': {
            'fill-color': '#f30',
            'fill-opacity': 0.75,
            'fill-outline-color': '#f30'
          },
        });

          document.getElementById('legend-div').innerHTML += "<h4>" + fileName + "</h4></br>";
          document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:#f30; border-style: solid; border-width:1pt; border-color:#f30; opacity:0.75; display:inline-block;\"></span></br><hr>";
        }
        //Pokud se jedná o liniovou vrstvu, nahraje se vrstva do mapy s předem definovanou symbologií
        else if (((result.features[0].geometry.type) == "LineString") || ((result.features[0].geometry.type) == "MultiLineString")) {
          map.addLayer({
           'id': fileName,
           'type': 'line',
           'source': {
             'type': 'geojson',
             'data': result
           },
           'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#888',
            'line-width': 8
          }
        });
          document.getElementById('legend-div').innerHTML += "<h4>" + fileName + "</h4></br>";
          document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:8pt; background-color:#888; opacity:1; display:inline-block;\"></span></br><hr>";
        }

        //Přidá do pole na první indexu název vrstvy, na druhém data z GeoJSON
        toggleableLayerIds.push([fileName,result]);
        
        document.getElementById('no-legend').style.display = 'none'; //Smaže se text s žádnou legendou



        //Inkrementace počítadla
        uploadedLayers = uploadedLayers + 1;

          //Pridani vrstvy do list of layers
          var id = toggleableLayerIds[toggleableLayerIds.length-1][0];

          var link = document.createElement('a');
          link.href = '#';
          link.className = 'active';
          link.textContent = id;

          link.onclick = function(e) {
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');
              this.className = '';
            } else {
              this.className = 'active';
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
          };

          var layers = document.getElementById('layers');
          layers.appendChild(link);
          document.getElementById('no-layers').style.display = 'none';
        }



      }




      fr.readAsText(files.item(0));
  //alert("Vrstva byla nahrana");
};

function UploadLayer () {
  var files = document.getElementById('selectFiles').files;
  if (document.getElementById('selectFiles').files[0] === undefined) { //kontrola zda byl vybran soubor
    alert("Select a file!");
  }

  var extension = files[0].name.split('.').pop(); //vrati priponu souboru

  if (extension !== "geojson") {
    alert("Upload the file in geoJSON format!");
  }


  if (files.length <= 0) {
   return false;
 }
 var fr = new FileReader();

 fr.onload = function(e) { 
   result = JSON.parse(e.target.result);
   var formatted = JSON.stringify(result, null, 2);
   var fileName = document.getElementById("file-name").value;



    //podminka zjistuja zda byl na vstupu zadan nazev vrstvy, pokud ne tak se zapise nazev souboru
    if (fileName == "") {
      fileName = files[0].name + uploadedLayers;

    }
    else {
      fileName = document.getElementById("file-name").value  + uploadedLayers;
    }

    if (((result.features[0].geometry.type) == "Point") || ((result.features[0].geometry.type) == "MultiPoint")){
      var uploadPointColor = document.getElementById("upload-point-color").value;
          var uploadPointOpacity = parseFloat(document.getElementById("upload-point-opacity").value); //nutno Float misto Int
          var uploadPointSize = parseInt(document.getElementById("upload-point-size").value);


          map.addLayer({
           'id': fileName,
           'type': 'circle',
           'source': {
             'type': 'geojson',
             'data': result
           },
           'paint': {
             'circle-radius': uploadPointSize,
             'circle-color': uploadPointColor,
             'circle-opacity': uploadPointOpacity
           },
         });

          document.getElementById('legend-div').innerHTML += "<h4>" + fileName + "</h4></br>";
          document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:"+uploadPointSize+"pt;height:"+uploadPointSize+"pt; background-color:" +  uploadPointColor + "; border-radius: 50%; opacity:" + uploadPointOpacity + "; display:inline-block;\"></span></br><hr>";
          
        }
        else if (((result.features[0].geometry.type) == "LineString") || ((result.features[0].geometry.type) == "MultiLineString")){
         var uploadLineColor = document.getElementById("upload-line-color").value;
         var uploadLineWidth = parseInt(document.getElementById("upload-line-width").value);
         var uploadLineJoin = document.getElementById("upload-line-join").value;
         var uploadLineCap = document.getElementById("upload-line-cap").value;
         var uploadLineOpacity = parseFloat(document.getElementById("upload-line-opacity").value); //nutno Float misto Int

         map.addLayer({
           'id': fileName,
           'type': 'line',
           'source': {
             'type': 'geojson',
             'data': result
           },
           'layout': {
            'line-join': uploadLineJoin,
            'line-cap': uploadLineCap
          },
          'paint': {
            'line-color': uploadLineColor,
            'line-width': uploadLineWidth,
            'line-opacity': uploadLineOpacity
          }
        });

         document.getElementById('legend-div').innerHTML += "<h4>" + fileName + "</h4></br>";
         document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:"+uploadLineWidth+"pt; background-color:" +  uploadLineColor + "; opacity:" + uploadLineOpacity + "; display:inline-block;\"></span></br><hr>";
       }
       else if (((result.features[0].geometry.type) == "Polygon") || ((result.features[0].geometry.type) == "MultiPolygon")){
         var uploadPolygonColor = document.getElementById("upload-polygon-color").value;
           var uploadPolygonOpacity = parseFloat(document.getElementById("upload-polygon-opacity").value); //nutno Float misto Int
           var uploadPolygonOutlineColor = document.getElementById("upload-polygon-outline-color").value;

           map.addLayer({
             'id': fileName,
             'type': 'fill',
             'source': {
               'type': 'geojson',
               'data': result
             },
             'layout': {
                    // "line-join": "round",
                    // "line-cap": "round"
                  },
                  'paint': {
                   'fill-color': uploadPolygonColor,
                   'fill-opacity': uploadPolygonOpacity,
                   'fill-outline-color': uploadPolygonOutlineColor
                 }
               });

           document.getElementById('legend-div').innerHTML += "<h4>" + fileName + "</h4></br>";
           document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  uploadPolygonColor + "; border-style: solid; border-width:1pt; border-color:" + uploadPolygonOutlineColor + "; opacity:" + uploadPolygonOpacity + "; display:inline-block;\"></span></br><hr>";
         }


        //prida do pole na prvnim indexu nazev vrstvy a na druhem data
        toggleableLayerIds.push([fileName,result]);
        document.getElementById('no-legend').style.display = 'none';

        uploadedLayers = uploadedLayers + 1;



          //Přidání vrstvy do List of layers
          var id = toggleableLayerIds[toggleableLayerIds.length-1][0];

          var link = document.createElement('a');
          link.href = '#';
          link.className = 'active';
          link.textContent = id;

          link.onclick = function(e) {
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');
              this.className = '';
            } else {
              this.className = 'active';
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
          };

          var layers = document.getElementById('layers');
          layers.appendChild(link);
          document.getElementById('no-layers').style.display = 'none';
        }

        fr.readAsText(files.item(0));
  //alert("Vrstva byla nahrana");

}


//Funkce vytvoří odkaz na stažení, odkaz v podobě ikony
function DownloadLayer(dataZOperace, nazev) {
 var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataZOperace));

 var a = document.createElement('a');
 a.href = 'data:' + data;
 a.download = nazev + '.geojson';
 a.innerHTML = '<img src="images/download.png" height="24" width="24">';

 var container = document.getElementById('layers');
 container.appendChild(a);
}



//funkce nalezne index na prvni pozici s hledanym vyrazem, abych mohl do funkce vlozit objekt se souradnicemi atd.
function FindByLayer(findLayer) {
 return function(innerArr){
   return innerArr[0] === findLayer
 }
}


var counter = 1; //umoznuje pridat vice vrstev, id se ikrementuje, napr buffer1, buffer2, buffer3 apod, bez tohoto nejde provezt vice analyz!, funguje zatim pouze pro buffer

//Funkce provádějící operace z knihovny Turf.js
function Execute() {
	  var chosenLayer = document.getElementById("selectLayer").value; //vezme se string z   ze select - options
    var chosenSecondLayer = document.getElementById("pointswithinpolygon-selectSecondLayer").value; //vezme se string z formulare ze select - options
	  var a = toggleableLayerIds.findIndex( FindByLayer(chosenLayer) ) //nalezen index prvni pozice s hledanym stringem z formulare
    var b = toggleableLayerIds.findIndex( FindByLayer(chosenSecondLayer) ) //nalezen index prvni pozice s hledanym stringem z formulare

    var arrayLength = toggleableLayerIds.length;


    var choice = document.getElementById("choice").value; 


   //kontrola pokud neni vyplnena vrstva u operace, neplati pro random generaci vrstvy
   if (chosenLayer === "") {
    if ((choice == "randompoints") || (choice == "randomlines") || (choice == "randompolygons")) {

    }
    else {
      alert("No layer was selected");
      return;
    }
  }

	    //zjisti zda bylo zadano jmeno vrstvy, pokud ne tak se vezme jmeno operace jako nazev vrstvy
	    function LayerName(nazev) {
       if (nazev == "") {
        outputName = choice;

      }
      else {

      }
      return outputName
    }
    if (choice === "buffer") {

      var outputName = document.getElementById("buffer-output-name").value;
      LayerName(outputName);
	      var bufferSize = document.getElementById("buffer-size").value;
       var bufferUnit = document.getElementById("buffer-unit").value;
       var bufferColor = document.getElementById("buffer-color").value;
         var bufferOpacity = parseFloat(document.getElementById("buffer-opacity").value); //nutno Float misto Int
         var bufferOutlineColor = document.getElementById("buffer-outline-color").value;

         var buffer = turf.buffer(toggleableLayerIds[a][1], bufferSize, {units: bufferUnit});

         map.addLayer({
          'id': outputName + counter,
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': buffer
          },
          'paint': {
            'fill-color': bufferColor,
            'fill-opacity': bufferOpacity,
            'fill-outline-color': bufferOutlineColor
          }
        });
         toggleableLayerIds.push([outputName + counter,buffer]);

         counter = counter + 1;

         DownloadLayer(buffer, outputName);

         document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
         document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  bufferColor + "; border-style: solid; border-width:1pt; border-color:" + bufferOutlineColor + "; opacity:" + bufferOpacity + "; display:inline-block;\"></span></br><hr>";


       } else if (choice === "voronoi") {
        var outputName = document.getElementById("voronoi-output-name").value;
        LayerName(outputName);
        var voronoiColor = document.getElementById("voronoi-color").value;
      var voronoiOpacity = parseFloat(document.getElementById("voronoi-opacity").value); //nutno Float misto Int
      var voronoiOutlineColor = document.getElementById("voronoi-outline-color").value;
      var voronoiPolygons = turf.voronoi(toggleableLayerIds[a][1]);

      map.addLayer({
        'id': outputName + counter,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': voronoiPolygons
        },
        'layout': {
        // "line-join": "round",
        // "line-cap": "round"
      },
      'paint': {
        'fill-color': voronoiColor,
        'fill-opacity': voronoiOpacity,
        'fill-outline-color': voronoiOutlineColor
      }
    });

      toggleableLayerIds.push([outputName + counter,voronoiPolygons]);

      counter = counter + 1;

      DownloadLayer(voronoiPolygons, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  voronoiColor + "; border-style: solid; border-width:1pt; border-color:" + voronoiOutlineColor + "; opacity:" + voronoiOpacity + "; display:inline-block;\"></span></br><hr>";
    }

    else if (choice === "envelope") {

      var outputName = document.getElementById("envelope-output-name").value;
      LayerName(outputName);
      var envelopeColor = document.getElementById("envelope-color").value;
      var envelopeOpacity = parseFloat(document.getElementById("envelope-opacity").value); //nutno Float misto Int
      var envelopeOutlineColor = document.getElementById("envelope-outline-color").value;
      var enveloped = turf.envelope(toggleableLayerIds[a][1]);

      map.addLayer({
        'id': outputName + counter,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': enveloped
        },
        'layout': {
        // "line-join": "round",
        // "line-cap": "round"
      },
      'paint': {
        'fill-color': envelopeColor,
        'fill-opacity': envelopeOpacity,
        'fill-outline-color': envelopeOutlineColor
      }
    });

      toggleableLayerIds.push([outputName + counter,enveloped]);

      counter = counter + 1;
      DownloadLayer(enveloped, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  envelopeColor + "; border-style: solid; border-width:1pt; border-color:" + envelopeOutlineColor + "; opacity:" + envelopeOpacity + "; display:inline-block;\"></span></br><hr>";
    }


    else if (choice === "area") {


     var area = turf.area(toggleableLayerIds[a][1]);

     var areaUnit = document.getElementById("area-unit").value;
     if (areaUnit == "squarekilometers") {
       alert("Area is: " + (area / 1000000) + " square kilometers");
     }
     else if (areaUnit == "squaremeters") {
      alert("Area is: " + area + " square meters");
    }
  }
  else if (choice === "centroid") {
   var outputName = document.getElementById("centroid-output-name").value;
   LayerName(outputName);
   var centroidSize = parseInt(document.getElementById("centroid-size").value);
   var centroidColor = document.getElementById("centroid-color").value;
   var centroidOpacity = parseFloat(document.getElementById("centroid-opacity").value); //nutno Float misto Int
   var centroid = turf.centroid(toggleableLayerIds[a][1]);

   map.addLayer({
    'id': outputName + counter,
    'type': 'circle',
    'source': {
      'type': 'geojson',
      'data': centroid
    },
    'paint': {
      'circle-radius': centroidSize,
      'circle-color': centroidColor,
      'circle-opacity': centroidOpacity
    },
  });

   toggleableLayerIds.push([outputName + counter,centroid]);

   counter = counter + 1;
      alert("Centroid is at: " + centroid.geometry.coordinates);
      DownloadLayer(centroid, outputName);
      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:"+centroidSize+"pt;height:"+centroidSize+"pt; background-color:" +  centroidColor + "; border-radius: 50%; opacity:" + centroidOpacity + "; display:inline-block;\"></span></br><hr>";
    }
    else if (choice === "simplify") {

      var outputName = document.getElementById("simplify-output-name").value;
      LayerName(outputName);
      var simplifyTolerance = parseFloat(document.getElementById("simplify-tolerance").value);
      var simplifyQuality = document.getElementById("simplify-quality").value;
      var simplifyColor = document.getElementById("simplify-color").value;
      var simplifyOpacity = parseFloat(document.getElementById("simplify-opacity").value); //nutno Float misto Int
      var simplifyOutlineColor = document.getElementById("simplify-outline-color").value;

      var simplified = turf.simplify(toggleableLayerIds[a][1], {tolerance: simplifyTolerance, highQuality: simplifyQuality});

      map.addLayer({
        'id': outputName + counter,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': simplified
        },
        'layout': {
        // "line-join": "round",
        // "line-cap": "round"
      },
      'paint': {
        'fill-color': simplifyColor,
        'fill-opacity': simplifyOpacity,
        'fill-outline-color': simplifyOutlineColor
      }
    });

      toggleableLayerIds.push([outputName + counter,simplified]);

      counter = counter + 1;

      DownloadLayer(simplified, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  simplifyColor + "; border-style: solid; border-width:1pt; border-color:" + simplifyOutlineColor + "; opacity:" + simplifyOpacity + "; display:inline-block;\"></span></br><hr>";

    }


    else if (choice === "length") {


     var lengthUnit = document.getElementById("length-unit").value;
     var length = turf.length(toggleableLayerIds[a][1], {units: lengthUnit});
     document.getElementById("output").innerHTML = ("Length: " + length);
      //length.toFixed(2) --- zaokrouhleni na 2 desetinna mista
      alert("Length is: " + length);
    }
    else if (choice === "linetopolygon") {

      var outputName = document.getElementById("linetopolygon-output-name").value;
      LayerName(outputName);
      var lineToPolygoncolor = document.getElementById("linetopolygon-color").value;
      var lineToPolygonOpacity = parseFloat(document.getElementById("linetopolygon-opacity").value); //nutno Float misto Int
      var lineToPolygonOutlineColor = document.getElementById("linetopolygon-outline-color").value;
      var lineToPolygon = turf.lineToPolygon(toggleableLayerIds[a][1]);

      map.addLayer({
       'id': outputName + counter,
       'type': 'fill',
       'source': {
         'type': 'geojson',
         'data': lineToPolygon
       },
       'layout': {
            // "line-join": "round",
            // "line-cap": "round"
          },
          'paint': {
           'fill-color': lineToPolygonColor,
           'fill-opacity': lineToPolygonOpacity,
           'fill-outline-color': lineToPolygonOutlineColor
         }
       });


      toggleableLayerIds.push([outputName + counter,lineToPolygon]);

      counter = counter + 1;

      DownloadLayer(lineToPolygon, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  lineToPolygonColor + "; border-style: solid; border-width:1pt; border-color:" + lineToPolygonOutlineColor + "; opacity:" + lineToPolygonOpacity + "; display:inline-block;\"></span></br><hr>";
    }
    else if (choice === "explode") {

      var outputName = document.getElementById("explode-output-name").value;
      LayerName(outputName);
      var explodeSize = parseInt(document.getElementById("explode-size").value);
      var explodeColor = document.getElementById("explode-color").value;
      var explodeOpacity = parseFloat(document.getElementById("explode-opacity").value); //nutno Float misto Int
      var explode = turf.explode(toggleableLayerIds[a][1]);

      map.addLayer({
        'id': outputName + counter,
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': explode
        },
        'paint': {
          'circle-radius': explodeSize,
          'circle-color': explodeColor,
          'circle-opacity': explodeOpacity
        },
      });


      toggleableLayerIds.push([outputName + counter,explode]);

      counter = counter + 1;


      DownloadLayer(explode, outputName);
      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:"+explodeSize+"pt;height:"+explodSize+"pt; background-color:" +  explodeColor + "; border-radius: 50%; opacity:" + explodeOpacity + "; display:inline-block;\"></span></br><hr>";

    }

    else if (choice === "pointswithinpolygon") {

     var outputName = document.getElementById("pointswithinpolygon-output-name").value;
     LayerName(outputName);
     var ptsWithinSize = parseInt(document.getElementById("pointswithinpolygon-size").value);
     var ptsWithinColor = document.getElementById("pointswithinpolygon-color").value;
     var ptsWithinOpacity = parseFloat(document.getElementById("pointswithinpolygon-opacity").value);
     var ptsWithin = turf.pointsWithinPolygon(toggleableLayerIds[a][1], toggleableLayerIds[b][1]);

     map.addLayer({
      'id': outputName + counter,
      'type': 'circle',
      'source': {
        'type': 'geojson',
        'data': ptsWithin
      },
      'paint': {
        'circle-radius': ptsWithinSize,
        'circle-color': ptsWithinColor,
        'circle-opacity': ptsWithinOpacity
      },
    });

      toggleableLayerIds.push([outputName + counter,ptsWithin]);

      counter = counter + 1;


      DownloadLayer(ptsWithin, outputName);
      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:"+ptsWithinSize+"pt;height:"+ptsWithinSize+"pt; background-color:" +  ptsWithinColor + "; border-radius: 50%; opacity:" + ptsWithinOpacity + "; display:inline-block;\"></span></br><hr>";

    }

    else if (choice === "tin") {

     var outputName = document.getElementById("tin-output-name").value;
     LayerName(outputName);
     var tinColor = document.getElementById("tin-color").value;
     var tinOutlineColor = document.getElementById("tin-outline-color").value;
     var tinAttribute = document.getElementById("selectAttribute").value;
     var tinopacity = parseFloat(document.getElementById("tin-opacity").value);
     var tin = turf.tin(toggleableLayerIds[a][1], tinAttribute);

     map.addLayer({
       'id': outputName + counter,
       'type': 'fill',
       'source': {
         'type': 'geojson',
         'data': tin
       },
       'layout': {
            // "line-join": "round",
            // "line-cap": "round"
          },
          'paint': {
           'fill-color': tinColor,
           'fill-opacity': tinOpacity,
           'fill-outline-color': tinOutlineColor
         }
       });

      toggleableLayerIds.push([outputName + counter,tin]);

      counter = counter + 1;


      DownloadLayer(tin, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  tinColor + "; border-style: solid; border-width:1pt; border-color:" + tinOutlineColor + "; opacity:" + tinOpacity + "; display:inline-block;\"></span></br><hr>";
    }

    else if (choice === "randompoints") {

     var outputName = document.getElementById("randompoints-output-name").value;
     LayerName(outputName);
     var randomPointsNumber = document.getElementById("randompoints-number").value;
     var randomPointsSize = parseInt(document.getElementById("randompoints-size").value);
     var randomPointsColor = document.getElementById("randompoints-color").value;
   var randomPointsOpacity = parseFloat(document.getElementById("randompoints-opacity").value); //nutno Float misto Int


   var randomPoints = turf.randomPoint(randomPointsNumber);

   map.addLayer({
    'id': outputName + counter,
    'type': 'circle',
    'source': {
      'type': 'geojson',
      'data': randomPoints
    },
    'paint': {
      'circle-radius': randomPointsSize,
      'circle-color': randomPointsColor,
      'circle-opacity': randomPointsOpacity
    },
  });


      toggleableLayerIds.push([outputName + counter,randomPoints]);

      counter = counter + 1;

      DownloadLayer(randomPoints, outputName);
      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:"+randomPointsSize+"pt;height:"+randomPointsSize+"pt; background-color:" +  randomPointsOpacity + "; border-radius: 50%; opacity:" + randomPointsOpacity + "; display:inline-block;\"></span></br><hr>";
    }

    else if (choice === "randomlines") {

     var outputName = document.getElementById("randomlines-output-name").value;
     LayerName(outputName);
     var randomLinesSize = document.getElementById("randomlines-size").value;
     var randomLinesColor = document.getElementById("randomlines-color").value;
     var randomLinesWidth = parseInt(document.getElementById("randomlines-width").value);
     var randomLinesJoin = document.getElementById("randomlines-join").value;
     var randomLinesCap = document.getElementById("randomlines-cap").value;
     var randomLinesVertices = parseInt(document.getElementById("randomlines-vertices").value);
   var randomLinesOpacity = parseFloat(document.getElementById("randomlines-opacity").value); //nutno Float misto Int


   var randomLines = turf.randomLineString(randomLinesSize, {num_vertices: randomLinesVertices})

   map.addLayer({
     'id': outputName + counter,
     'type': 'line',
     'source': {
       'type': 'geojson',
       'data': randomLines
     },
     'layout': {
      'line-join': randomLinesJoin,
      'line-cap': randomLinesCap
    },
    'paint': {
      'line-color': randomLinesColor,
      'line-width': randomLinesWidth,
      'line-opacity': randomLinesOpacity
    }
  });



      toggleableLayerIds.push([outputName + counter,randomLines]);

      counter = counter + 1;


      DownloadLayer(randomLines, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:"+randomLinesWidth+"pt; background-color:" +  
      randomLinesColor + "; opacity:" + randomLinesOpacity + "; display:inline-block;\"></span></br><hr>";
    }

    else if (choice === "randompolygons") {

     var outputName = document.getElementById("randompolygons-output-name").value;
     LayerName(outputName);
     var randomPolygonsSize = document.getElementById("randompolygons-size").value;
     var randomPolygonsColor = document.getElementById("randompolygons-color").value;
   var randomPolygonsOpacity = parseFloat(document.getElementById("randompolygons-opacity").value); //nutno Float misto Int
   var randomPolygonsOutlineColor = document.getElementById("randompolygons-outline-color").value;
   var randomPolygons = turf.randomPolygon(randomPolygonsSize)

   map.addLayer({
     'id': outputName + counter,
     'type': 'fill',
     'source': {
       'type': 'geojson',
       'data': randomPolygons
     },
     'layout': {
            // "line-join": "round",
            // "line-cap": "round"
          },
          'paint': {
           'fill-color': randomPolygonsColor,
           'fill-opacity': randomPolygonsOpacity,
           'fill-outline-color': randomPolygonsOutlineColor
         }
       });


      toggleableLayerIds.push([outputName + counter,randomPolygons]);

      counter = counter + 1;


      DownloadLayer(randomPolygons, outputName);

      document.getElementById('legend-div').innerHTML += "<h4>" + outputName + counter + "</h4></br>";
      document.getElementById('legend-div').innerHTML += "Symbol: <span style=\"width:50px;height:15px; background-color:" +  randomPolygonsColor + "; border-style: solid; border-width:1pt; border-color:" + randomPolygonsOutlineColor + "; opacity:" + randomPolygonsOpacity + "; display:inline-block;\"></span></br><hr>";
    }



    //Přidá poslední prvek z pole do List of layers

    if (arrayLength < toggleableLayerIds.length) {
      var id = toggleableLayerIds[toggleableLayerIds.length-1][0];

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = id;

      link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = '';
        } else {
          this.className = 'active';
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
      };

      var layers = document.getElementById('layers');
      layers.appendChild(link);
      document.getElementById('no-legend').style.display = 'none';
      document.getElementById('no-layers').style.display = 'none';
    }



  }




  function SelectAttribute() { //Funkce hledá atributy k operaci TIN

  var selectAttribute = document.getElementById("selectAttribute"); //Smaže hodnoty v options aby se mohl vytvořit nový seznam
  var length = selectAttribute.options.length;
  for (i = length-1; i >= 0; i--) {
    selectAttribute.options[i] = null;
  }


  //Vrácení všech atributů z dat a uložení do pole listOfProperties
  var selectedLayer = document.getElementById("selectLayer").value;
  var indexOfAttribute = toggleableLayerIds.findIndex( FindByLayer(selectedLayer) ) //nalezen index prvni pozice s hledanym stringem z formulare
  var layerWithAttribute = toggleableLayerIds[indexOfAttribute][1].features[0].properties;
  var listOfProperties = [];
  for (var property in layerWithAttribute) {      
    if (layerWithAttribute.hasOwnProperty(property)) {
      listOfProperties.push(property);
    }
  }

  //Vytvoření options v formuláři s vhodnými vrstvami
  var selectAttribute = document.getElementById("selectAttribute");
  for(var i = 0; i < listOfProperties.length; i++) {
   var opt = listOfProperties[i];
   var el = document.createElement("option");
   el.textContent = opt;
   el.value = opt;
   selectAttribute.appendChild(el);
 }
}




var listOfSuitableLayers = []; // Deklarace pole s vhodnými vrstvami
function SuitableLayer(typ) { //Funkce vybírá vhodné vrstvy pro operaci

  var select = document.getElementById("selectLayer"); //Smaže hodnoty v options aby se mohl vytvořit nový seznam
  var length = select.options.length;
  for (i = length-1; i >= 0; i--) {
    select.options[i] = null;
  }

  listOfSuitableLayers.length = 0; //Vymazání pole z předchozích operací

  for (var m = 0; m < toggleableLayerIds.length; m++) {
    if (typ === "everything") {
      listOfSuitableLayers.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
    }
    else if (typ === "point") {
      if (((toggleableLayerIds[m][1].features[0].geometry.type) == "Point") || ((toggleableLayerIds[m][1].features[0].geometry.type) == "MultiPoint")){
        listOfSuitableLayers.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
      }
    }
    else if (typ === "line") {
      if (((toggleableLayerIds[m][1].features[0].geometry.type) == "LineString") || ((toggleableLayerIds[m][1].features[0].geometry.type) == "MultiLineString") ){
        listOfSuitableLayers.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
      }
    }
    else if (typ === "polygon") {
      if (((toggleableLayerIds[m][1].features[0].geometry.type) == "Polygon") || ((toggleableLayerIds[m][1].features[0].geometry.type) == "MultiPolygon")){
        listOfSuitableLayers.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
      }
    }

  }

  //Vytvoření options v formuláři s vhodnými vrstvami
  var select = document.getElementById("selectLayer");
  for(var i = 0; i < listOfSuitableLayers.length; i++) {
   var opt = listOfSuitableLayers[i][0];
   var el = document.createElement("option");
   el.textContent = opt;
   el.value = opt;
   select.appendChild(el);
 }

}

var listOfSuitableLayers1 = []; // Deklarace pole s vhodnými vrstvami
function SecondSuitableLayer(typ) { //Funkce vybírá vhodné vrstvy pro operaci

  var select1 = document.getElementById("pointswithinpolygon-selectSecondLayer"); //Smaže hodnoty v options aby se mohl vytvořit nový seznam
  var length1 = select1.options.length;
  for (i = length1-1; i >= 0; i--) {
    select1.options[i] = null;
  }
  document.getElementById("pointswithinpolygon-selectSecondLayer").innerHTML = "";
  
  listOfSuitableLayers1.length = 0; //Vymazání pole z předchozích operací

  for (var m = 0; m < toggleableLayerIds.length; m++) {
    if (typ === "everything") {
      listOfSuitableLayers1.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
    }
    else if (typ === "point") {
      if (((toggleableLayerIds[m][1].features[0].geometry.type) == "Point") || ((toggleableLayerIds[m][1].features[0].geometry.type) == "MultiPoint")){
        listOfSuitableLayers1.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
      }
    }
    else if (typ === "line") {
      if (((toggleableLayerIds[m][1].features[0].geometry.type) == "LineString") || ((toggleableLayerIds[m][1].features[0].geometry.type) == "MultiLineString")){
        listOfSuitableLayers1.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
      }
    }
    else if (typ === "polygon") {
      if (((toggleableLayerIds[m][1].features[0].geometry.type) == "Polygon") || ((toggleableLayerIds[m][1].features[0].geometry.type) == "MultiPolygon")){
        listOfSuitableLayers1.push([toggleableLayerIds[m][0],toggleableLayerIds[m][1]]);
      }
    }

  }

  //Vytvoření options v formuláři s vhodnými vrstvami
  var select1 = document.getElementById("pointswithinpolygon-selectSecondLayer");
  for(var i = 0; i < listOfSuitableLayers1.length; i++) {
   var opt1 = listOfSuitableLayers1[i][0];
   var el1 = document.createElement("option");
   el1.textContent = opt1;
   el1.value = opt1;
   select1.appendChild(el1);
 }


}

