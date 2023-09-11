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
  MOUSE_UP = 'mouse:up'
}

// 向外暴露事件
export enum EEvent {
  CHANGE_TYPE = 'change:type'
}
