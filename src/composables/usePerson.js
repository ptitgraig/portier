import { ref } from 'vue';
import { supabase } from "@/utils/supabase";

const personList = ref([]);

export function usePerson() {
    const getPersons = async () => {
        const { data } = await supabase.from('person')
            .select(`*, person_office (office_id)`)
            .order('last_name', { ascending: true })
        personList.value = data
    }

    async function addPerson(person) {
        const { data } = await supabase
            .from('person')
            .insert({
                first_name: person.first_name,
                last_name: person.last_name,
                is_baby: person.is_baby,
                is_child: person.is_child
            })
            .select();

        return data?.[0];
    }

    return {
        personList,
        getPersons,
        addPerson
    };
}
