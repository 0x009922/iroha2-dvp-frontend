<script setup lang="ts">
import { useScenarioStore } from '../stores/scenario'
import { ref, toRef } from 'vue'
import TheScenarioFormatted from './TheScenarioFormatted.vue'
import invariant from 'tiny-invariant'
import {
  refAutoReset,
  syncRef,
  watchDebounced,
  useLocalStorage,
} from '@vueuse/core'
import PromiseStateSnackbar from './PromiseStateSnackbar.vue'

const store = useScenarioStore()

const fileReadSnack = refAutoReset(false, 3500)

const editableDebounced = ref('')

syncRef(toRef(store, 'localScenario'), editableDebounced, { direction: 'ltr' })

watchDebounced(
  editableDebounced,
  (value) => {
    store.localScenario = value
  },
  { debounce: 700 }
)

function onFileInput(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.item(0)
  invariant(file)

  const reader = new FileReader()
  reader.addEventListener('load', (loadEvent) => {
    const content = loadEvent.target!.result as string
    store.localScenario = content
    fileReadSnack.value = true
  })
  reader.readAsBinaryString(file)
}
</script>

<template>
  <VCard elevation="4">
    <VCardTitle> Edit Scenario </VCardTitle>

    <VDivider />

    <div class="p-4">
      <VTextarea
        v-model="editableDebounced"
        label="Editable JSON"
        class="json-textarea"
        auto-grow
      />

      <div class="flex flex-col space-y-1">
        <label for="upload-scenario" class="text-caption">
          Load Scenario from a file
        </label>
        <input
          id="upload-scenario"
          type="file"
          accept="application/json"
          @input="onFileInput"
        />
      </div>
    </div>

    <VCardActions>
      <VBtn
        :disabled="!store.isValidToSubmit || !store.isLocalDiffersFromRemote"
        :loading="store.updatingState?.pending"
        color="primary"
        @click="store.updateByLocal"
      >
        Upload
      </VBtn>
    </VCardActions>
  </VCard>

  <VSnackbar v-model="fileReadSnack">
    Scenario JSON is loaded from the file
  </VSnackbar>

  <PromiseStateSnackbar
    :state="store.updatingState"
    fulfilled="Scenario is successfully uploaded"
    rejected="Failed to upload scenario"
  />
</template>

<style lang="scss">
.json-textarea {
  textarea {
    font-family: monospace;
    font-size: 12px;
  }
}
</style>
