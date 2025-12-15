var map = L.map("map2", {
  center: [-0.0234, 109.3267], // Lokasi Makassar
  zoom: 12,
});

// === Basemap ===
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
});

var esriSat = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles © Esri",
  }
);

var cartoLight = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; CartoDB",
  subdomains: "abcd",
  maxZoom: 19,
}).addTo(map);

var topoMap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: "© OpenTopoMap",
});

var baseMaps = {
  OpenStreetMap: osm,
  "Esri World Imagery": esriSat,
  "CartoDB Light": cartoLight,
  OpenTopoMap: topoMap,
};

L.control.layers(baseMaps).addTo(map);

// === Geocoder (Search Box) ===
L.Control.geocoder({
  defaultMarkGeocode: true,
  placeholder: "Cari lokasi...",
  position: "topleft",
}).addTo(map);

// === Marker Kota Makassar ===
L.marker([-0.0234, 109.3267]).addTo(map).bindPopup("Pusat Kota Pontianak").openPopup();

// === Scale Bar ===
L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

// ===== Simbolisasi Marker Faskes =====
const iconKlinikUmum = L.icon({
  iconUrl: "./Aset/IconRS5.png",
  iconSize: [20, 20],
  iconAnchor: [28, 56],
  popupAnchor: [0, -28]
});

const iconKlinikBersalin = L.icon({
  iconUrl: "./Aset/IconRS3.png",
  iconSize: [20, 20],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

const iconRSUmum = L.icon({
  iconUrl: "./Aset/IconRS1.png",
  iconSize: [20, 20],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconRSBersalin = L.icon({
  iconUrl: "./Aset/IconRS2.png",
  iconSize: [20, 20],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconRSJiwa = L.icon({
  iconUrl: "./Aset/IconRS4.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// ===Simbolisasi Transportasi===
const iconBandara = L.icon({
  iconUrl: "./Aset/Bandara.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconTerminal = L.icon({
  iconUrl: "./Aset/Terminal.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconPelabuhan = L.icon({
  iconUrl: "./Aset/Pelabuhan.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// ===== LOAD LAYER DENGAN FETCH =====
let BatasKecamatanLayer = L.layerGroup().addTo(map);
let jalankotaLayer = L.layerGroup().addTo(map);
let jalanLayer = L.layerGroup().addTo(map);
let amenitasLayer = L.layerGroup().addTo(map);
let radiusLayer = L.layerGroup().addTo(map)
let transportasiLayer = L.layerGroup().addTo(map)
let ruteLayer = L.layerGroup().addTo(map)


// === Rute Transportasi =====
// Sublayer
let ruteBandaraLayer = L.layerGroup();
let rutePelabuhanLayer = L.layerGroup();
let ruteJerujuLayer = L.layerGroup();
let ruteRSLayer = L.layerGroup();
let ruteTanhulLayer = L.layerGroup();
let ruteVeteranLayer = L.layerGroup();

function getRuteColor(rem) {
  if (!rem) return "#000";

  const warna = {
    "Rute Bandara": "#e31a1c",
    "Rute Pelabuhan": "#fd8d3c",
    "Rute Jeruju": "#2320d6",
    "Rute RS": "#b37d0a",
    "Rute Tanhul": "#43044b",
    "Rute Veteran": "#2e0409"
  };

  return warna[rem] || "#999999";
}

function loadrute(file, color, targetLayer) {
  fetch(file)
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: color,
          weight: 0.5
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup("Rute");
        }
      }).addTo(targetLayer);
    })
    .catch(err => console.error("Gagal load", file, err));
}

// ===load data===
loadrute("./Data/RuteBandara.geojson", "#e31a1c", ruteBandaraLayer);
loadrute("./Data/RutePelabuhan.geojson", "#fd8d3c", rutePelabuhanLayer);
loadrute("./Data/RuteJeruju.geojson", "#2320d6", ruteJerujuLayer);
loadrute("./Data/RuteRS.geojson", "#b37d0a", ruteRSLayer);
loadrute("./Data/RuteTanhul.geojson", "#43044b", ruteTanhulLayer);
loadrute("./Data/RuteVeteran.geojson", "#2e0409", ruteVeteranLayer);


// ===== Masukan Layer ====
ruteLayer.addLayer(ruteBandaraLayer);
ruteLayer.addLayer(rutePelabuhanLayer);
ruteLayer.addLayer(ruteJerujuLayer);
ruteLayer.addLayer(ruteRSLayer);
ruteLayer.addLayer(ruteTanhulLayer);
ruteLayer.addLayer(ruteVeteranLayer);



// ===Transportasi====
function getTransportasiIcon(jenis) {
  if (jenis === "Bandara") return iconBandara;
  if (jenis === "Terminal") return iconTerminal;
  if (jenis === "Pelabuhan") return iconPelabuhan;
  return iconTerminal; // default
}

fetch("./Data/Transportasi.geojson")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const p = feature.properties;
        const jenis = p.Jenis;

        const popup = `
          <b>${p.Nama || "Transportasi"}</b><br>
          <i>${jenis}</i><br>
          ${p.Kecamatan ? `<b>Kecamatan:</b> ${p.Kecamatan}<br>` : ""}
        `;

        return L.marker(latlng, {
          icon: getTransportasiIcon(jenis)
        }).bindPopup(popup);
      }
    }).addTo(transportasiLayer);
  })
  .catch(err => console.error("Gagal load Transportasi.geojson", err));

