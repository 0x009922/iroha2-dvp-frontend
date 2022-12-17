<script setup>
import TheScenarioView from './components/TheScenarioView.vue'
import TheScenarioEdit from './components/TheScenarioEdit.vue'
import TheEvents from './components/TheEvents.vue'
</script>

<template>
  <div class="container mx-auto p-20 space-y-6">
    <h1 class="text-h1">Iroha DVP</h1>
    <TheScenarioEdit />
    <div class="grid lg:grid-cols-2 gap-6 items-start">
      <TheScenarioView />
      <TheEvents />
    </div>
  </div>
</template>
