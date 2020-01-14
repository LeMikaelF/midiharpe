TransposeModel = function () {

    const transpositionModel = {
        'do': 0,
        're': 0,
        'mi': 0,
        'fa': 0,
        'sol': 0,
        'la': 0,
        'si': 0
    };

    const addSetters = () => {
        const setters = [];
        for (let key in transpositionModel) {
            this['set' + capitalizeFirst(key)] = buildSetter(key);
            setters.push('set' + capitalizeFirst(key));
        }

        this.setScale = (array) => {
            for (let i = 0; i < array.length; i++) {
                this[setters[i]](array[i]);
            }
        }
    };

    const buildSetter = function (key) {
        return (newValue) => {
            transpositionModel[key] = newValue;
        };
    };

    const capitalizeFirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    addSetters();

    const solfToNumber = new Map([
        [0, 'do'],
        [2, 're'],
        [4, 'mi'],
        [5, 'fa'],
        [7, 'sol'],
        [9, 'la'],
        [11, 'si'],
    ]);

    const transpose = function (note) {
        let noOctave = note % 12;
        let difference = note - noOctave;
        if (!solfToNumber.has(noOctave)) {
            return undefined;
        }
        noOctave += transpositionModel[solfToNumber.get(noOctave)];
        return noOctave + difference;
    };

    this.transform = function (note) {
        return transpose(note);
    }
};

module.exports = new TransposeModel();
