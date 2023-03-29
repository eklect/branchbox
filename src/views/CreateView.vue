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
</script>
<template>
    <v-container>
        <v-row>
            <v-col>
                <v-text-field lable="Enter Branch Name" v-model="data.branch"></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>