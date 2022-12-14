<script setup lang="ts">
import {
  AccountNumber,
  Amount,
  CurrencyIndicator,
  CurrencyToken,
} from '../types/scenario'
import Item from './TheScenarioFormattedItem.vue'

defineProps<{
  currency: CurrencyIndicator
  id: CurrencyToken
  from: AccountNumber
  to: AccountNumber
  amount: Amount
}>()
</script>

<template>
  <div class="text-subtitle-1 px-4 pt-4">
    <slot name="which" /> Currency -
    <span class="font-semibold">{{ currency }}</span>
  </div>

  <div class="p-4 grid grid-cols-3 gap-4">
    <Item title="ID" class="col-span-3">
      <code>{{ id }}</code>
    </Item>
    <Item title="Amount">
      {{ amount }}
    </Item>
    <Item title="From">
      {{ from }}
    </Item>
    <Item title="To">
      {{ to }}
    </Item>
  </div>
</template>
