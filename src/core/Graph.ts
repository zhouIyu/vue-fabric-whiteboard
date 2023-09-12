import { fabric } from 'fabric'
import Editor, { ECanvasEvent, EEvent, EType } from '.'
import type { IType } from './types'

type GraphType = Omit<IType, EType.SELECT>

type GraphOptions = {
  strokeColor: string
  strokeWidth: number
}

class Graph {
  editor: Editor
  canvas: fabric.Canvas
  type: GraphType = ''
  isMouseDown: boolean = false
  mouseDownPoint: fabric.Point | null = null
  activeObject: fabric.Object | null = null
  options: GraphOptions = {
    strokeColor: '#f00',
    strokeWidth: 2
  }
  constructor(editor: Editor, canvas: fabric.Canvas) {
    this.canvas = canvas
    this.editor = editor
    this.addListener()
  }

  addListener() {
    this.canvas.on(ECanvasEvent.MOUSE_DOWN, this._mouseDownHandler.bind(this))

    this.canvas.on(ECanvasEvent.MOUSE_MOVE, this._mouseMoveHandler.bind(this))

    this.canvas.on(ECanvasEvent.MOUSE_UP, this._mouseUpHandler.bind(this))
  }

  setType(type: GraphType) {
    this.type = type
  }

  _mouseDownHandler(e: fabric.IEvent) {
    if (this.type !== '') {
      this.isMouseDown = true
      this.mouseDownPoint = e.pointer!
      this.createGraph()
    }
  }

  _mouseMoveHandler(e: fabric.IEvent) {
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
    this.activeObject?.setOptions({
      my_id: 1
    })
    this.canvas.renderAll()
  }

  _mouseUpHandler() {
    this.isMouseDown = false
    if (this.type !== '') {
      const { canvas, editor } = this
      editor.setType(EType.SELECT)
      canvas.setActiveObject(this.activeObject!)
      canvas.drawControls(this.canvas.getContext())
      editor.eventBus.emit(EEvent.CHANGE_TYPE, EType.SELECT)
      this.setType('')
    }
  }

  createGraph() {
    const funcName = `${this.type}Graph` as keyof this
    const func = this[funcName] as () => fabric.Object
    const graph: fabric.Object = func.bind(this)()
    graph?.setCoords(true)
    this.activeObject = graph
    this.canvas.add(graph!)
  }

  rectGraph(): fabric.Rect {
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

  triangleGraph(): fabric.Triangle {
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

  circleGraph(): fabric.Circle {
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
  ellipseGraph(): fabric.Ellipse {
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
