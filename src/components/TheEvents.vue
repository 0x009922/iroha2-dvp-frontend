<script setup lang="ts">
import { useWebSocket, whenever } from '@vueuse/core'
import { computed, shallowReactive } from 'vue'
import { DvpEvent } from '../types/events'
import FormatTimestamp from './FormatTimestamp'
import TxIdAndTimestamp from './TxIdAndTimestamp.vue'
import TriggerIdAndTimestamp from './TriggerIdAndTimestamp.vue'
// import SAMPLE from '../events-sample'

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
      event: DvpEvent
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
    const parsed: DvpEvent = JSON.parse(bit)
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
          <VListItem v-if="x.event.type === 'ScenarioStarted'">
            <template #prepend>
              <VIcon icon="mdi-book-play" />
            </template>

            <VListItemTitle> Scenario started </VListItemTitle>
            <VListItemSubtitle>
              <TxIdAndTimestamp
                :transaction-id="x.event.content.transaction_id"
                :timestamp="x.timestamp"
              />
            </VListItemSubtitle>
          </VListItem>

          <VListItem v-else-if="x.event.type === 'ScenarioReachedCactus'">
            <template #prepend>
              <VIcon icon="mdi-cactus" />
            </template>

            <VListItemTitle> Scenario reached Cactus </VListItemTitle>

            <VListItemSubtitle>
              <TxIdAndTimestamp
                :transaction-id="x.event.content.transaction_id"
                :timestamp="x.timestamp"
              />
            </VListItemSubtitle>
          </VListItem>

          <VListItem v-else-if="x.event.type === 'CactusResponseReceived'">
            <template #prepend>
              <VIcon icon="mdi-cactus" color="green" />
            </template>

            <VListItemTitle> Cactus response is received </VListItemTitle>

            <VListItemSubtitle>
              <TxIdAndTimestamp
                :transaction-id="x.event.content.transaction_id"
                :timestamp="x.timestamp"
              />
            </VListItemSubtitle>
          </VListItem>

          <VListItem v-else-if="x.event.type === 'ScenarioFinished'">
            <template #prepend>
              <VIcon icon="mdi-book-check" color="green-darken-2" />
            </template>

            <VListItemTitle> Scenario is finished! </VListItemTitle>

            <VListItemSubtitle>
              <TxIdAndTimestamp
                :transaction-id="x.event.content.transaction_id"
                :timestamp="x.timestamp"
              />
            </VListItemSubtitle>
          </VListItem>

          <VListItem v-if="x.event.type === 'TriggerExecuted'">
            <template #prepend>
              <VIcon icon="mdi-book-play" />
            </template>

            <VListItemTitle> Trigger {{x.event.content.status}} </VListItemTitle>
            <VListItemSubtitle>
              <TriggerIdAndTimestamp
                :trigger-id="x.event.content.trigger_id"
                :timestamp="x.timestamp"
              />
            </VListItemSubtitle>
          </VListItem>

          <template v-else-if="x.event.type === 'Error'">
            <VListItem v-if="x.event.content.type === 'NotEnoughMoney'">
              <template #prepend>
                <VIcon icon="mdi-close-circle" color="red" />
              </template>

              <VListItemTitle> Error - Not enough money </VListItemTitle>

              <VListItemSubtitle>
                <FormatTimestamp :value="x.timestamp" />
              </VListItemSubtitle>
            </VListItem>
          </template>

          <VListItem v-else-if="x.event.type === 'Message'">
            <template #prepend>
              <VIcon icon="mdi-receipt-text" />
            </template>

            <VListItemTitle> Message from the backend </VListItemTitle>

            <VListItemSubtitle>
              <FormatTimestamp :value="x.timestamp" />; {{ x.event.content }}
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
