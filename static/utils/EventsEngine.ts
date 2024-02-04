interface EventHandler<T> {
    (name: string, data: T): void;
}
  
interface Events<T> {
    subscribe(handler: EventHandler<T>): void;
    unsubscribe(handler: EventHandler<T>): void;
    emit(name: string, data: T): void;
}

class EventsEngine implements Events<any>{
    private handlers: Set<EventHandler<any>> = new Set();
  
    subscribe(handler: EventHandler<any>): void {
      this.handlers.add(handler)
    }
  
    unsubscribe(handler: EventHandler<any>): void {
      this.handlers.delete(handler);
    }
  
    emit(name: string, data: any): void {
      for (const handler of this.handlers) {
        handler(name, data);
      }
    }
}

export {
    EventHandler, 
    Events,
    EventsEngine
}