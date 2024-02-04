import { EventHandler } from './EventHandler';

export interface Event<T> {
    subscribe(handler: EventHandler<T>): void;
    unsubscribe(handler: EventHandler<T>): void;
    emit(data: T): void;
}
