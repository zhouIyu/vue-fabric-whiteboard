import { fabric } from 'fabric'
import { EType } from './enum'
import mitt from 'mitt'
import type { IType, IEEvent, EventBus } from './types.d'
import Graph from './Graph'

class Editor {
  canvas!: fabric.Canvas
  type: IType | string = EType.SELECT
  graph!: Graph
  eventBus = mitt<IEEvent>()

  init(canvasId: string) {
    if (!canvasId) {
      throw new Error('canvasId is required')
    }
    this.canvas = this.createCanvas(canvasId)
    this.graph = new Graph(this, this.canvas)
  }

  getEventBus(): EventBus {
    return this.eventBus
  }

  createCanvas(id: string) {
    const elem = document.getElementById(id)
    const parentElem = elem?.parentElement
    const width = parentElem?.clientWidth || 800
    const height = parentElem?.clientHeight || 600
    return new fabric.Canvas(id, {
      backgroundColor: '#fff',
      width,
      height,
      stopContextMenu: true
    })
  }

  setType(type: IType | string) {
    this.type = type
    if (this.type === EType.SELECT) {
      this.canvas.selection = true
    } else {
      this.canvas.selection = false
      this.graph.setType(type)
    }
  }
}

export default Editor
