import {ref, computed} from 'vue'
import {defineStore} from 'pinia'

export const useBbStore = defineStore('bb', () => {
    let profileName = ref(window.localStorage.getItem('profileName') || 'default');

    function setProfileName(name) {
        window.localStorage.setItem('profileName', name);
        profileName.value = name;
    }

    return {profileName, setProfileName}
});