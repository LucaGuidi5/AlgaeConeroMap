let map;
let dati;

function initializeMap(){
  // Inizializza la mappa specificando l'ID dell'elemento HTML che la conterrà
    // Assicurati che l'elemento con id 'mapid' esista nel DOM prima di inizializzare la mappa
    var mapElement = document.getElementById('mapid');
    if (mapElement) {
        map = L.map('mapid').setView([43.617232, 13.534018], 10); 

        // Aggiungi un layer di tile (immagini della mappa) da OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            zIndex: 0
            // L'attributo 'attribution' è importante per rispettare i termini di utilizzo di OpenStreetMap
        }).addTo(map); // Aggiungi il layer alla mappa

        // Aggiungi un marker (opzionale)
        //var marker = L.marker([45.4408, 12.3155]).addTo(map);
        //marker.bindPopup("<b>Benvenuto a Venezia!</b>").openPopup(); // Aggiungi un popup al marker
    } else {
        console.error('Element with id "mapid" not found.  Map cannot be initialized.');
    }
}

async function readData() {
  try {

    fetch('mappa_12mesi.geojson') 
        .then(response => response.json())
        .then(geojsonData => {

            let geojsonLayer = L.geoJSON(geojsonData, {
              style: feature => ({
                color: feature.properties.color,   // bordo
                fillColor: feature.properties.color, // riempimento
                weight: 1,
                fillOpacity: 0.5
              }),
              onEachFeature: (feature, layer) => {

                const imageUrl = "images\\outlier_nspt.png"
                layer.on('click', () => {
                  layer.bindPopup(`
                       <img src="${imageUrl}" alt="Growth image" style="width: 100%; max-width: 300px; margin-top: 10px;" />
                    `).openPopup();
                });
              }
            });

            geojsonLayer.addTo(map);

            overlayLayers["Oysters predicted growth (12 month)"] = geojsonLayer;
            geojsonLayer.addTo(map); 
            updateLayerControl();    
        });
        
  } catch (error) {
      console.error('Error on loading prediction map: ', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initializeMap();

  await readData();
});