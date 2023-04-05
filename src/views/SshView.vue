<script setup>
import {nextTick, onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";
import {io} from "socket.io-client";

const ioclient = io();
const props    = defineProps([]);

let data = reactive({
    sshOutput    : null,
    containerName: null,
    containers   : [],
    btnDisabled  : true,
    sshCommand   : null,
});
onMounted(() => {
    initIo();
    getContainersList();

});

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

function initIo() {
    ioclient.on('connect', () => {
    });

    ioclient.on('sshOutput', (msg) => {
        if (!msg) {
            return;
        }
        data.sshOutput = (msg) ? data.sshOutput + "\r\n" + msg : '';
        document.getElementById("ssh_output_text").scrollIntoView({block: "end", behavior: "smooth"});

    });
}

function sendCommand() {
    data.sshOutput = null;
    axios.post('/api/sendCommand', {
        sshCommand   : data.sshCommand,
        containerName: data.containerName,
    }).then((response) => {
        data.sshCommand = null;
        console.log(response);
    });
}
</script>
<template>
    <v-container>
        <v-row>
            <v-col class="text-center">
                <v-card>
                    <v-card-title>SSH</v-card-title>
                    <v-card-text>
                        <v-autocomplete v-model="data.containerName"
                                        :items="data.containers"
                                        item-value="name"
                                        item-title="name"
                                        label="Enter Container Name"
                                        @update:modelValue="data.btnDisabled = false;"
                                        autofocus
                        ></v-autocomplete>
                        <div class="text-left bg-blue-grey-darken-4" style="border:1px solid #cccccc;height:500px;overflow:scroll;">
                            <pre id="ssh_output_text" dark>{{ data.sshOutput }}</pre>
                        </div>
                        <v-text-field id="ssh_input_box" label="Enter SSH Command" variant="outlined" v-model="data.sshCommand" @keydown.enter="sendCommand"></v-text-field>
                        <v-btn @click="sendCommand" :disabled="data.btnDisabled">Run Command</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>