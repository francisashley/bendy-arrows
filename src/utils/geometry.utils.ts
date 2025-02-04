import { BoundingBox, ConnectionStyle, Edge, Point } from '@/lib/types'

function getPreferredEdge(angle: number): Edge {
  if (angle > -60 && angle <= 60) return 'right'
  if (angle > 60 && angle <= 120) return 'bottom'
  if (angle > 120 || angle <= -120) return 'left'
  return 'top'
}

function getBestEdge(preferred: Edge, allowedEdges: Edge[], isTarget: boolean): Edge {
  if (allowedEdges.includes(preferred)) return preferred

  const edgeAngles = { right: 0, bottom: 90, left: 180, top: -90 }
  return allowedEdges.reduce(
    (best, current) => {
      const angleDiff = Math.abs(edgeAngles[current] - edgeAngles[preferred])
      const normalizedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff
      const score = isTarget && (current === 'left' || current === 'right') ? normalizedDiff * 0.5 : normalizedDiff

      return score < best.score ? { edge: current, score } : best
    },
    { edge: allowedEdges[0], score: 360 },
  ).edge
}

export function getSides(sourceCenter: Point, targetCenter: Point, style: ConnectionStyle): [Edge, Edge] {
  const angle = Math.atan2(targetCenter.y - sourceCenter.y, targetCenter.x - sourceCenter.x) * (180 / Math.PI)
  const normalizedAngle = ((angle + 180) % 360) - 180

  const preferredSourceEdge = getPreferredEdge(normalizedAngle)
  const preferredTargetEdge = targetCenter.x >= sourceCenter.x ? 'left' : 'right'

  return [
    getBestEdge(preferredSourceEdge, style.sourceEdges, false),
    getBestEdge(preferredTargetEdge, style.targetEdges, true),
  ]
}

export function calculateControlPoints(
  start: Point,
  end: Point,
  startSide: Edge,
  endSide: Edge,
  style: ConnectionStyle,
) {
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
  const curveStrength = getCurveStrength(distance, style)

  if ((startSide === 'top' || startSide === 'bottom') && (endSide === 'left' || endSide === 'right')) {
    return getVerticalToHorizontalControls(start, end, startSide, endSide)
  }

  // Default case - simplified control points
  return {
    control1: {
      x:
        startSide === 'right'
          ? Math.min(midX, start.x + curveStrength)
          : startSide === 'left'
            ? Math.max(midX, start.x - curveStrength)
            : start.x,
      y:
        startSide === 'bottom'
          ? Math.min(midY, start.y + curveStrength)
          : startSide === 'top'
            ? Math.max(midY, start.y - curveStrength)
            : start.y,
    },
    control2: {
      x:
        endSide === 'left'
          ? Math.max(midX, end.x - curveStrength)
          : endSide === 'right'
            ? Math.min(midX, end.x + curveStrength)
            : end.x,
      y:
        endSide === 'bottom'
          ? Math.min(midY, end.y + curveStrength)
          : endSide === 'top'
            ? Math.max(midY, end.y - curveStrength)
            : end.y,
    },
  }
}

function getCurveStrength(distance: number, style: ConnectionStyle): number {
  const thicknessScale = 1 + style.thickness / 10
  const baseRadius = style.cornerRadius * thicknessScale
  const minCurveStrength = Math.max(25, distance * 0.4)
  return Math.max(minCurveStrength, baseRadius)
}

function getVerticalToHorizontalControls(
  start: Point,
  end: Point,
  startSide: Edge,
  endSide: Edge,
): {
  control1: Point
  control2: Point
} {
  const fixedExtension = 35
  return {
    control1: {
      x: start.x,
      y: startSide === 'bottom' ? start.y + fixedExtension : start.y - fixedExtension,
    },
    control2: {
      x: endSide === 'left' ? end.x - fixedExtension : end.x + fixedExtension,
      y: end.y,
    },
  }
}

export function getConnectionBoundingBox(start: Point, end: Point): BoundingBox {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.max(Math.abs(end.x - start.x), 1),
    height: Math.max(Math.abs(end.y - start.y), 1),
  }
}
