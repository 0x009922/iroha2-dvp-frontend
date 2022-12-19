<script setup lang="ts">
import { TransactionId } from '../types/scenario'
import FormatTimestamp from './FormatTimestamp'

defineProps<{
  transactionId: TransactionId
  timestamp: Date
}>()
</script>

<template>
  <FormatTimestamp :value="timestamp" />; Tx ID &mdash;
  <code class="text-blue-600 font-semibold select-all">{{
    transactionId
  }}</code>
</template>
