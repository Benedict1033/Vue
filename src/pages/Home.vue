<template>
    <div class="image-container">
        <div class="w3-display-middle w3-margin-top w3-center">
            <h1 class="w3-xxlarge w3-text-white"><span class="w3-padding w3-black w3-opacity-min"><b>MK</b></span> <span
                    class="w3-hide-small w3-text-light-grey"><b>Makalot</b></span></h1>
        </div>
    </div>
</template>
<script>
export default {
    name: "HomePage",
    mounted() {
        window.addEventListener("scroll", this.preventScroll);
    },
    unmounted() {
        window.removeEventListener("scroll", this.preventScroll);
    },
    methods: {
        preventScroll() {
            window.scrollTo(0, 0);
        },
    },
};
</script>
<style>
.image-container {
    background-image: url('../assets/ecolot.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    height: 100vh;
}

.w3-display-middle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%)
}

.w3-margin-top {
    margin-top: 16px !important
}

.w3-center {
    text-align: center !important
}

.w3-xxlarge {
    font-size: 36px !important
}

.w3-text-white,
.w3-hover-text-white:hover {
    color: #fff !important
}

.w3-padding {
    padding: 8px 16px !important
}

.w3-black,
.w3-hover-black:hover {
    color: #fff !important;
    background-color: #000 !important
}

.w3-opacity-min {
    opacity: 0.75
}

.w3-text-light-grey,
.w3-hover-text-light-grey:hover,
.w3-text-light-gray,
.w3-hover-text-light-gray:hover {
    color: #f1f1f1 !important
}
</style>