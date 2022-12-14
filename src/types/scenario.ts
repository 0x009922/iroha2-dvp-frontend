export type TransactionId = string

export type Direction = 'Buy' | 'Sell'

export type AccountNumber = number

export type SecuritiesToken = string

export type Amount = string

export type CurrencyIndicator = string

export type CurrencyToken = string

export type Timestamp = string

export interface Scenario {
  transaction_id: TransactionId
  direction: Direction
  input_timestamp: Timestamp
  settlement_deadline: Timestamp

  securities_from: AccountNumber
  securities_to: AccountNumber
  securities_asset_isin_id: String
  securities_token_id: SecuritiesToken
  securities_amount: Amount

  local_currency: CurrencyIndicator
  local_currency_id: CurrencyToken
  local_currency_from: AccountNumber
  local_currency_to: AccountNumber
  local_currency_amount: Amount

  foreign_currency: CurrencyIndicator
  foreign_currency_id: CurrencyToken
  foreign_currency_from: AccountNumber
  foreign_currency_to: AccountNumber
  foreign_currency_amount: Amount

  vendor_extension_field: String
}
