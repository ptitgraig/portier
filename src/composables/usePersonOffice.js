import { supabase } from "@/utils/supabase";

async function isVisitorAlreadyRegistered(personId, officeId) {
    const { data } = await supabase
        .from('person_office')
        .select('person_id')
        .eq('person_id', personId)
        .eq('office_id', officeId)
    return data && data.length > 0
}

async function registerPersonForOffice(personId, officeId) {
    const isRegistered = await isVisitorAlreadyRegistered(personId, officeId);
    if (!isRegistered) {
        await supabase
            .from('person_office')
            .insert({person_id: personId, office_id: officeId})
    }
}

async function removePersonFromOffice(personId, officeId) {
    await supabase
        .from('person_office')
        .delete()
        .eq('person_id', personId)
        .eq('office_id', officeId);
}

export function usePersonOffice() {
    return {
        registerPersonForOffice,
        removePersonFromOffice,
    }
}
