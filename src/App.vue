<script setup>
import {RouterLink, RouterView} from 'vue-router'
import BbNav from "@/components/BbNav.vue";

let drawer = true;
</script>
<template>
    <v-layout>
        <v-app-bar color="primary" title="BranchBox">
            <template v-slot:prepend>
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>            </template>
        </v-app-bar>
        <bb-nav :drawer="drawer"></bb-nav>
        <v-main>
            <RouterView/>
        </v-main>
    </v-layout>
</template>
<style scoped>
header {
    line-height : 1.5;
    max-height  : 100vh;
}

.logo {
    display : block;
    margin  : 0 auto 2rem;
}

nav {
    width      : 100%;
    font-size  : 12px;
    text-align : center;
    margin-top : 2rem;
}

nav a.router-link-exact-active {
    color : var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color : transparent;
}

nav a {
    display     : inline-block;
    padding     : 0 1rem;
    border-left : 1px solid var(--color-border);
}

nav a:first-of-type {
    border : 0;
}

@media (min-width : 1024px) {
    header {
        display       : flex;
        place-items   : center;
        padding-right : calc(var(--section-gap) / 2);
    }

    .logo {
        margin : 0 2rem 0 0;
    }

    header .wrapper {
        display     : flex;
        place-items : flex-start;
        flex-wrap   : wrap;
    }

    nav {
        text-align  : left;
        margin-left : -1rem;
        font-size   : 1rem;

        padding     : 1rem 0;
        margin-top  : 1rem;
    }
}
</style>
