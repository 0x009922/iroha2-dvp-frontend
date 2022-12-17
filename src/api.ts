import Axios, { AxiosError } from 'axios'
import { Scenario } from './types/scenario'

function isAxiosError(x: unknown): x is AxiosError {
  return (x as AxiosError).isAxiosError
}

export async function getScenario(): Promise<Scenario | null> {
  return Axios.get<Scenario | null>('/api/scenario').then((x) => x.data)
}

export async function putScenario(scenarioJson: string): Promise<void> {
  return Axios.put('/api/scenario', scenarioJson, {
    headers: { 'content-type': 'application/json' },
  })
    .then(() => {})
    .catch((err) => {
      if (isAxiosError(err) && err.response?.status === 400) {
        console.error(
          `[PUT scenario] Bad request:\n\n${String(err.response.data)}`
        )
      }
      throw err
    })
}
