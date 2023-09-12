// 编辑模式
export enum EType {
  SELECT = 'select',
  RECT = 'rect',
  TRIANGLE = 'triangle',
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse'
}

// 画布事件
export enum ECanvasEvent {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  OBJECT_ADD = 'object:added',
  OBJECT_MODIFIED = 'object:modified'
}

// 向外暴露事件
export enum EEvent {
  CHANGE_GRAPH_TYPE = 'change:graph',
  CHANGE_UNDO_TYPE = 'change:undo',
  CHANGE_REDO_TYPE = 'change:redo'
}
