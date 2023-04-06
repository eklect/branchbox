<script setup>
import {nextTick, onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";
import {io} from "socket.io-client";
import {useBbStore} from "@/stores/bbStore";
//Init socket.io
const ioclient = io();
const props    = defineProps([]);
let data       = reactive({
    containers: null,
    headers   : null,

});
const store    = useBbStore();

onMounted(() => {
    getContainersList();

    ioclient.on('containerListUpdated', (msg) => {

    });
});

function stopContainer(containerId) {
    axios.post('/api/stopContainer', {
        id         : containerId,
        profileName: store.profileName,
    }).then((response) => {
        getContainersList();
    })
}

function destroyContainer(containerId, projectName) {
    axios.post('/api/destroyContainer', {
        id         : containerId,
        profileName: store.profileName,
        projectName: projectName,
    }).then((response) => {
        getContainersList();
    })
}

function getContainersList() {

    axios.get('/api/getContainers').then((response) => {
        data.containers = response.data.containers;
        data.headers    = response.data.headers;
        //Add actions to header
        data.headers.push({
            title: "Actions",
            key  : "actions"
        });
    })
}
</script>
<template>
    <v-container>
        <v-row>
            <v-col>
                <v-btn @click="getContainersList" variant="flat" title="Refresh">
                    <v-icon icon="mdi-refresh"></v-icon>
                    Refresh List
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table>
                    <tr>
                        <th v-for="header in data.headers" :key="header">{{ header.title }}</th>
                    </tr>
                    <tr v-for="container in data.containers" :key="container.id">
                        <td class="border pa-3">{{ container.id }}</td>
                        <td class="border pa-3">{{ container.name }}</td>
                        <td class="border pa-3">{{ container.image }}</td>
                        <td class="border pa-3">
                            <div v-for="port in container.ports" v-html="port.host" :key="port"></div>
                        </td>
                        <td class="border pa-3">{{ container.status }}</td>
                        <td class="border pa-3">{{ container.branch }}</td>
                        <td>
                            <v-btn @click="stopContainer(container.id,container.name)" variant="flat" title="Stop Container">
                                <v-icon icon="mdi-octagon"></v-icon>
                            </v-btn>
                            <v-btn @click="destroyContainer(container.id,container.name)" variant="flat" title="Destroy Container">
                                <v-icon icon="mdi-trash-can"></v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>