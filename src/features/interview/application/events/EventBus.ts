import { DomainEvent } from "../../domain/InterviewAggregate";

/**
 * EventBus Interface
 * 
 * Abstracts event publishing to allow swapping implementations.
 * 
 * Current: LocalEventBus (async execution, suitable for MVP)
 * Future: BullMQEventBus (durable queue for production scale)
 */
export interface EventBus {
  /**
   * Publish a domain event
   * 
   * Implementation note:
   * - LocalEventBus: Executes handlers asynchronously (fire-and-forget)
   * - BullMQEventBus: Pushes to durable queue for guaranteed delivery
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Subscribe a handler to an event type
   * 
   * Implementation note:
   * - LocalEventBus: In-memory handler registration
   * - BullMQEventBus: Worker registration
   */
  subscribe(eventType: string, handler: EventHandler): void;
}

/**
 * Event Handler Type
 */
export type EventHandler = (event: DomainEvent) => Promise<void> | void;

/**
 * LocalEventBus Implementation
 * 
 * Simple async event bus suitable for MVP.
 * Executes handlers asynchronously without durability guarantees.
 * 
 * Trade-offs:
 * - Pros: Zero operational complexity, no infrastructure needed
 * - Cons: Events lost if process crashes, suitable only for non-critical work
 * 
 * When to upgrade to BullMQ:
 * - When you have paying users and SLA Requirements
 * - When event loss becomes unacceptable
 * - When you need distributed processing
 * 
 * Non-critical work (safe for LocalEventBus):
 * - Summary generation (can be regenerated)
 * - Mastery updates (can be recomputed)
 * - Recommendations (can be recalculated)
 * 
 * Critical work (requires BullMQ):
 * - Billing/payment
 * - Webhooks
 * - Email notifications
 */
export class LocalEventBus implements EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];

    // Execute handlers asynchronously (fire-and-forget)
    // Errors are logged but don't block the response
    handlers.forEach(handler => {
      this.executeHandler(handler, event).catch(error => {
        console.error(`[EventBus] Handler error for ${event.type}:`, error);
      });
    });
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  private async executeHandler(handler: EventHandler, event: DomainEvent): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error(`[EventBus] Handler execution failed for ${event.type}:`, error);
      throw error;
    }
  }
}

/**
 * Global event bus instance
 * In production, this would be configured via dependency injection
 */
export const eventBus = new LocalEventBus();
