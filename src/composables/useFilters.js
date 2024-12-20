import {ref, watch} from 'vue';

const currentFilter = ref('');
const is_baby = ref(false);
const is_child = ref(false);
const is_member = ref(false);
const is_casual = ref(false);

function toggleFilter(filterName) {
    if (currentFilter.value === filterName) {
        currentFilter.value = ''
    } else {
        currentFilter.value = filterName
    }
}

function initFiltersSynchro() {
    // filter sync
    watch(is_child, (val) => {
        if (val) {
            is_baby.value = false;
        }
    })

    watch(is_baby, (val) => {
        if (val) {
            is_child.value = false;
        }
    })

    watch(is_member, (val) => {
        if (val) {
            is_casual.value = false;
        }
    })

    watch(is_casual, (val) => {
        if (val) {
            is_member.value = false;
        }
    })
}

export const useFilters = () => {
    return {
        currentFilter,
        toggleFilter,
        initFiltersSynchro
    }
}
