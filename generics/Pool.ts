export class Pool<T> {
    private items: Array<T>;
    maxItems: number;
    
    constructor(itemClass: new () => T, maxItems: number){
        // Store params as properties
        this.items = [];
        this.maxItems = maxItems;

        // Initialize items array with maxItems count of itemClass
        for(let i = 0; i < maxItems; i++){
            this.items.push(new itemClass())
        }
    }

    // To use "for ... of"
    *[Symbol.iterator]() {
        for(let item of this.items) {
            yield item
        }
    }
    
    // Size of pool 
    public get length(): number {
        return this.items.length;
    }

    // Add 1 item
    add(item: T): void {
        this.items.push(item);
    }
   
    // Get item by index
    get(index: number): T | null{
        if(index > this.items.length || index < 0) return null;
        return this.items[index]
    }
}
