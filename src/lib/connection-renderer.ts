import { getSides, getConnectionBoundingBox } from '../utils/geometry.utils'
import { findCommonContainer, getElementPosition } from '../utils/dom.utils'
import { createSvgContainer, createArrow } from '../utils/svg.utils'
import { defaultConnectionStyle } from './types'
import { generateConnectionPath } from '../utils/path.utils'

export function renderConnection(
  source: HTMLElement,
  target: HTMLElement,
  style = defaultConnectionStyle,
): SVGElement | null {
  if (style.sourceEdges.length === 0 || style.targetEdges.length === 0) return null

  const container = findCommonContainer(source, target)
  if (!container) throw new Error('Could not find common container')

  const sourcePos = getElementPosition(source, container)
  const targetPos = getElementPosition(target, container)

  const sourceCenter = {
    x: sourcePos.topLeft.x + sourcePos.width / 2,
    y: sourcePos.topLeft.y + sourcePos.height / 2,
  }
  const targetCenter = {
    x: targetPos.topLeft.x + targetPos.width / 2,
    y: targetPos.topLeft.y + targetPos.height / 2,
  }

  const [startSide, endSide] = getSides(sourceCenter, targetCenter, style)

  // Apply gap offset
  const start = {
    x: sourcePos[startSide].x + (startSide === 'right' ? style.gap : startSide === 'left' ? -style.gap : 0),
    y: sourcePos[startSide].y + (startSide === 'bottom' ? style.gap : startSide === 'top' ? -style.gap : 0),
  }

  const end = {
    x: targetPos[endSide].x + (endSide === 'right' ? style.gap : endSide === 'left' ? -style.gap : 0),
    y: targetPos[endSide].y + (endSide === 'bottom' ? style.gap : endSide === 'top' ? -style.gap : 0),
  }

  const boundingBox = getConnectionBoundingBox(start, end)
  const svg = createSvgContainer(boundingBox)

  const relativeStart = {
    x: start.x - boundingBox.x,
    y: start.y - boundingBox.y,
  }

  const relativeEnd = {
    x: end.x - boundingBox.x,
    y: end.y - boundingBox.y,
  }

  // Create path using d3
  const ARROW_LENGTH = style.arrowType === 'triangle' ? style.thickness * 4 : style.thickness
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute(
    'd',
    generateConnectionPath(
      relativeStart,
      relativeEnd,
      startSide,
      endSide,
      style.arrowType !== 'none' ? ARROW_LENGTH : 0,
    ),
  )
  path.setAttribute('stroke', style.color)
  path.setAttribute('stroke-width', style.thickness.toString())
  path.setAttribute('fill', 'none')
  path.classList.add('arrow-path')
  svg.appendChild(path)

  if (style.arrowType !== 'none') {
    const arrow = createArrow(relativeEnd, endSide, style)
    if (arrow) {
      arrow.classList.add('arrow-head')
      svg.appendChild(arrow)
    }
  }

  container.appendChild(svg)
  return svg
}
