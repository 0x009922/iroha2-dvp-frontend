<script setup lang="ts">
import { useWebSocket, whenever } from '@vueuse/core'
import { computed, shallowReactive, watch } from 'vue'

const url = new URL(import.meta.url)
const wsUrl =
  url.protocol.replace(/^http(s)?/, 'ws$1') + url.host + '/api/events'

const { data, status } = useWebSocket(wsUrl, {
  immediate: true,
  autoReconnect: {
    retries: Infinity,
  },
})

const history = shallowReactive<unknown[]>([])

const isActive = computed(() => status.value === 'OPEN')

const isConnecting = computed(() => status.value === 'CONNECTING')

whenever(data, (bit) => {
  history.push(JSON.parse(bit))
  data.value = null
})
</script>

<template>
  <VCard :loading="isConnecting">
    <VCardTitle>
      Events

      <VIcon
        v-if="isActive"
        icon="mdi-check-network-outline"
        color="green"
        size="x-small"
      />
      <VIcon
        v-else
        icon="mdi-close-network-outline"
        color="gray"
        size="x-small"
      />
    </VCardTitle>

    <VDivider />

    <pre>{{ history }}</pre>
  </VCard>
</template>
