<template>
    <div class="carousel">
        <slot :currentSlide="currentSlide" />
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
export default {
    setup() {
        const currentSlide = ref(1);
        const getSlideCount = ref(null);
        const timeoutDuration = ref(5000);

        const nextSlide = () => {
            if (currentSlide.value === getSlideCount.value) {
                currentSlide.value = 1;
                return;
            }
            currentSlide.value += 1;
        }

        const autoPlay = () => {
            setInterval(() => {
                nextSlide()
            }, timeoutDuration.value)
        }

        onMounted(() => {
            getSlideCount.value = document.querySelectorAll('.slide').length;
            console.log(getSlideCount.value);
        })

        autoPlay()
        return { currentSlide }
    }
}
</script>

<style></style>
