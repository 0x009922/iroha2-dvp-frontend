<script setup lang="ts">
import { useScenarioStore } from '../stores/scenario'
import FormatTimestamp from './FormatTimestamp'
import PromiseStateSnackbar from './PromiseStateSnackbar.vue'
import TheScenarioFormatted from './TheScenarioFormatted.vue'

const store = useScenarioStore()
</script>

<template>
  <VCard :loading="store.loadingState.pending" elevation="4">
    <VCardTitle> View Scenario </VCardTitle>

    <VDivider />

    <div class="space-y-4">
      <VAlert
        v-if="store.loadingState.rejected"
        type="error"
        class="m-4"
        title="Error"
        variant="tonal"
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

      <span v-if="store.lastLoadedAt" class="text-caption ml-2">
        Last updated: <FormatTimestamp :value="store.lastLoadedAt" />
      </span>

      <VSpacer />

      <VBtn
        variant="elevated"
        color="primary"
        :loading="store.runScenarioState.pending"
        @click="store.runScenario()"
      >
        Run
      </VBtn>
    </VCardActions>
  </VCard>

  <PromiseStateSnackbar
    :state="store.runScenarioState"
    fulfilled="Scenario run succeeded"
    rejected="Scenario run failed"
  />
</template>
