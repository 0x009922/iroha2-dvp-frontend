<script setup lang="ts">
import { useScenarioStore } from '../stores/scenario'
import TheScenarioFormatted from './TheScenarioFormatted.vue'

const store = useScenarioStore()
</script>

<template>
  <VCard :loading="store.loadingState.pending" elevation="4">
    <VCardTitle> View Scenario </VCardTitle>

    <VDivider />

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

    <VCardActions>
      <VBtn variant="text" color="primary" @click="store.updateLoaded()">
        Update
      </VBtn>
    </VCardActions>
  </VCard>
</template>
