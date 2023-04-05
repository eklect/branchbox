<script setup>
import {onMounted} from "vue";
import {reactive} from "vue";
import {useBbStore} from "@/stores/bbStore";

const store = useBbStore();

const props = defineProps([]);
let data    = reactive({
    repo             : null,
    dockerComposeFile: null,
    alertMsg         : {
        text : null,
        color: 'info',
    }
});
onMounted(() => {

});

function saveSettings() {
    store.setProfileName(store.profileName);
    data.alertMsg.text= 'Settings saved';
}
</script>
<template>
    <v-container class="v-col-6 mt-10">
        <v-card>
            <v-card-title class="my-10">
                <h1>Settings</h1>
            </v-card-title>
            <v-card-text>
                <v-alert type="info" class="mb-5" v-if="data.alertMsg.text" variant="outlined" closable="closable">
                    <p>{{data.alertMsg.text}}</p>
                </v-alert>
                <v-text-field label="Enter Docker Compose Profile Name" variant="outlined" v-model="store.profileName" autofocus></v-text-field>
                <v-btn @click="saveSettings" variant="flat" color="primary" class="mt-5">
                    Save
                </v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>