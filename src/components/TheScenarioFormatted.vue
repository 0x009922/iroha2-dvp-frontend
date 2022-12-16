<script setup lang="ts">
import { Scenario } from '../types/scenario'
import TheScenarioFormattedCurrency from './TheScenarioFormattedCurrency.vue'
import Item from './TheScenarioFormattedItem.vue'
import FormatTimestamp from './FormatTimestamp'

defineProps<{
  data: Scenario
}>()
</script>

<template>
  <div>
    <div class="p-4 grid grid-cols-2 gap-4">
      <Item title="Direction" class="text-subtitle-2">
        {{ data.direction }}
      </Item>
      <Item title="Transaction ID">
        <code>{{ data.transaction_id }}</code>
      </Item>
      <Item title="Input Timestamp">
        <FormatTimestamp :value="data.input_timestamp" />
      </Item>
      <Item title="Settlement Deadline">
        <FormatTimestamp :value="data.settlement_deadline" />
      </Item>
    </div>

    <VDivider />

    <div class="text-subtitle-1 px-4 pt-4">Securities</div>

    <div class="p-4 grid gap-4">
      <div class="grid grid-cols-3 gap-4">
        <Item title="Amount">
          {{ data.securities_amount }}
        </Item>
        <Item title="From">
          {{ data.securities_from }}
        </Item>
        <Item title="To">
          {{ data.securities_to }}
        </Item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <Item title="asset_isin_id">
          <code>{{ data.securities_asset_isin_id }}</code>
        </Item>
        <Item title="Token ID">
          <code>{{ data.securities_token_id }}</code>
        </Item>
      </div>
    </div>

    <VDivider />

    <TheScenarioFormattedCurrency
      :currency="data.foreign_currency"
      :id="data.foreign_currency_id"
      :amount="data.foreign_currency_amount"
      :from="data.foreign_currency_from"
      :to="data.foreign_currency_to"
    >
      <template #which>Foreign</template>
    </TheScenarioFormattedCurrency>

    <VDivider />

    <TheScenarioFormattedCurrency
      :currency="data.local_currency"
      :id="data.local_currency_id"
      :amount="data.local_currency_amount"
      :from="data.local_currency_from"
      :to="data.local_currency_to"
    >
      <template #which>Local</template>
    </TheScenarioFormattedCurrency>
  </div>
</template>

<style lang="scss" scoped>
code {
  font-family: 'Fira Code', monospace;
}
</style>
