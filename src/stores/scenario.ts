import { defineStore } from 'pinia'
import {
  useTask,
  useErrorRetry,
  useStaleState,
  useDeferredScope,
  PromiseStateAtomic,
  wheneverFulfilled,
} from '@vue-kakuyaku/core'
import { Scenario } from '../types/scenario'
import { computed, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import fde from 'fast-deep-equal'

function useRemoteScenario() {
  const { state, run: getScenario } = useTask(
    async () => {
      const scenario: Scenario | null = await fetch('/api/scenario').then((x) =>
        x.status === 204 ? null : x.json()
      )
      return scenario
    },
    { immediate: true }
  )

  useErrorRetry(state, getScenario, { count: Infinity })
  const stale = useStaleState(state)

  const submit = useDeferredScope<PromiseStateAtomic<void>>()

  function updateScenario(json: string): void {
    submit.setup(() => {
      const { state } = useTask(
        async () => {
          await fetch('/api/scenario', {
            method: 'put',
            body: json,
            headers: { 'Content-Type': 'application/json' },
          }).then((x) => {
            if (!x.ok) throw new Error(String(x))
          })
        },
        { immediate: true }
      )

      wheneverFulfilled(state, getScenario)

      return state
    })
  }

  const updatingState = computed(() => submit.scope.value?.expose ?? null)

  return {
    loadingState: stale,
    updatingState,
    updateScenario,
    updateLoaded: getScenario,
  }
}

export const useScenarioStore = defineStore('scenario', () => {
  const { loadingState, updatingState, updateScenario, updateLoaded } =
    useRemoteScenario()

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

  function updateByLocal() {
    updateScenario(localScenario.value)
  }

  return {
    loadingState,
    updatingState,
    localScenario,
    updateByLocal,
    updateLoaded,
    isLocalDiffersFromRemote,
    isValidToSubmit,
  }
})
