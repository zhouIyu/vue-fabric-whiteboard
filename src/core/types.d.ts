import { EType, EEvent } from './enum'
import type { Emitter } from 'mitt'

declare type IType = `${EType}`

declare type IEEvent = {
  [EEvent.CHANGE_TYPE]: IType | string
}

declare type EventBus = Emitter<IEEvent>
