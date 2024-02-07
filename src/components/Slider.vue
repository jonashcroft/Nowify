<template>
    <div id="slider">
        <div class="slider">
            <ul class="slides" :style="{ left: -width * current + 'px' }">
                <li v-for="(slide, i) in slides">
                    <img :src="slide" alt="">
                </li>
            </ul>
            <ul class="bullets">
                <li v-for="(slide, i) in slides" @click="selectSlide(i)" v-html="i == current ? '&#9679;' : '&omicron;'">
                </li>
            </ul>
            <a class="prev" href="#" @click.prevent="prevSlide">&#x25C0;</a>
            <a class="next" href="#" @click.prevent="nextSlide">&#x25B6;</a>
        </div>
    </div>
</template>

<script>
new Vue({
    el: '#slider',
    data: {
        slides: [
            '../../assets/preview-1.png',
            '../../assets/preview-2.png',
            '../../assets/preview-3.png',
        ],
        current: 0,
        width: 800,
        timer: 0,
    },
    methods: {
        nextSlide: function () {
            this.current++;
            if (this.current >= this.slides.length)
                this.current = 0;
            this.resetPlay();
        },
        prevSlide: function () {
            this.current--;
            if (this.current < 0)
                this.current = this.slides.length - 1;
            this.resetPlay();
        },
        selectSlide: function (i) {
            this.current = i;
            this.resetPlay();
        },
        resetPlay: function () {
            clearInterval(this.timer);
            this.play();
        },
        play: function () {
            let app = this;
            this.timer = setInterval(function () {
                app.nextSlide();
            }, 2000);
        }
    },
    created: function () {
        this.play();
    }
});

</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