// === AMENITAS ===

// ====Sub-Layer====
let KlinikBersalinLayer = L.layerGroup().addTo(amenitasLayer);
let KlinikUmumLayer = L.layerGroup().addTo(amenitasLayer);
let RumahSakitBersalinLayer = L.layerGroup().addTo(amenitasLayer);
let RumahSakitJiwaLayer = L.layerGroup().addTo(amenitasLayer);
let RumahSakitUmumLayer = L.layerGroup().addTo(amenitasLayer);

function getAmenitasIcon(jenis) {
  if (jenis === "Klinik Bersalin") return iconKlinikBersalin;
  if (jenis === "Klinik Umum") return iconKlinikUmum;
  if (jenis === "Rumah Sakit Bersalin") return iconRSBersalin;
  if (jenis === "Rumah Sakit Jiwa") return iconRSJiwa;
  if (jenis === "Rumah Sakit Umum") return iconRSUmum;
  return iconKlinikUmum; // default
}

fetch("./Data/AmenitasRS.geojson")
  .then(res => res.json())
  .then(data => {
    data.features.forEach(feature => {
      const p = feature.properties;
      const latlng = [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      ];

      const jenis = p.Jenis;

      const popup = `
        <b>${p.Nama}</b><br>
        <i>${p.Jenis}</i><br>
        ${p.Alamat ? `<b>Alamat:</b> ${p.Alamat}<br>` : ""}
        ${p.Kecamatan ? `<b>Kecamatan:</b> ${p.Kecamatan}<br>` : ""}
        ${p.JamOp ? `<b>Operasional:</b> ${p.JamOp}<br>` : ""}
      `;

      const marker = L.marker(latlng, {
          icon: getAmenitasIcon(jenis)
      }).bindPopup(popup);

      // MASUKKAN KE LAYER SESUAI JENIS
        if (jenis === "Klinik Bersalin") {
            marker.addTo(KlinikBersalinLayer);

        } else if (jenis === "Klinik Umum") {
          marker.addTo(KlinikUmumLayer);

        } else if (jenis === "Rumah Sakit Bersalin") {
         marker.addTo(RumahSakitBersalinLayer);

        } else if (jenis === "Rumah Sakit Jiwa") {
          marker.addTo(RumahSakitJiwaLayer);

        } else if (jenis === "Rumah Sakit Umum") {
         marker.addTo(RumahSakitUmumLayer);
        }
    });
    // MASUKKAN KE GROUP UTAMA
     amenitasLayer.addLayer(KlinikBersalinLayer);
     amenitasLayer.addLayer(KlinikUmumLayer);
     amenitasLayer.addLayer(RumahSakitBersalinLayer);
     amenitasLayer.addLayer(RumahSakitJiwaLayer);
     amenitasLayer.addLayer(RumahSakitUmumLayer);
    })
  .catch(err => console.error("Gagal load AmenitasRS.geojson", err));
 
 

