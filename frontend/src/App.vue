<script setup>
import { ref, onMounted } from 'vue'; 
</script>

<template>
  <div class="container">
    <header>
      <h1>Random Band</h1>
      <p>Liste des groupes de A à Z</p>
    </header>

    <main>
      <div v-if="loading">Chargement des données...</div>

      <div v-if="error" class="error">Erreur : {{ error }}</div>

      <ul v-else class="band-list">
        <li v-for="band in bands" :key="band.id" class="band-item">
          <h2>{{ band.band_name }}</h2>
          <div class="details">
            <span class="tag">{{ band.country }}</span>
            <span v-if="band.formed_year" class="year">Formé en : {{ band.formed_year }}</span>
          </div>
          <p v-if="band.spotify_link && band.spotify_link !== '-'" class="link">
            Lien Spotify disponible
          </p>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  color: #d32f2f;
  text-transform: uppercase;
}

.band-list {
  list-style: none;
  padding: 0;
}

.band-item {
  background: #f4f4f4; 
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  border-left: 5px solid #333;
}

.band-item h2 {
  margin: 0 0 10px 0;
  color: #222;
}

.tag {
  background: #333;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-right: 10px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>