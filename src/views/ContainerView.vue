<script setup>
import {onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";

const props = defineProps([]);
let data    = reactive({
    containers: null,
    headers   : null,
});
onMounted(() => {
    axios.get('/api/getContainers').then((response) => {
        data.containers = response.data.containers;
        data.headers    = response.data.headers;
        console.log(data.containers)
    });
});
</script>
<template>
    <v-container>
        <v-row>
            <v-col>
                <v-table
                    :headers="data.headers"
                    :items="data.containers"
                    class="elevation-1"></v-table>
            </v-col>
        </v-row>
    </v-container>
</template>