// === BATAS KECAMATAN ===
fetch("./Data/BatasKecamatan.geojson")
  .then((res) => res.json())
  .then((data) => {
    L.geoJSON(data, {
      style: {
        color: "black",
        weight: 0.6,
        opacity: 0.7,
        fillOpacity: 0,
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup("BatasKecamatan: " + feature.properties.NAME_3);
      },
    }).addTo(BatasKecamatanLayer);
  })
  .catch((err) => console.error("Gagal load BatasKecamatan.geojson", err));

// === RADIUS ===
// Sublayer
let isochrone5Layer = L.layerGroup();
let isochrone10Layer = L.layerGroup();
let isochrone15Layer = L.layerGroup();

function getRadiusColor(Waktu) {
  if (Waktu <= 5) return "#a1d99b";
  else if (Waktu <= 10) return "#41ab5d";
  else if (Waktu <= 15) return "#238b45";
  else return "#005a32";
}

function loadIsochrone(file, waktu, targetLayer) {
  fetch(file)
    .then(res => res.json())
    .then(data => {

      let totalPop = 0;

      // HITUNG TOTAL POPULASI
      data.features.forEach(f => {
        totalPop += Number(f.properties.Total_Pop) || 0;
      });

      L.geoJSON(data, {
        style: {
          color: getRadiusColor(waktu),
          weight: 1,
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <b>Radius Pelayanan</b><br>
            Radius: ${waktu} menit<br>
            Total Populasi: <b>${totalPop.toLocaleString()}</b> orang
          `);
        },
      }).addTo(targetLayer);

    })
    .catch(err => console.error("Gagal load", file, err));
}


// ===load data===
loadIsochrone("./Data/Isochrone5.geojson", 5, isochrone5Layer);
loadIsochrone("./Data/Isochrone10.geojson", 10, isochrone10Layer);
loadIsochrone("./Data/Isochrone15.geojson", 15, isochrone15Layer);

// ===== Masukan Layer ====
radiusLayer.addLayer(isochrone15Layer);
radiusLayer.addLayer(isochrone10Layer);
radiusLayer.addLayer(isochrone5Layer);

// === JALAN BESAR ===
function getJalanColor(rem) {
  switch (rem) {
    case "Jalan Arteri":
      return "#e31a1c";
    case "Jalan Kolektor":
      return "#fd8d3c";
    case "Jalan Tol Dua Jalur Dengan Pemisah Fisik":
      return "#fecc5c";
    default:
      return "#cccccc";
  }
}

fetch("./Data/JalanBesar.geojson")
  .then((res) => res.json())
  .then((data) => {
    L.geoJSON(data, {
      style: (feature) => ({
        color: getJalanColor(feature.properties.REMARK),
        weight: 1,
      }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup("Jalan: " + (feature.properties.REMARK || "Tidak diketahui"));
      },
    }).addTo(jalanLayer);
  })
  .catch((err) => console.error("Gagal load JalanBesar.geojson", err));

  // === JALAN KECIL ===
fetch("./Data/JalanKecil.geojson")
  .then((res) => res.json())
  .then((data) => {
    L.geoJSON(data, {
      style: (feature) => ({
        color: "#47454554",
        weight: 0.5,
      }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup("Jalan: " + (feature.properties.highway|| "Tidak diketahui"));
      },
    }).addTo(jalankotaLayer);
  })
  .catch((err) => console.error("Gagal load JalanBesar.geojson", err));


// ===== Legend =====
const legendControl = L.control({ position: "bottomright" });

legendControl.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");

  div.innerHTML = `
    <h4>Legenda & Layer</h4>
    <b>Fasilitas Kesehatan</b>
    <label><input type="checkbox" id="toggleAmenitas" checked> Semua Fasilitas Kesehatan</label><br>

  <div class="legend-sub">
    <label><input type="checkbox" id="toggleKlinikBersalin" checked> Klinik Bersalin</label><br>
    <label><input type="checkbox" id="toggleKlinikUmum" checked> Klinik Umum</label><br>
    <label><input type="checkbox" id="toggleRumahSakitBersalin" checked> Rumah Sakit Bersalin</label><br>
    <label><input type="checkbox" id="toggleRumahSakitJiwa" checked> Rumah Sakit Jiwa</label><br>
    <label><input type="checkbox" id="toggleRumahSakitUmum" checked> Rumah Sakit Umum</label><br>
  </div>

    <b>Transportasi Umum</b><br>
    <label><input type="checkbox" id="toggleTransportasi" checked> Transportasi Umum</label><br><br>

    <b>Jaringan Jalan</b><br>    
    <label><input type="checkbox" id="toggleJalanBesar" checked> Jaringan Jalan</label><br>
    <label><input type="checkbox" id="togglejalankota" checked> Jaringan Jalan Kota</label><br>

    <b>Rute Jalan</b><br>  
    <label><input type="checkbox" id="toggleBandara" checked> Bandara Supadio</label><br>
    <label><input type="checkbox" id="togglePelabuhan" checked> Pelabuhan Dwikora</label><br>
    <label><input type="checkbox" id="toggleJeruju" checked> Terminal Jeruju</label><br>
    <label><input type="checkbox" id="toggleVeteran" checked> Terminal Veteran</label><br>
    <label><input type="checkbox" id="toggleTanhul" checked> Terminal Tanjung Hulu</label><br>
    <label><input type="checkbox" id="toggleRS" checked> Terminal Soedarso</label><br><br> 
        
    <b>Radius Pelayanan</b><br>
    <label><input type="checkbox" id="toggleIso5" checked> 5 menit</label><br>
    <label><input type="checkbox" id="toggleIso10" checked> 10 menit</label><br>
    <label><input type="checkbox" id="toggleIso15" checked> 15 menit</label><br><br>

    <b>Jenis Jalan</b><br>
    <i style="background:#e31a1c"></i> Arteri<br>
    <i style="background:#fd8d3c"></i> Kolektor<br>
    <i style="background:#fecc5c"></i> Tol<br>
    <i style="background:#cccccc"></i> Lokal<br><br>

    <b>Batas Kecamatan</b><br>
    <label><input type="checkbox" id="toggleBatasKecamatan" checked> Batas Kecamatan</label><br><br>
    `;

  div.style.background = "white";
  div.style.padding = "10px";
  div.style.borderRadius = "4px";
  div.style.fontSize = "12px";
  div.style.boxShadow = "0 0 5px rgba(0,0,0,0.4)";

  return div;
};

legendControl.addTo(map);

// Fungsi toggle layer berdasarkan checkbox

function bindToggle(id, layer) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("change", function () {
    this.checked ? map.addLayer(layer) : map.removeLayer(layer);
  });
}

// ===== PARENT =====
bindToggle("toggleAmenitas", amenitasLayer);
bindToggle("toggleTransportasi", transportasiLayer);
bindToggle("toggleJalanBesar", jalanLayer);
bindToggle("togglejalankota", jalankotaLayer);
bindToggle("toggleBatasKecamatan", BatasKecamatanLayer);

// ===== SUBLAYER AMENITAS =====
bindToggle("toggleKlinikBersalin", KlinikBersalinLayer);
bindToggle("toggleKlinikUmum", KlinikUmumLayer);
bindToggle("toggleRumahSakitBersalin", RumahSakitBersalinLayer);
bindToggle("toggleRumahSakitJiwa", RumahSakitJiwaLayer);
bindToggle("toggleRumahSakitUmum", RumahSakitUmumLayer);

// ===== ISOCHRONE =====
bindToggle("toggleIso5", isochrone5Layer);
bindToggle("toggleIso10", isochrone10Layer);
bindToggle("toggleIso15", isochrone15Layer);

// ===== RUTE =====
bindToggle("toggleBandara", ruteBandaraLayer);
bindToggle("togglePelabuhan", rutePelabuhanLayer);
bindToggle("toggleJeruju", ruteJerujuLayer);
bindToggle("toggleVeteran", ruteVeteranLayer);
bindToggle("toggleTanhul", ruteTanhulLayer);
bindToggle("toggleRS", ruteRSLayer);



document.getElementById("toggleAmenitas").addEventListener("change", function () {
  const checked = this.checked;

  const subs = [
    "toggleKlinikBersalin",
    "toggleKlinikUmum",
    "toggleRumahSakitBersalin",
    "toggleRumahSakitJiwa",
    "toggleRumahSakitUmum"
  ];

  subs.forEach(id => {
    const cb = document.getElementById(id);
    if (cb) cb.checked = checked;
  });
});
