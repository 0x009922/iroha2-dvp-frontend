<script setup lang="ts">
import { TriggerId } from '../types/scenario'
import FormatTimestamp from './FormatTimestamp'

defineProps<{
  triggerId: TriggerId
  timestamp: Date
}>()
</script>

<template>
  <FormatTimestamp :value="timestamp" />; Trigger ID &mdash;
  <code class="text-blue-600 font-semibold select-all">{{
    triggerId
  }}</code>
</template>
