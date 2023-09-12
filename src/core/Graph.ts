import { fabric } from 'fabric'
import Editor, { ECanvasEvent, EEvent, EType } from '.'
import type { IType } from './types'
import { eventBus } from './utils/eventBus'

type GraphType = Omit<IType, EType.SELECT>

type GraphOptions = {
  strokeColor: string
  strokeWidth: number
}

class Graph {
  private editor: Editor
  private canvas: fabric.Canvas
  private type: GraphType = ''
  private isMouseDown: boolean = false
  private mouseDownPoint: fabric.Point | null = null
  private activeObject: fabric.Object | null = null
  private options: GraphOptions = {
    strokeColor: '#f00',
    strokeWidth: 2
  }
  constructor(editor: Editor, canvas: fabric.Canvas) {
    this.canvas = canvas
    this.editor = editor
    this.init()
  }

  private init() {
    this.canvas.on(ECanvasEvent.MOUSE_DOWN, this.mouseDownHandler.bind(this))

    this.canvas.on(ECanvasEvent.MOUSE_MOVE, this.mouseMoveHandler.bind(this))

    this.canvas.on(ECanvasEvent.MOUSE_UP, this.mouseUpHandler.bind(this))
  }

  setType(type: GraphType) {
    this.type = type
  }

  private mouseDownHandler(e: fabric.IEvent) {
    if (this.type !== '') {
      this.isMouseDown = true
      this.mouseDownPoint = e.pointer!
      this.createGraph()
    }
  }

  private mouseMoveHandler(e: fabric.IEvent) {
    if (!this.isMouseDown) {
      return false
    }

    const { x, y } = e.pointer!
    const downPoint = this.mouseDownPoint!
    const dx = x - downPoint.x
    const dy = y - downPoint.y
    if (this.type === EType.CIRCLE) {
      const radius = Math.min(Math.abs(dx), Math.abs(dy)) / 2
      const activeObject: fabric.Circle = this.activeObject as fabric.Circle
      const top = y > downPoint.y ? downPoint.y : downPoint.y - radius * 2
      const left = x > downPoint.x ? downPoint.x : downPoint.x - radius * 2
      activeObject.set({
        left,
        top,
        radius
      })
    } else if (this.type === EType.ELLIPSE) {
      const activeObject: fabric.Ellipse = this.activeObject as fabric.Ellipse
      const rx = Math.abs(dx) / 2
      const ry = Math.abs(dy) / 2
      const left = dx > 0 ? downPoint.x : downPoint.x - rx * 2
      const top = dy > 0 ? downPoint.y : downPoint.y - ry * 2
      activeObject.set({
        left,
        top,
        rx,
        ry
      })
    } else {
      this.activeObject!.set({
        left: dx > 0 ? downPoint.x : x,
        top: dy > 0 ? downPoint.y : y,
        width: Math.abs(dx),
        height: Math.abs(dy)
      })
    }
    this.canvas.renderAll()
  }

  private mouseUpHandler() {
    this.isMouseDown = false
    if (this.type !== '') {
      const { canvas, editor } = this
      editor.setType(EType.SELECT)
      canvas.setActiveObject(this.activeObject!)
      canvas.drawControls(this.canvas.getContext())
      eventBus.emit(EEvent.CHANGE_GRAPH_TYPE, EType.SELECT)
      this.setType('')
    }
  }

  private createGraph() {
    const funcName = `${this.type}Graph` as keyof this
    const func = this[funcName] as () => fabric.Object
    const graph: fabric.Object = func.bind(this)()
    graph?.setCoords(true)
    graph.setOptions({
      myId: Date.now()
    })
    this.activeObject = graph
    this.canvas.add(graph!)
  }

  private rectGraph(): fabric.Rect {
    const { x, y } = this.mouseDownPoint!
    const { strokeColor, strokeWidth } = this.options
    return new fabric.Rect({
      left: x,
      top: y,
      fill: 'transparent',
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeUniform: true
    })
  }

  private triangleGraph(): fabric.Triangle {
    const { x, y } = this.mouseDownPoint!
    const { strokeColor, strokeWidth } = this.options
    return new fabric.Triangle({
      left: x,
      top: y,
      fill: 'transparent',
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeUniform: true
    })
  }

  private circleGraph(): fabric.Circle {
    const { x, y } = this.mouseDownPoint!
    const { strokeColor, strokeWidth } = this.options
    return new fabric.Circle({
      left: x,
      top: y,
      radius: 0,
      fill: 'transparent',
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeUniform: true
    })
  }

  // 椭圆
  private ellipseGraph(): fabric.Ellipse {
    const { x, y } = this.mouseDownPoint!
    const { strokeColor, strokeWidth } = this.options
    return new fabric.Ellipse({
      left: x,
      top: y,
      rx: 0,
      ry: 0,
      fill: 'transparent',
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeUniform: true
    })
  }
}

export default Graph
