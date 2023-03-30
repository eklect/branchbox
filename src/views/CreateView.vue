<script setup>
import {onMounted} from "vue";
import {reactive} from "vue";
import axios from "axios";

const props = defineProps([]);
let data    = reactive({
    branch: null,
});
onMounted(() => {

});

function createContainer() {
    axios.post('/api/createContainer', {
        branch: data.branch
    }).then((response) => {
        console.log(response);
    });
}
</script>
<template>
    <v-container>
        <v-row justify="center" align="center" style="height:90vh;">
            <v-col class="text-center v-col-6">
                <v-text-field label="Enter Branch Name" variant="outlined" v-model="data.branch"></v-text-field>
                <v-col>
                    <v-btn @click="createContainer">Create Container</v-btn>
                </v-col>
            </v-col>

        </v-row>
    </v-container>
</template>