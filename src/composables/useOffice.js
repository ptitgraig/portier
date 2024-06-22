import { ref, computed } from 'vue';
import { supabase } from "@/utils/supabase";
import {getTodayAsOfficeDbFormat} from "@/utils/date.js";

export function useOffice() {
    const officeList = ref([]);
    const todayDbFormat = getTodayAsOfficeDbFormat();

    const getOffices = async () => {
        const { data } = await supabase.from('office')
            .select(`*`)
        officeList.value = data
    }

    async function getOfficeIdByDate(date) {
        console.log(date);
        const { data } = await supabase.from('office').select('id').eq('date', date);
        if (data && data.length > 0) {
            return data[0].id;
        } else {
            console.info(`getOfficeIdByDate: unable to retrieve an office for ${date}`);
            return '';
        }
    }

    const officeDatesList = computed(() => {
        return officeList.value.map(({ date }) => date);
    })

    const isTodayInOfficeRecords = computed(() => {
        return officeDatesList.value.includes(todayDbFormat);
    })

    const createNewOfficeWithDate = async(date) => {
        await supabase
            .from('office')
            .insert({ date });
    }

    const todayOfficeId = computed(() => {
        return officeList.value.find(({ date }) => date === todayDbFormat)?.id;
    })


    return {
        isTodayInOfficeRecords,
        officeList,
        todayOfficeId,
        officeDatesList,
        getOffices,
        getOfficeIdByDate,
        createNewOfficeWithDate
    };
}
