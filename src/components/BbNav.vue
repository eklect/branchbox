<script setup>
const props = defineProps(['drawer']);
let isOpen  = props.drawer;
</script>
<template>
    <v-navigation-drawer v-model="isOpen">
        <v-list>
            <v-list-item>
                <RouterLink to="/">Home</RouterLink>
            </v-list-item>
            <v-list-item>
                <RouterLink to="/containers">Containers</RouterLink>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>