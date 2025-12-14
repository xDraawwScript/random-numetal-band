<script setup>
import { ref, onMounted } from 'vue'; 

const band = ref(null)
const checkedBands = ref([]) 
const loading = ref(false)

const filters = ref({
  country: '',
  year: '',
  spotify: '',
})

const fetchRandomBand = async () => {
  loading.value = true;
  try {
    // pour l'instant je fais des boucles, mais à l'avenir je rajoute à une table dans la BDD les groupes déjà cochés pour éviter de les récupérer
    let foundNew = false;
    let attempts = 0;

    while (!foundNew&&attempts<10) {
      const response=await fetch('http://localhost:3000/bands');
      const data=await response.json();
      const candidate=data[0]; 
      const alreadyChecked=checkedBands.value.find(b => b.id===candidate.id || b.band_name===candidate.band_name);

      if (!alreadyChecked) {
        band.value=candidate;
        foundNew=true;
      }attempts++;}

    if (!foundNew) {
      console.warn("pas de nouveau groupe trouvé après plusieurs tentatives");
    }
  } catch (error) {
    console.error("erreur de chargement :", error)
  } finally {
    loading.value = false;
  }
}

const markAsListened = () => {
  if (band.value) {
    checkedBands.value.push(band.value);
    fetchRandomBand();
  }
}

const removeFromHistory = (itemToRemove) => {
  checkedBands.value = checkedBands.value.filter(b => b.band_name !== itemToRemove.band_name);
}

const getSmartLink = (type, rawLink, bandName) => {
  if (!rawLink || rawLink === '-' || rawLink === '') return null;
  const cleanLink = rawLink.trim();
  const invalVal = ['-','?','','N/A','null','undefined'];
  if (invalVal.includes(cleanLink)) return null;
  
  const query = encodeURIComponent(bandName);
  if (type === 'spotify') {
    if (cleanLink === 'SPOT') return `https://open.spotify.com/search/${query}`;
    if (cleanLink.startsWith('http')) return cleanLink;
    return null;
  }
  if (type === 'discogs') {
    if (cleanLink === 'DISC' || cleanLink === 'X') return `https://www.discogs.com/search/?q=${query}&type=artist`;
    if (cleanLink.startsWith('http')) return cleanLink;
    return null;
  }
  return null;
}

onMounted(() => {
  fetchRandomBand();
});
</script>

<template>
  <div class="main-layout">
    
    <aside class="sidebar left-panel">
      <h3>// FILTRES</h3>
      <div class="filter-group">
        <label>Pays</label>
        <input type="text" v-model="filters.country" placeholder="ex: USA" class="retro-input">
      </div>
      <div class="filter-group">
        <label>Année min.</label>
        <input type="number" v-model="filters.year" placeholder="ex: 1998" class="retro-input">
      </div>
      <div class="filter-group">
        <label>a un spotify</label>
        <input type="checkbox" v-model="filters.hasSpotify">
      </div> <div class="filter-group">
        <button class="btn-reload" @click="fetchRandomBand">Appliquer</button>
      </div>
      <div class="filter-note">
        <small>* pas encore fonctionnel</small>
      </div>
    </aside>

    <main class="center-stage">
      <h1>Nu Metal random band</h1>

      <div v-if="loading" class="loading-state">chargement</div>

      <div v-else-if="band" class="band-card">
        <header>
          <h2>{{ band.band_name }}</h2>
          <div class="subtitle">
            <span class="flag">{{ band.country }}</span>
            <span v-if="band.formed_year"> // {{ band.formed_year }}</span>
          </div>
        </header>
        
        <hr>

        <div class="specs">
          <div class="spec-item"><strong>Chant Fem:</strong> {{ band.female_vocals }}</div>
          <div class="spec-item"><strong>DJ/Scratch:</strong> {{ band.turntables }}</div>
          <div class="spec-item"><strong>Electro:</strong> {{ band.electronics }}</div>
        </div>

        <div class="info-block" v-if="band.for_fans_of">
          <h3>pour les fans de :</h3>
          <p>{{ band.for_fans_of }}</p>
        </div>

        <div class="links">
          <a v-if="getSmartLink('spotify', band.spotify_link, band.band_name)" 
             :href="getSmartLink('spotify', band.spotify_link, band.band_name)" 
             target="_blank" class="btn spotify">Spotify</a>
          <a v-if="getSmartLink('discogs', band.discogs_link, band.band_name)" 
             :href="getSmartLink('discogs', band.discogs_link, band.band_name)" 
             target="_blank" class="btn discogs">Discogs</a>
        </div>

        <div class="actions">
          <button @click="fetchRandomBand" class="btn-action skip">Passer</button>
          <button @click="markAsListened" class="btn-action check">Écouté </button>
        </div>
      </div>
    </main>

    <aside class="sidebar right-panel">
      <h3>// CHECK LIST ({{ checkedBands.length }})</h3>
      <div class="history-list">
        <div v-if="checkedBands.length === 0" class="empty-msg">Aucun groupe validé.</div>
        
        <div v-for="(item, index) in checkedBands" :key="index" class="history-item">
          <span class="hist-name">{{ item.band_name }}</span>
          <button @click="removeFromHistory(item)" class="btn-remove">X</button>
        </div>
      </div>
    </aside>

  </div>
</template>

<style>
/* RESET & GLOBAL */
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Share+Tech+Mono&display=swap');

