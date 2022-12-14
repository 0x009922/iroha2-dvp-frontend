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

const mode = useLocalStorage<'view' | 'edit'>('the-scenario-tabs-model', 'view')

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
  <VCard :loading="store.loadingState.pending" elevation="4">
    <VCardTitle> Scenario </VCardTitle>

    <VDivider />

    <VTabs v-model="mode" color="primary">
      <VTab value="view">View</VTab>
      <VTab value="edit">Edit</VTab>
    </VTabs>

    <VWindow v-model="mode">
      <VWindowItem value="view">
        <div class="space-y-4">
          <VAlert
            type="error"
            class="m-4"
            v-if="store.loadingState.rejected"
            title="Error"
          >
            Failed to load data from the backend &mdash;
            {{ store.loadingState.rejected.reason }}
          </VAlert>

          <TheScenarioFormatted
            v-if="store.loadingState.fulfilled?.value"
            :data="store.loadingState.fulfilled.value"
          />
          <template v-else>
            <div class="text-caption p-4">No content</div>
          </template>
        </div>
      </VWindowItem>
      <VWindowItem value="edit" class="p-4">
        <VTextarea
          v-model="editableDebounced"
          label="Editable JSON"
          class="json-textarea"
          auto-grow
        />

        <input type="file" accept="application/json" @input="onFileInput" />
      </VWindowItem>
    </VWindow>

    <VCardActions>
      <VBtn variant="text" color="primary" @click="store.updateLoaded()">
        Get current
      </VBtn>
      <VSpacer />
      <VBtn
        :disabled="!store.isValidToSubmit"
        :loading="store.updatingState?.pending"
        color="primary"
        variant="elevated"
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
