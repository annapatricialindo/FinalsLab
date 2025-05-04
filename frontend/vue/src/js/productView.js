// productView.js
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';

export const useProductView = (selectedProduct) => {
  const audio = ref(null);
  const isMuted = ref(false);
  const visualizerActive = ref(true);
  const bars = ref(new Array(15).fill(50)); // Example bar heights
  const progress = ref(0);

  let interval = null;

  const updateBars = () => {
    bars.value = new Array(Math.floor(window.innerWidth / 20))
      .fill(10)
      .map(() => Math.random() * 100 + 50);
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    if (audio.value) {
      audio.value.muted = isMuted.value;
    }
  };

  const progressBarStyle = computed(() => {
    const primary = selectedProduct?.visualPrimaryColor || "#00ccff";
    const secondary = selectedProduct?.visualSecondaryColor || "#0066ff";
    return {
      width: `${progress.value}%`,
      background: `linear-gradient(to right, ${primary}, ${secondary})`,
    };
  });

  const updateProgress = () => {
    if (audio.value) {
      progress.value = (audio.value.currentTime / audio.value.duration) * 100;
    }
  };

  const startVisualizer = () => {
    if (selectedProduct?.audio && audio.value !== selectedProduct.audio) {
      if (audio.value) {
        audio.value.pause();
        audio.value.currentTime = 0;
      }

      audio.value = selectedProduct.audio;
      audio.value.loop = true;

      audio.value.play().catch((error) => console.warn("Playback prevented:", error));

      if (!interval) {
        updateBars();
        interval = setInterval(updateBars, 100);
      }

      visualizerActive.value = true;
    }
  };

  watchEffect(() => {
    if (audio.value) {
      audio.value.addEventListener("timeupdate", updateProgress);
    }
  });

  onMounted(() => {
    window.addEventListener('resize', updateBars);
    startVisualizer();
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
    window.removeEventListener('resize', updateBars);

    if (audio.value) {
      audio.value.removeEventListener("timeupdate", updateProgress);
    }
  });

  return {
    isMuted,
    visualizerActive,
    bars,
    progress,
    progressBarStyle,
    toggleMute,
    startVisualizer,
  };
};
