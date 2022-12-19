import { DvpEvent } from './types/events'

export default [
  {
    type: 'parsed',
    event: {
      type: 'Error',
      content: { type: 'NotEnoughMoney' },
    },
    timestamp: new Date(),
  },
  {
    type: 'parsed',
    event: {
      type: 'ScenarioStarted',
      content: { transaction_id: '123321' },
    },
    timestamp: new Date(),
  },
  {
    type: 'parsed',
    event: {
      type: 'ScenarioReachedCactus',
      content: { transaction_id: '123321' },
    },
    timestamp: new Date(),
  },
  {
    type: 'parsed',
    event: {
      type: 'CactusResponseReceived',
      content: { transaction_id: '123321' },
    },
    timestamp: new Date(),
  },
  {
    type: 'parsed',
    event: {
      type: 'ScenarioFinished',
      content: { transaction_id: '123321' },
    },
    timestamp: new Date(),
  },
  {
    type: 'parsed',
    event: {
      type: 'Message',
      content: 'hey yo',
    } satisfies DvpEvent,
    timestamp: new Date(),
  },
]
