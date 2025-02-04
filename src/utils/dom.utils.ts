import { ElementPosition } from '@/lib/types'

export function findCommonContainer(element1: HTMLElement, element2: HTMLElement): HTMLElement | null {
  // Get all parent elements including self for first element
  const getParents = (element: HTMLElement): HTMLElement[] => {
    const parents: HTMLElement[] = [element]
    let parent = element.parentElement

    while (parent) {
      parents.push(parent)
      parent = parent.parentElement
    }

    return parents
  }

  const parents1 = getParents(element1)
  const parents2 = getParents(element2)

  // Find first common parent
  for (const parent1 of parents1) {
    if (parents2.includes(parent1)) {
      return parent1
    }
  }

  return null
}

export function getElementPosition(element: HTMLElement, container: HTMLElement): ElementPosition {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  const offset = {
    x: elementRect.left - containerRect.left,
    y: elementRect.top - containerRect.top,
  }

  const width = elementRect.width
  const height = elementRect.height
  const centerX = offset.x + width / 2
  const centerY = offset.y + height / 2

  return {
    width,
    height,
    topLeft: { x: offset.x, y: offset.y },
    top: { x: centerX, y: offset.y },
    topRight: { x: offset.x + width, y: offset.y },
    right: { x: offset.x + width, y: centerY },
    bottomRight: { x: offset.x + width, y: offset.y + height },
    bottom: { x: centerX, y: offset.y + height },
    bottomLeft: { x: offset.x, y: offset.y + height },
    left: { x: offset.x, y: centerY },
  }
}
