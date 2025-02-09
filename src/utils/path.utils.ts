import { line, curveBasis, linkHorizontal, linkVertical } from 'd3-shape'
import { Edge, Point } from '../lib/types'

export function generateBezierPath(start: Point, end: Point, control1: Point, control2: Point): string {
  const pathGenerator = line<Point>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBasis)

  return pathGenerator([start, control1, control2, end]) || ''
}

function adjustEndPoint(end: Point, endSide: Edge, arrowLength: number): Point {
  const offsets = {
    left: { x: -arrowLength, y: 0 }, // Changed: subtract for left
    right: { x: arrowLength, y: 0 }, // Changed: add for right
    top: { x: 0, y: -arrowLength }, // Changed: subtract for top
    bottom: { x: 0, y: arrowLength }, // Changed: add for bottom
  }
  const offset = offsets[endSide]
  return { x: end.x + offset.x, y: end.y + offset.y }
}

export function generateConnectionPath(
  start: Point,
  end: Point,
  startSide: Edge,
  endSide: Edge,
  arrowLength: number = 0,
): string {
  const adjustedEnd = arrowLength ? adjustEndPoint(end, endSide, arrowLength) : end
  if (startSide === 'left' || startSide === 'right' || endSide === 'left' || endSide === 'right') {
    return (
      linkHorizontal()({
        source: [start.x, start.y],
        target: [adjustedEnd.x, adjustedEnd.y],
      }) || ''
    )
  }

  return (
    linkVertical()({
      source: [start.x, start.y],
      target: [adjustedEnd.x, adjustedEnd.y],
    }) || ''
  )
}
