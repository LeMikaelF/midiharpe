class Chainable {
    constructor (input, output) {
        this.input = input;
        this.output = output;
        this.eventTypes = ['noteon', 'noteoff'];
        this.listenerStacks = new Map(this.eventTypes.map(type => [type, new ListenerStack(input, output, type)]));
    }

    chain(transformer) {
        transformer.getEventTypes().forEach(type => this.listenerStacks.get(type).push(transformer, this.output));
    }

    reset() {
        Array.from(this.listenerStacks.entries()).forEach(([type, stack]) => stack.reset());
    }
}

class ListenerStack {

    getFirstTransformer() {
        //Problème: le event reçu ici ne contient pas le type, il est implicite à cause du listener input.on(type, listener)
        return {
            'setCallback': (callback) => this.callback = callback,
            'transform': (event) => {
                console.log('firstTransformer running');
                if (this.callback) {
                    event.type = this.eventType;
                    this.callback(event);
                }
            }
        }
    }

    getLastTransformer(output) {
        return {
            'transform': (event) => {
                console.log('lastTransformer running');
                output.send(event.type, event);
            }
        }
    }

    constructor(input, output, eventType) {
        this.eventType = eventType;
        this.lastTransformer = this.getLastTransformer(output);
        this.firstTransformer = this.getFirstTransformer();
        this.firstTransformer.setCallback(this.lastTransformer.transform);
        input.on(eventType, this.getFirstTransformer().transform);

        this.array = [];
    }

    push(transformer, output) {
        if (this.array.length === 0) {
            this.firstTransformer.setCallback(transformer.transform);
            this.array.push(transformer);
        } else {
            //Send output to plugins
            if(transformer.setOutput){
                transformer.setOutput(output);
            }

            this.array[this.array.length - 1].setCallback(transformer.transform);
            this.array.push(transformer);
        }
        transformer.setCallback(this.lastTransformer.transform);
    }

    reset() {
        this.array.length = 0;
        this.firstTransformer.setCallback(this.lastTransformer.transform);
    }
}

module.exports = Chainable;
