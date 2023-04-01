<script setup>
import {nextTick, onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";
import {io} from "socket.io-client";

//Init socket.io
const ioclient = io();
const props    = defineProps([]);
let data       = reactive({
    containers: null,
    headers   : null,
});
onMounted(() => {
    axios.get('/api/getContainers').then((response) => {
        data.containers = response.data.containers;
        data.headers    = response.data.headers;
    })

    ioclient.on('containerListUpdated', (msg) => {
        // nextTick(() => {
        //     data.containers = msg.containers;
        //     data.headers    = msg.headers;
        // });

    });
});
</script>
<template>
    <v-container>
        <v-row>
            <v-col>
                <v-table>
                    <tr>
                        <th v-for="header in data.headers" :key="header">{{ header.title }}</th>
                    </tr>
                    <tr v-for="container in data.containers" :key="container.id">
                        <td>{{ container.id }}</td>
                        <td>{{ container.name }}</td>
                        <td>{{ container.image }}</td>
                        <td>{{ container.status }}</td>
                    </tr>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>