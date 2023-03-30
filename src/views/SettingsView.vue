<script setup>
import {onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";

const props = defineProps([]);
let data    = reactive({
    repo: null,
    dockerComposeFile: null,
});
onMounted(() => {

});
</script>
<template>
    <v-container class="v-col-6 mt-10">
        <v-card>
            <v-card-title class="my-10">
                <h1>Settings</h1>
            </v-card-title>
            <v-card-text>
Coming Soon.
            </v-card-text>
        </v-card>
    </v-container>
</template>