<script setup>
const props = defineProps(['drawer']);
</script>
<template>
    <v-navigation-drawer
        v-model="props.drawer"
    >
        <v-list>
            <v-list-item to="/">
                <v-icon icon="mdi-home"></v-icon>
                Home
            </v-list-item>
            <v-list-item to="/containers">
                <v-icon icon="mdi-package"></v-icon>
                Containers
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>