body {
  margin: 0 !important;
  padding: 0 !important;
  background-color: #000;
  color: #e0e0e0;
  overflow: hidden; /* Empêche le scroll global */
  width: 100vw;
  height: 100vh;
}
*, *::before, *::after { box-sizing: border-box; }

/* Scrollbars */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #111; }
::-webkit-scrollbar-thumb { background: #d32f2f; }
</style>

<style scoped>
/* --- GRILLE MAITRESSE (LE FIX EST ICI) --- */
.main-layout {
  display: grid;
  /* Utilisation de VW pour être sûr que ça fait 100% de l'écran */
  grid-template-columns: 20vw 50vw 30vw; 
  height: 100vh;
  width: 100vw;
  font-family: 'Share Tech Mono', monospace;
}

/* --- SIDEBARS --- */
.sidebar {
  background: #050505;
  border-right: 1px solid #222;
  border-left: 1px solid #222;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}
.left-panel { border-left: none; border-right: 1px solid #333; }
.right-panel { border-right: none; border-left: 1px solid #333; }

.sidebar h3 {
  color: #d32f2f;
  margin-top: 0;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 10px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 1px;
}

/* --- CENTRE --- */
.center-stage {
  /* Pas de padding, on colle aux bords */
  padding: 0;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}

.loading-state {
  display: flex; justify-content: center; align-items: center; height: 100%;
  color: #d32f2f; font-size: 2rem; animation: pulse 1s infinite;
}

/* --- CARTE PLEIN ÉCRAN --- */
.band-card {
  width: 100%;  /* FORCE LA LARGEUR TOTALE DE LA COLONNE */
  height: 100%; /* FORCE LA HAUTEUR TOTALE */
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  border: none; /* Plus besoin de bordure, c'est les sidebars qui font la limite */
}

/* Haut de carte */
.card-top {
  padding: 30px;
  border-bottom: 1px solid #222;
  background: radial-gradient(circle at top, #151515, #0a0a0a);
}

.app-title {
  font-family: 'Oswald', sans-serif;
  color: #444;
  font-size: 1rem;
  letter-spacing: 4px;
  margin: 0 0 20px 0;
  text-align: center;
}

header h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 5rem; /* TRES GROS */
  margin: 0;
  color: #fff;
  line-height: 0.9;
  text-transform: uppercase;
  text-align: center;
}
.subtitle { color: #d32f2f; font-weight: bold; font-size: 1.5rem; text-align: center; margin-top: 10px; }

/* Specs stylées */
.specs {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}
.spec-item { text-align: center; }
.spec-item strong { display: block; color: #666; font-size: 0.8rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;}
.spec-item span { font-size: 1.2rem; color: #fff; }

/* Milieu de carte (Contenu flexible) */
.card-middle {
  flex-grow: 1; /* C'est cette partie qui va s'étirer pour remplir le vide */
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: repeating-linear-gradient(45deg, #0d0d0d 0, #0d0d0d 1px, transparent 0, transparent 50%);
  background-size: 10px 10px;
}

.info-block { text-align: center; max-width: 80%; }
.info-block h3 { color: #d32f2f; font-size: 1.2rem; margin-bottom: 15px; text-transform: uppercase; }
.ffo-text { font-size: 1.5rem; color: #eee; line-height: 1.4; }

/* Bas de carte */
.card-bottom {
  background: #080808;
  border-top: 1px solid #222;
}

.links { display: flex; height: 60px; }
.btn {
  flex: 1; display: flex; align-items: center; justify-content: center;
  text-transform: uppercase; font-weight: bold; font-family: 'Oswald', sans-serif; font-size: 1.2rem;
  color: #fff; text-decoration: none; transition: 0.2s;
  border-right: 1px solid #222;
}
.btn:last-child { border-right: none; }
.spotify:hover { background: #1db954; color: #000; }
.discogs:hover { background: #fff; color: #000; }

.actions { display: flex; height: 80px; border-top: 1px solid #222; }
.btn-action {
  flex: 1; border: none; font-family: 'Oswald', sans-serif;
  font-size: 1.5rem; text-transform: uppercase; cursor: pointer; transition: 0.2s;
}
.skip { background: #111; color: #666; }
.skip:hover { background: #222; color: #fff; }
.check { background: #d32f2f; color: #fff; }
.check:hover { background: #b71c1c; }

/* COMPOSANTS SIDEBAR */
.filter-group { margin-bottom: 20px; }
.filter-group label { display: block; color: #666; font-size: 0.8rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
.retro-input { width: 100%; background: #000; border: 1px solid #444; color: #fff; padding: 12px; font-size: 1rem; }
.retro-input:focus { border-color: #d32f2f; outline: none; }

.btn-reload { 
  width: 100%; padding: 15px; background: #222; color: #fff; border: 1px solid #444; 
  cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 1.2rem; margin-top: 10px;
}
.btn-reload:hover { background: #333; border-color: #d32f2f; color: #d32f2f; }

.history-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #222; font-size: 1rem; }
.btn-remove { background: none; border: none; color: #444; cursor: pointer; padding: 5px; font-size: 1.2rem; margin-right: 25px;}
.btn-remove:hover { color: #d32f2f; }

@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

/* Responsive minimal pour mobile (empilement) */
@media (max-width: 1024px) {
  .main-layout { display: block; overflow-y: auto; height: auto; }
  .sidebar { width: 100%; height: auto; border: none; padding: 30px; }
  .center-stage { height: auto; min-height: 80vh; }
  .band-card { height: auto; }
  header h2 { font-size: 3rem; }
}
</style>