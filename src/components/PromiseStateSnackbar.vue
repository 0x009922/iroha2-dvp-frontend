<script setup lang="ts">
import { PromiseStateAtomic } from '@vue-kakuyaku/core'
import { refAutoReset } from '@vueuse/core'
import { watch } from 'vue'

const props = defineProps<{
  state?: PromiseStateAtomic<unknown> | null
  fulfilled?: string
  rejected?: string
}>()

const TIMEOUT = 3500

const showFulfilled = refAutoReset(false, TIMEOUT)
const showRejected = refAutoReset(false, TIMEOUT)

watch(
  () => props.state,
  (state) => {
    if (state?.fulfilled) showFulfilled.value = true
    else if (state?.rejected) {
      console.error(
        `[PromiseStateSnackbar] extended rejection reason:`,
        String(state.rejected.reason)
      )
      showRejected.value = true
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <VSnackbar v-model="showFulfilled" color="green">
    <slot name="fulfilled">{{ fulfilled }}</slot>
  </VSnackbar>

  <VSnackbar v-model="showRejected" color="red">
    <slot name="rejected">{{ rejected }}</slot>
  </VSnackbar>
</template>
