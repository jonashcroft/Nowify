<template>
  <div class="carousel-container">
    <div class="carousel" ref="carousel">
      <img v-for="(image, index) in images" :key="index" :alt="'Image ' + (index + 1)" class="carousel-slide">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      images: [
        require('../../assets/preview-1.png') ,
        require('../../assets/preview-2.png'),
        require('../../assets/preview-3.png') 
      ],
      autoplayInterval: null
    };
  },
  mounted() {
    this.startAutoplay();
  },
  beforeDestroy() {
    this.stopAutoplay();
  },
  methods: {
    startAutoplay() {
      this.autoplayInterval = setInterval(this.nextSlide, 3000); // Change slide every 3 seconds
    },
    stopAutoplay() {
      clearInterval(this.autoplayInterval);
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }
};
</script>

<style>
.carousel-container {
  width: 100%;
  overflow: hidden;
}

.carousel {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  width: 100%;
  flex: 0 0 auto;
}
</style>
