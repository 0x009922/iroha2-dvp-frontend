<script setup lang="ts">
import { useWebSocket, whenever } from '@vueuse/core'
import { computed, shallowReactive } from 'vue'
import { DomainEvent } from '../types/events'
import FormatTimestamp from './FormatTimestamp'

const url = new URL(import.meta.url)
const wsUrl =
  url.protocol.replace(/^http(s)?/, 'ws$1') + url.host + '/api/events'

const { data, status } = useWebSocket(wsUrl, {
  immediate: true,
  autoReconnect: {
    retries: Infinity,
  },
})

type ParsedEvent = (
  | {
      type: 'parsed'
      event: DomainEvent
    }
  | { type: 'unidentified'; raw: unknown }
) & {
  timestamp: Date
}

const history = shallowReactive<ParsedEvent[]>([])

const lastHistoryReversed = computed(() => {
  const last = history.slice(-7)
  last.reverse()
  return last
})

const isActive = computed(() => status.value === 'OPEN')

const isConnecting = computed(() => status.value === 'CONNECTING')

whenever(data, (bit) => {
  const timestamp = new Date()

  try {
    const parsed: DomainEvent = JSON.parse(bit)
    history.push({ type: 'parsed', event: parsed, timestamp })
  } catch {
    history.push({ type: 'unidentified', raw: bit, timestamp })
  }

  data.value = null
})
</script>

<template>
  <VCard :loading="isConnecting" elevation="4">
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

    <VList>
      <template v-if="!history.length">
        <VListSubheader>No any events yet</VListSubheader>
      </template>
      <template v-for="x in lastHistoryReversed">
        <template v-if="x.type === 'parsed'">
          <VListItem :title="x.event.type">
            <VListItemSubtitle>
              <FormatTimestamp :value="x.timestamp" />
            </VListItemSubtitle>
          </VListItem>
        </template>
        <template v-else>
          <VListItem title="Unidentified">
            <VListItemSubtitle>
              <code>{{ x.raw }}</code>
            </VListItemSubtitle>
          </VListItem>
        </template>
      </template>
    </VList>
  </VCard>
</template>
