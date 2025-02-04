import mitt, { Emitter } from 'mitt'

type Events = {
  'connection:select': string | null
  'connection:update': void
  'style:update': void
}

class EventBus {
  private emitter: Emitter<Events>

  constructor() {
    this.emitter = mitt<Events>()
  }

  emit<K extends keyof Events>(type: K, event: Events[K]): void {
    this.emitter.emit(type, event)
  }

  on<K extends keyof Events>(type: K, handler: (event: Events[K]) => void): void {
    this.emitter.on(type, handler as any)
  }

  off<K extends keyof Events>(type: K, handler: (event: Events[K]) => void): void {
    this.emitter.off(type, handler as any)
  }
}

export const eventBus = new EventBus()
