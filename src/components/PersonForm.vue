<script setup>
import {watch,unref,computed} from "vue";

const emit = defineEmits(['person-edited', 'person-deleted']);

const props = defineProps({
  mode: String,
  editedPersonId: String,
})

const modelValue = defineModel('modelValue')
const first_name = defineModel('first_name');
const last_name = defineModel('last_name');
const is_baby = defineModel('is_baby');
const is_child = defineModel('is_child');
const short_desc = defineModel('short_desc');
const is_member = defineModel('is_member');

watch(is_baby, (newValue) => {
  if (newValue) {
    is_child.value = false;
  }
})

watch(is_child, (newValue) => {
  if (newValue) {
    is_baby.value = false;
  }
})

const mainBtnLabel = computed(() => {
  return props.mode === 'edit' ?
      `Éditer ${first_name.value?? ''} ${last_name.value ?? ''}`
      : `Ajouter ${first_name.value ?? ''} ${last_name.value ?? ''}`
})

async function onSubmit() {
  emit('person-edited', {
    first_name: unref(first_name),
    last_name: unref(last_name),
    short_desc: unref(short_desc),
    is_baby: unref(is_baby),
    is_child: unref(is_child),
    is_member: unref(is_member),
  })
}

async function onDelete() {
  emit('person-deleted')
}
</script>

<template>
  <van-action-sheet v-model:show="modelValue" cancel-text="Annuler">
    <div class="content">
      <van-form @submit="onSubmit()">
        <van-cell-group inset>
          <van-field
              v-model="first_name"
              name="first_name"
              label="Prénom"
              placeholder="Jean"
              :rules="[{ required: true, message: 'Prénom est obligatoire' }]"
          />
          <van-field
              v-model="last_name"
              name="last_name"
              label="Nom"
              placeholder="Dupont"
          />
          <van-field
              v-model="short_desc"
              name="short_desc"
              type="textarea"
              label="Description"
              placeholder="Courte description de la personne"
              :rules="[{ required: false }]"
          />
          <van-field name="switch" label="Bébé">
            <template #input>
              <van-switch v-model="is_baby"/>
            </template>
          </van-field>
          <van-field name="switch" label="Enfant">
            <template #input>
              <van-switch v-model="is_child"/>
            </template>
          </van-field>
          <van-field name="switch" label="Membre">
            <template #input>
              <van-switch v-model="is_member"/>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" @click="onSubmit">
            {{ mainBtnLabel }}
          </van-button>
          <br/>
          <van-button v-if="mode === 'edit'" round block type="danger" @click="onDelete">
            Supprimer
          </van-button>
        </div>
      </van-form>
    </div>
  </van-action-sheet>
</template>

