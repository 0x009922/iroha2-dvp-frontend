import { defineStore } from 'pinia'
import {
  useTask,
  useErrorRetry,
  useStaleState,
  useDeferredScope,
  PromiseStateAtomic,
  wheneverFulfilled,
} from '@vue-kakuyaku/core'
import { computed, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import fde from 'fast-deep-equal'
import * as api from '../api'

function useRemoteScenario() {
  const { state, run: getScenario } = useTask(async () => api.getScenario(), {
    immediate: true,
  })

  useErrorRetry(state, getScenario, { count: Infinity })
  const stale = useStaleState(state)

  const lastLoadedAt = ref<null | Date>(null)
  wheneverFulfilled(state, () => {
    lastLoadedAt.value = new Date()
  })

  const submit = useDeferredScope<PromiseStateAtomic<void>>()

  function updateScenario(json: string): void {
    submit.setup(() => {
      const { state } = useTask(async () => api.putScenario(json), {
        immediate: true,
      })

      wheneverFulfilled(state, getScenario)

      return state
    })
  }

  const updatingState = computed(() => submit.scope.value?.expose ?? null)

  return {
    loadingState: stale,
    lastLoadedAt,
    updatingState,
    updateScenario,
    updateLoaded: getScenario,
  }
}

export const useScenarioStore = defineStore('scenario', () => {
  const {
    loadingState,
    updatingState,
    updateScenario,
    updateLoaded,
    lastLoadedAt,
  } = useRemoteScenario()

  const localScenario = useLocalStorage('local-scenario', '')

  const localDeser = computed<null | unknown>(() => {
    try {
      return JSON.parse(localScenario.value)
    } catch {
      return null
    }
  })

  const isLocalDiffersFromRemote = computed<boolean>(() => {
    const remote = loadingState.fulfilled?.value ?? null
    const local = localDeser.value

    if (local) {
      if (!remote) return true
      return !fde(local, remote)
    } else return remote ? true : false
  })

  const isValidToSubmit = computed<boolean>(() => !!localDeser.value)

  watch(
    () => loadingState.fulfilled?.value,
    (value) => {
      if (value) {
        localScenario.value = JSON.stringify(value, null, 4)
      }
    }
  )

  const { run: runScenario, state: runScenarioState } = useTask(() =>
    api.runScenario()
  )

  function updateByLocal() {
    updateScenario(localScenario.value)
  }

  return {
    lastLoadedAt,
    loadingState,
    updatingState,
    localScenario,
    updateByLocal,
    updateLoaded,
    isLocalDiffersFromRemote,
    isValidToSubmit,
    runScenario,
    runScenarioState,
  }
})
