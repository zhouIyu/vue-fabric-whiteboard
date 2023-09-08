import { fabric } from 'fabric'
import { EType } from './enum'

type IType = `${EType}`

class Editor {
  canvas: fabric.Canvas
  type: IType | string = EType.SELECT
  isMouseDown: boolean = false
  mouseDownPoint: fabric.Point | null = null
  activeObject: fabric.Object | null = null
  strokeColor: string = '#f00'
  strokeWidth: number = 2

  constructor(id: string) {
    if (!id) throw new Error('id is required')

    this.canvas = this.createCanvas(id)
    this.addListener()
  }

  _mouseDownHandler(e: fabric.IEvent) {
    if (this.type !== EType.SELECT) {
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
    console.log(this.activeObject)
    this.canvas.renderAll()
  }

  _mouseUpHandler() {
    this.isMouseDown = false
    if (this.type !== EType.SELECT) {
      this.type = EType.SELECT
      this.canvas.selection = true
      this.canvas.setActiveObject(this.activeObject!)
      this.canvas.drawControls(this.canvas.getContext())
    }
  }

  addListener() {
    this.canvas.on('mouse:down', this._mouseDownHandler.bind(this))

    this.canvas.on('mouse:move', this._mouseMoveHandler.bind(this))

    this.canvas.on('mouse:up', this._mouseUpHandler.bind(this))
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
    console.log(this)
    const { x, y } = this.mouseDownPoint!
    return new fabric.Rect({
      left: x,
      top: y,
      fill: 'transparent',
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true
    })
  }

  triangleGraph(): fabric.Triangle {
    const { x, y } = this.mouseDownPoint!
    return new fabric.Triangle({
      left: x,
      top: y,
      fill: 'transparent',
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true
    })
  }

  circleGraph(): fabric.Circle {
    const { x, y } = this.mouseDownPoint!
    return new fabric.Circle({
      left: x,
      top: y,
      radius: 0,
      fill: 'transparent',
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true
    })
  }

  // 椭圆
  ellipseGraph(): fabric.Ellipse {
    const { x, y } = this.mouseDownPoint!
    return new fabric.Ellipse({
      left: x,
      top: y,
      rx: 0,
      ry: 0,
      fill: 'transparent',
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true
    })
  }
}

export default Editor
