<template>
  <div class="home">
    <!-- Background -->
    <div class="background" :style="{ backgroundImage: 'url(/image/BG1.jpg)' }"></div>

    <!-- Main Content Split Left & Right -->
    <div class="main-layout d-flex">

      <!-- LEFT SIDE: Welcome + Features -->
      <div class="left-content d-flex flex-column justify-content-center text-white p-5">
        <div class="hero-section text-center">
          <h1 class="display-3 fw-bold">Welcome to MusicTrack</h1>
          <p class="lead">Your one-stop shop for immersive music visual experiences</p>
          <router-link to="/product">
            <button class="btn btn-primary btn-lg mt-3">
              <i class="fas fa-music"></i> Enter Store
            </button>
          </router-link>
          <div class="features d-flex justify-content-center gap-4 flex-wrap mt-5">
            <div class="card feature-card glassmorphism p-4 text-white text-center">
              <i class="fas fa-wave-square fa-2x mb-2"></i>
              <h5>Dynamic Visualizer</h5>
              <p>Experience real-time visuals that dance with your music.</p>
            </div>
            <div class="card feature-card glassmorphism p-4 text-white text-center">
              <i class="fas fa-shopping-cart fa-2x mb-2"></i>
              <h5>Curated Tracks</h5>
              <p>Choose from a handpicked collection of stunning audio visuals.</p>
            </div>
            <div class="card feature-card glassmorphism p-4 text-white text-center">
              <i class="fas fa-headphones-alt fa-2x mb-2"></i>
              <h5>Immersive Audio</h5>
              <p>Listen to high-quality tracks with unique genre-based themes.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE: Why MusicTrack -->
      <div class="oval-panel glassmorphism text-white p-5">
        <h3 class="fw-bold mb-3">Why MusicTrack?</h3>
        <p class="mb-3">We blend stunning visuals with curated audio experiences to bring you closer to the beat. Dive
          in and explore the synergy between sight and sound.</p>
        <ul>
          <li>🎧 Streamline audio + visuals</li>
          <li>🚀 Lightning-fast delivery</li>
          <li>🌐 Access anywhere</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
.home {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(10px);
  z-index: -1;
}

.main-layout {
  display: flex;
  height: 100%;
  z-index: 1;
}

.left-content {
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.features {
  padding-top: 2rem;
}

.feature-card {
  width: 280px;
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
}

.oval-panel {
  width: 35%;
  height: 100%;
  backdrop-filter: blur(14px);
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: none;
  clip-path: ellipse(100% 100% at 100% 50%);
  position: relative;
  z-index: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 992px) {
  .main-layout {
    flex-direction: column;
    height: auto;
  }

  .left-content,
  .oval-panel {
    width: 100%;
  }

  .oval-panel {
    clip-path: none;
    border-radius: 1rem;
    margin-top: 2rem;
  }
}
</style>
