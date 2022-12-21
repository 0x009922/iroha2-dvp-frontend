import { TransactionId, TriggerId, TriggerStatus } from './scenario'

export type Variant<T extends string, C = undefined> = {
  type: T
} & (C extends undefined ? {} : { content: C })

export interface WithTransactionId {
  transaction_id: TransactionId
}

export interface WithTriggerExecuted {
  trigger_id: TriggerId,
  status: TriggerStatus,
}

export type DvpEvent =
  | Variant<'Message', string>
  | Variant<'ScenarioStarted', WithTransactionId>
  | Variant<'ScenarioReachedCactus', WithTransactionId>
  | Variant<'CactusResponseReceived', WithTransactionId>
  | Variant<'ScenarioFinished', WithTransactionId>
  | Variant<'TriggerExecuted', WithTriggerExecuted>
  | Variant<'Error', DvpError>

export type DvpError = Variant<'NotEnoughMoney'>
