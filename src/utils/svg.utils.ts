import { select } from 'd3-selection'
import { BoundingBox, ConnectionStyle, Edge, Point } from '@/lib/types'

export function createSvgContainer(box: BoundingBox): SVGElement {
  // Create container with d3
  const svg = select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
    .style('position', 'absolute')
    .style('left', `${box.x}px`)
    .style('top', `${box.y}px`)
    .style('width', `${box.width}px`)
    .style('height', `${box.height}px`)
    .style('overflow', 'unset')
    .attr('viewBox', `0 0 ${box.width} ${box.height}`)
    .node()

  return svg as SVGElement
}

export function createArrow(end: Point, side: Edge, style: ConnectionStyle): SVGElement {
  const arrow = select(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
    .attr('d', getArrowPath(end, side, style))
    .attr('fill', style.color)
    .attr('stroke', 'none')
    .node()

  return arrow as SVGElement
}

// Helper remains unchanged
function getArrowPath(end: Point, side: Edge, style: ConnectionStyle): string {
  const length = style.arrowType === 'triangle' ? style.thickness * 4 : style.thickness
  const width = style.arrowType === 'triangle' ? style.thickness * 3 : style.thickness

  const paths = {
    right: `M ${end.x},${end.y} l ${length},-${width / 2} l 0,${width} Z`,
    left: `M ${end.x},${end.y} l -${length},-${width / 2} l 0,${width} Z`,
    bottom: `M ${end.x},${end.y} l -${width / 2},${length} l ${width},0 Z`,
    top: `M ${end.x},${end.y} l -${width / 2},-${length} l ${width},0 Z`,
  }
  return paths[side]
}
