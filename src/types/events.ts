import { TransactionId } from './scenario'

export type Variant<T extends string, C = undefined> = {
  type: T
} & (C extends undefined ? {} : { content: C })

export interface WithTransactionId {
  transaction_id: TransactionId
}

export type DvpEvent =
  | Variant<'Message', string>
  | Variant<'ScenarioStarted', WithTransactionId>
  | Variant<'ScenarioReachedCactus', WithTransactionId>
  | Variant<'CactusResponseReceived', WithTransactionId>
  | Variant<'ScenarioFinished', WithTransactionId>
  | Variant<'Error', DvpError>

export type DvpError = Variant<'NotEnoughMoney'>
