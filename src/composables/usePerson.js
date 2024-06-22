import { ref } from 'vue';
import { supabase } from "@/utils/supabase";

export function usePerson() {
    const personList = ref([]);

    const getPersons = async () => {
        const { data } = await supabase.from('person')
            .select(`*, person_office (office_id)`)
            .order('last_name', { ascending: true })
        personList.value = data
    }

    return {
        personList,
        getPersons
    };
}
