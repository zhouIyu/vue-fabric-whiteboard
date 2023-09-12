import { EType, EEvent } from './enum'
import type { Emitter } from 'mitt'

declare type IType = `${EType}`

declare type IEEvent = {
  [EEvent.CHANGE_GRAPH_TYPE]: IType | string
  [EEvent.CHANGE_UNDO_TYPE]: boolean
  [EEvent.CHANGE_REDO_TYPE]: boolean
}

declare type EventBus = Emitter<IEEvent>
