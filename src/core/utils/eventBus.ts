import mitt, { type Emitter } from 'mitt'
import type { EEvent } from '..'
import type { IType } from '../types'

type IEEvent = {
  [EEvent.CHANGE_GRAPH_TYPE]: IType | string
  [EEvent.CHANGE_UNDO_TYPE]: boolean
  [EEvent.CHANGE_REDO_TYPE]: boolean
}

type EventBus = Emitter<IEEvent>

export const eventBus: EventBus = mitt<IEEvent>()
