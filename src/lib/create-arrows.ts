import { v4 as uuidv4 } from 'uuid'
import { renderConnection } from './connection-renderer'
import { Connection, ConnectionStyle, defaultConnectionStyle } from './types'

export function createArrows(
  options: {
    defaultStyle?: Partial<ConnectionStyle>
    onClick?: (id: string) => void
  } = {},
) {
  const connections = new Map<string, Connection>()
  let selectedId: string | null = null
  const currentStyle = { ...defaultConnectionStyle, ...options.defaultStyle }

  return {
    setConnections(newConnections: Array<{ source: string; target: string }>) {
      // Clear existing
      connections.forEach((conn) => conn.svg?.remove())
      connections.clear()
      selectedId = null

      // Add new
      newConnections.forEach(({ source, target }) => {
        const id = uuidv4()
        const [sourceEl, targetEl] = [document.getElementById(source), document.getElementById(target)]
        if (sourceEl && targetEl) {
          const svg = renderConnection(sourceEl, targetEl, currentStyle)
          if (svg && options.onClick) {
            this.addClickHandler(svg, id)
          }
          connections.set(id, { sourceId: source, targetId: target, svg, id })
        }
      })
    },

    addConnection(source: string, target: string) {
      const id = uuidv4()
      const [sourceEl, targetEl] = [document.getElementById(source), document.getElementById(target)]
      if (sourceEl && targetEl) {
        const svg = renderConnection(sourceEl, targetEl, currentStyle)
        if (svg && options.onClick) {
          this.addClickHandler(svg, id)
        }
        connections.set(id, { sourceId: source, targetId: target, svg, id })
        return id
      }
      return null
    },

    removeConnection(id: string) {
      const connection = connections.get(id)
      if (connection) {
        connection.svg?.remove()
        connections.delete(id)
        if (selectedId === id) {
          selectedId = null
        }
      }
    },

    getConnection(id: string) {
      return connections.get(id) || null
    },

    updateConnection(id: string, changes: { source?: string; target?: string }) {
      const connection = connections.get(id)
      if (connection) {
        const sourceId = changes.source || connection.sourceId
        const targetId = changes.target || connection.targetId
        const [sourceEl, targetEl] = [document.getElementById(sourceId), document.getElementById(targetId)]
        if (sourceEl && targetEl) {
          connection.svg?.remove()
          connection.svg = renderConnection(sourceEl, targetEl, currentStyle)
          if (connection.svg && options.onClick) {
            this.addClickHandler(connection.svg, id)
          }
          connection.sourceId = sourceId
          connection.targetId = targetId
        }
      }
    },

    selectConnection(id: string | null) {
      if (selectedId === id) return

      if (selectedId) {
        const prev = connections.get(selectedId)
        if (prev) {
          prev.isSelected = false
          this.updateConnectionStyle(selectedId)
        }
      }

      selectedId = id
      if (id) {
        const curr = connections.get(id)
        if (curr) {
          curr.isSelected = true
          this.updateConnectionStyle(id)
        }
      }
    },

    getSelectedConnection() {
      return selectedId
    },

    updateStyle(style: Partial<ConnectionStyle>, id?: string) {
      if (id) {
        const connection = connections.get(id)
        if (connection) {
          connection.style = { ...(connection.style || {}), ...style }
          this.updateConnectionStyle(id)
        }
      } else {
        Object.assign(currentStyle, style)
        connections.forEach((_, id) => this.updateConnectionStyle(id))
      }
    },

    getStyle(id?: string) {
      if (id) {
        const connection = connections.get(id)
        if (connection && connection.style) {
          return { ...currentStyle, ...connection.style }
        }
      }
      return { ...currentStyle }
    },

    addClickHandler(svg: SVGElement, id: string) {
      const elements = svg.querySelectorAll('.arrow-path, .arrow-head')
      elements.forEach((el) => {
        if (el instanceof SVGElement) {
          el.style.cursor = 'pointer'
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            options.onClick?.(id)
          })
        }
      })
    },

    updateConnectionStyle(id: string) {
      const connection = connections.get(id)
      if (connection) {
        const [sourceEl, targetEl] = [
          document.getElementById(connection.sourceId),
          document.getElementById(connection.targetId),
        ]
        if (sourceEl && targetEl) {
          connection.svg?.remove()
          const style = {
            ...currentStyle,
            ...connection.style,
            ...(connection.isSelected
              ? { thickness: (connection.style?.thickness || currentStyle.thickness) + 2 }
              : {}),
          }
          connection.svg = renderConnection(sourceEl, targetEl, style)
          if (connection.svg && options.onClick) {
            this.addClickHandler(connection.svg, id)
          }
        }
      }
    },

    updateAll() {
      connections.forEach((connection, id) => {
        const [sourceEl, targetEl] = [
          document.getElementById(connection.sourceId),
          document.getElementById(connection.targetId),
        ]
        if (sourceEl && targetEl) {
          connection.svg?.remove()
          const style = {
            ...currentStyle,
            ...connection.style,
            ...(connection.isSelected
              ? { thickness: (connection.style?.thickness || currentStyle.thickness) + 2 }
              : {}),
          }
          connection.svg = renderConnection(sourceEl, targetEl, style)
          if (connection.svg && options.onClick) {
            this.addClickHandler(connection.svg, id)
          }
        }
      })
    },

    destroy() {
      connections.forEach((conn) => conn.svg?.remove())
      connections.clear()
      selectedId = null
    },
  }
}
