import { ECanvasEvent, EEvent } from '.'
import Editor from './Editor'
import { fabric } from 'fabric'

class History {
  private editor: Editor
  private canvas: fabric.Canvas
  private isCanUndo: boolean = false
  private isCanRedo: boolean = false
  private undoStack: string[] = []
  private redoStack: string[] = []
  private current: string = ''
  private processing: boolean = false

  constructor(editor: Editor, canvas: fabric.Canvas) {
    this.editor = editor
    this.canvas = canvas
    this.init()
  }

  private init() {
    this.current = this.getJson()
    const { canvas } = this
    canvas.on(ECanvasEvent.OBJECT_ADD, () => this.saveHistory())
    canvas.on(ECanvasEvent.OBJECT_MODIFIED, () => this.saveHistory())
  }

  private getJson(): string {
    return JSON.stringify(this.canvas.toDatalessJSON(['myId']))
  }

  private saveHistory() {
    if (this.processing) return
    const json = this.current
    this.undoStack.push(json)
    this.current = this.getJson()
    this.setType()
  }

  private setType() {
    const { eventBus } = this.editor
    let isUndo: boolean = this.isCanUndo
    if (!this.isCanUndo && this.undoStack.length > 0) {
      isUndo = true
      eventBus.emit(EEvent.CHANGE_UNDO_TYPE, this.isCanUndo)
    } else if (this.isCanUndo && this.undoStack.length === 0) {
      isUndo = false
    }

    if (isUndo !== this.isCanUndo) {
      this.isCanUndo = isUndo
      eventBus.emit(EEvent.CHANGE_UNDO_TYPE, this.isCanUndo)
    }

    let isRedo: boolean = this.isCanRedo
    if (!this.isCanRedo && this.redoStack.length > 0) {
      isRedo = true
    } else if (this.isCanUndo && this.redoStack.length === 0) {
      isRedo = false
    }

    if (isRedo !== this.isCanRedo) {
      this.isCanRedo = isRedo
      eventBus.emit(EEvent.CHANGE_REDO_TYPE, this.isCanRedo)
    }
  }

  undo() {
    this.processing = true
    const currentHistory = this.undoStack.pop()

    if (currentHistory) {
      this.redoStack.push(this.getJson())
      this.current = currentHistory
      this.renderCanvas()
    } else {
      this.processing = false
    }
    this.setType()
  }

  redo() {
    this.processing = true
    const currentHistory = this.redoStack.pop()

    if (currentHistory) {
      this.undoStack.push(this.getJson())
      this.current = currentHistory
      this.renderCanvas()
    } else {
      this.processing = false
    }
    this.setType()
  }

  private renderCanvas() {
    this.canvas.loadFromJSON(this.current, () => {
      this.canvas.renderAll()
      this.processing = false
    })
  }
}

export default History
