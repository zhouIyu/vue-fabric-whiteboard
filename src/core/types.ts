import { EType, EEvent } from './enum'
import type { Emitter } from 'mitt'

export type IType = `${EType}`

export type IEEvent = {
  [EEvent.CHANGE_TYPE]: IType | string
}

export type EventBus = Emitter<IEEvent>
