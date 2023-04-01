<script setup>
import {ref, nextTick, onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";
import {io} from "socket.io-client";

//Init socket.io
const ioclient      = io();
//Define props
const props         = defineProps([]);
//Define data
let data            = reactive({
    branch               : null,
    sshOutput            : null,
    sshCommand           : null,
    createContBtnDisabled: true,
    clearCache           : false,
    activeTab            : 0,
    tabs                 : [
        {
            title: "Create Image",
            icon : "mdi-code-braces-box"
        },
        {
            title: "Create Container",
            icon : "mdi-server"
        },
        {
            title: "SSH",
            icon : "mdi-terminal"
        }
    ],
});
const createContBtn = ref(null);

//Define methods
onMounted(() => {
    initIo();

});

//Define functions
function initIo() {
    ioclient.on('connect', () => {
    });

    ioclient.on("buildProgress", (msg) => {
        data.sshOutput = data.sshOutput + "\r\n" + msg;
        nextTick(() => {
            document.getElementById("output_text_end").scrollIntoView({behavior: "smooth"});
        });

    });
    ioclient.on('buildComplete', (msg) => {
        if (msg) {
            nextTick(() => {
                data.activeTab             = 1;
                data.createContBtnDisabled = false;

            });
            document.getElementById("create_container").scrollIntoView({behavior: "smooth"});

        }

    });
}

function createImage() {
    data.sshOutput = null;
    axios.post('/api/createImage', {
        branch    : data.branch,
        clearCache: data.clearCache,
    }).then((response) => {
        console.log(response);
    });
}

function startContainer() {
    data.sshOutput = null;
    axios.post('/api/startContainer', {}).then((response) => {
        console.log(response);
    });
}

function sendCommand() {
    data.sshOutput = null;
    axios.post('/api/sendCommand', {
        command: data.sshCommand,
    }).then((response) => {
        console.log(response);
    });
}
</script>
<template>
    <v-container id="create_container">
        <v-row>
            <v-col>
                <v-tabs v-model="data.activeTab" class="mb-5" id="tabs_nav">
                    <v-tab v-for="tab in data.tabs" :key="tab.title">
                        <v-icon>{{ tab.icon }}</v-icon>
                        {{ tab.title }}
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-window v-model="data.activeTab" class="my-10 pa-2">
                    <v-window-item transition="v-slide-x-transition">
                        <v-text-field label="Enter Branch Name" variant="outlined" v-model="data.branch" @keydown.enter="createImage" autofocus></v-text-field>
                        <v-checkbox v-model="data.clearCache" label="Clear Cache Before Creating?"></v-checkbox>
                        <v-btn @click="createImage">Create Image</v-btn>
                    </v-window-item>
                    <v-window-item transition="v-slide-x-transition">
                        <v-row>
                            <v-col class="text-center">
                                <v-btn id="create_cont_btn" @click="startContainer" :disabled="data.createContBtnDisabled">Create Container</v-btn>
                            </v-col>
                        </v-row>
                    </v-window-item>
                    <v-window-item>
                        <v-row>
                            <v-col class="text-center">
                                <v-card>
                                    <v-card-title>SSH</v-card-title>
                                    <v-card-text>
                                        <v-textarea readonly label="SSH Command" v-model="data.sshOutput" outlined></v-textarea>
                                        <v-text-field label="Enter SSH Command" variant="outlined" v-model="data.sshCommand" @keydown.enter="sendCommand" autofocus></v-text-field>
                                        <v-btn @click="sendCommand">Run Command</v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card v-if="data.sshOutput">
                    <v-card-title>Console Output</v-card-title>
                    <v-card-text>
                        <pre id="output_text">{{ data.sshOutput }}</pre>
                        <v-divider id="output_text_end"></v-divider>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>