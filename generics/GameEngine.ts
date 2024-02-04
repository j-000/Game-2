import { Event } from "./events/Event";
import { EventHandler } from "./events/EventHandler";

export class GameEngine {
    player: Player;
    windowEvents: EventsEngine;

    constructor(){
        this.windowEvents = new EventsEngine();
        this.windowEvents.subscribe(this.handleWindowEvents)

        this.player = new Player();
        this.windowEvents.subscribe(this.player.handleWindowEvents)

        window.addEventListener('mousedown', e => this.windowEvents.emit(e));
    }
    
    handleWindowEvents = (data: any) =>{
        console.log('[GameEngine]', data);
    }

}


class Player {
    events: EventsEngine;

    constructor(){
        this.events = new EventsEngine();
    }
    
    shoot(mouse: number){
        this.events.emit({mouse});
    }

    handleWindowEvents = (data: any) => {
        console.log('[Player]', data);
    }

}

export class EventsEngine implements Event<any>{
    private handlers: Set<EventHandler<any>> = new Set();
    
    subscribe(handler: EventHandler<any>): void {
        this.handlers.add(handler)
    }

    unsubscribe(handler: EventHandler<any>): void {
        this.handlers.delete(handler);
    }

    emit(data: any): void {
        for(const handler of this.handlers) {
            handler(data);
        }
    }
}