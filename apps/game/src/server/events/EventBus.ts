/**
 * EventBus.ts - A simple, typed event bus for game events.
 * 
 * Features:
 * - Synchronous event processing (JavaScript is single-threaded)
 * - Type-safe event handlers with full TypeScript support
 * - Support for wildcard handlers that receive all events
 * - Handler priority ordering
 * - One-time handlers
 * 
 * Usage:
 *   const bus = new EventBus();
 *   
 *   // Subscribe to specific event type
 *   bus.on("PlayerMoved", (event) => {
 *     console.log(event.userId, event.newPosition);
 *   });
 *   
 *   // Subscribe to all events
 *   bus.onAll((event) => {
 *     console.log("Event:", event.type);
 *   });
 *   
 *   // Emit an event
 *   bus.emit(createPlayerMovedEvent(userId, oldPos, newPos));
 */

import type { GameEvent, GameEventType } from "./GameEvents";

/**
 * Event handler function type.
 */
export type EventHandler<E extends GameEvent = GameEvent> = (event: E) => void;

/**
 * Handler registration with metadata.
 */
interface HandlerRegistration<E extends GameEvent = GameEvent> {
  handler: EventHandler<E>;
  priority: number;
  once: boolean;
}

/**
 * Extract event type from union by type field.
 */
type ExtractEvent<T extends GameEventType> = Extract<GameEvent, { type: T }>;

/**
 * Options for registering an event handler.
 */
export interface HandlerOptions {
  /** Handler priority (higher = runs first). Default: 0 */
  priority?: number;
  /** If true, handler is removed after first invocation. Default: false */
  once?: boolean;
}

/**
 * A type-safe, synchronous event bus for game events.
 */
export class EventBus {
  private handlers = new Map<string, HandlerRegistration[]>();
  private wildcardHandlers: HandlerRegistration[] = [];
  private handlerIdCounter = 0;
  
  /**
   * Registers a handler for a specific event type.
   * 
   * @param eventType The event type to listen for
   * @param handler The handler function
   * @param options Handler options (priority, once)
   * @returns Unsubscribe function
   */
  on<T extends GameEventType>(
    eventType: T,
    handler: EventHandler<ExtractEvent<T>>,
    options: HandlerOptions = {}
  ): () => void {
    const { priority = 0, once = false } = options;
    const registration: HandlerRegistration = {
      handler: handler as EventHandler,
      priority,
      once
    };

    let handlers = this.handlers.get(eventType);
    if (!handlers) {
      handlers = [];
      this.handlers.set(eventType, handlers);
    }
    handlers.push(registration);
    handlers.sort((a, b) => b.priority - a.priority);

    // Return unsubscribe function
    return () => {
      const idx = handlers!.indexOf(registration);
      if (idx !== -1) {
        handlers!.splice(idx, 1);
      }
    };
  }

  /**
   * Registers a one-time handler for a specific event type.
   * Handler is automatically removed after first invocation.
   * 
   * @param eventType The event type to listen for
   * @param handler The handler function
   * @param priority Handler priority
   * @returns Unsubscribe function
   */
  once<T extends GameEventType>(
    eventType: T,
    handler: EventHandler<ExtractEvent<T>>,
    priority: number = 0
  ): () => void {
    return this.on(eventType, handler, { priority, once: true });
  }

  /**
   * Registers a handler that receives ALL events.
   * 
   * @param handler The handler function
   * @param options Handler options (priority, once)
   * @returns Unsubscribe function
   */
  onAll(handler: EventHandler, options: HandlerOptions = {}): () => void {
    const { priority = 0, once = false } = options;
    const registration: HandlerRegistration = {
      handler,
      priority,
      once
    };

    this.wildcardHandlers.push(registration);
    this.wildcardHandlers.sort((a, b) => b.priority - a.priority);

    // Return unsubscribe function
    return () => {
      const idx = this.wildcardHandlers.indexOf(registration);
      if (idx !== -1) {
        this.wildcardHandlers.splice(idx, 1);
      }
    };
  }

  /**
   * Removes all handlers for a specific event type.
   * 
   * @param eventType The event type to clear
   */
  off(eventType: GameEventType): void {
    this.handlers.delete(eventType);
  }

  /**
   * Removes all handlers (both specific and wildcard).
   */
  clear(): void {
    this.handlers.clear();
    this.wildcardHandlers.length = 0;
  }

  /**
   * Emits an event to all registered handlers.
   * Handlers are called synchronously in priority order.
   * 
   * @param event The event to emit
   */
  emit<E extends GameEvent>(event: E): void {
    // First, call type-specific handlers
    const handlers = this.handlers.get(event.type);
    if (handlers && handlers.length > 0) {
      // Process handlers, removing once handlers after execution
      const toRemove: number[] = [];
      for (let i = 0; i < handlers.length; i++) {
        const registration = handlers[i];
        try {
          registration.handler(event);
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${event.type}:`, err);
        }
        if (registration.once) {
          toRemove.push(i);
        }
      }
      // Remove once handlers in reverse order to preserve indices
      for (let i = toRemove.length - 1; i >= 0; i--) {
        handlers.splice(toRemove[i], 1);
      }
    }

    // Then, call wildcard handlers
    if (this.wildcardHandlers.length > 0) {
      const toRemove: number[] = [];
      for (let i = 0; i < this.wildcardHandlers.length; i++) {
        const registration = this.wildcardHandlers[i];
        try {
          registration.handler(event);
        } catch (err) {
          console.error(`[EventBus] Error in wildcard handler for ${event.type}:`, err);
        }
        if (registration.once) {
          toRemove.push(i);
        }
      }
      for (let i = toRemove.length - 1; i >= 0; i--) {
        this.wildcardHandlers.splice(toRemove[i], 1);
      }
    }
  }

  /**
   * Checks if there are any handlers for a specific event type.
   */
  hasHandlers(eventType: GameEventType): boolean {
    const handlers = this.handlers.get(eventType);
    return (handlers && handlers.length > 0) || this.wildcardHandlers.length > 0;
  }

  /**
   * Gets the count of handlers for a specific event type.
   */
  handlerCount(eventType?: GameEventType): number {
    if (eventType) {
      const handlers = this.handlers.get(eventType);
      return (handlers?.length ?? 0) + this.wildcardHandlers.length;
    }
    // Total handler count
    let total = this.wildcardHandlers.length;
    for (const handlers of this.handlers.values()) {
      total += handlers.length;
    }
    return total;
  }
}

// ============================================================================
// Singleton instance for convenience
// ============================================================================

let globalEventBus: EventBus | null = null;

/**
 * Gets or creates the global event bus instance.
 */
export function getEventBus(): EventBus {
  if (!globalEventBus) {
    globalEventBus = new EventBus();
  }
  return globalEventBus;
}

/**
 * Resets the global event bus (mainly for testing).
 */
export function resetEventBus(): void {
  globalEventBus?.clear();
  globalEventBus = null;
}
