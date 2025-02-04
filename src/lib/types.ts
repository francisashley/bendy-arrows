export type Edge = 'top' | 'right' | 'bottom' | 'left'
export type ArrowType = 'none' | 'triangle' | 'inline'

export interface Point {
  x: number
  y: number
}

export interface ConnectionStyle {
  arrowType: ArrowType
  gap: number
  thickness: number
  color: string
  cornerRadius: number
  sourceEdges: Edge[]
  targetEdges: Edge[]
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface ElementPosition {
  width: number
  height: number
  topLeft: Point
  top: Point
  topRight: Point
  right: Point
  bottomRight: Point
  bottom: Point
  bottomLeft: Point
  left: Point
}

export const defaultConnectionStyle: ConnectionStyle = {
  arrowType: 'inline',
  gap: 0,
  thickness: 8,
  color: '#ffa200',
  cornerRadius: 20,
  sourceEdges: ['top', 'right', 'bottom', 'left'],
  targetEdges: ['left', 'right'],
}

export interface ConnectionPoints {
  start: Point
  end: Point
  control1: Point
  control2: Point
}

export interface ConnectionCallbacks {
  onClick?: (connectionId: string) => void
}

export interface Connection {
  id: string // Add id field
  sourceId: string
  targetId: string
  svg?: SVGElement | null
  style?: Partial<ConnectionStyle>
  isSelected?: boolean
  callbacks?: ConnectionCallbacks
}

export type ConnectionInput = {
  source: string
  target: string
  style?: Partial<ConnectionStyle>
}
