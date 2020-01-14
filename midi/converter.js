function abcToTranspose(abc) {
    let temp = abc.substring(abc.indexOf('K:'));
    temp = temp.substring(temp.indexOf('\n') + 1);
    if ((temp.indexOf('^') < temp.indexOf('C')) || (temp.indexOf('_') < temp.indexOf('C')))
        temp = temp.substring(temp.indexOf('C') - 2);
    else
        temp = temp.substring(temp.indexOf('C') - 1);

    temp = temp.replace(/\|/g, '');
    temp = temp.trim();

    const transpose = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => {
        switch (temp.charAt(temp.indexOf(note) - 1)) {
            case '^':
                return 1;
            case '_':
                return -1;
            default:
                return 0;
        }
    });

    return transpose;
}

function transposeToAbc(scale) {
    let template = 'X:1\nL:1/4\nK:C\n^C_D_E=FGAB||\n';
    let prefix = 'X:1\nL:1/4\nK:C\n';
    let suffix = '||\n';
    let string = (' ' + prefix).slice(1);
    ['C', 'D', 'E', 'F', 'G', 'A', 'B'].forEach((note, index) => {
        let abc;
        switch (scale[index]) {
            case -1:
                abc = '_';
                break;
            case 0:
                abc = '';
                break;
            case 1:
                abc = '^';
                break;
            default:
                throw 'Illegal value in transposition array. Accepted values are: 1, -1, and 0. Incorrect value: ' + scale[index];
        }
        abc = abc + note;
        string = string + abc;
    });
    string = string + suffix;
    return string;
}

module.exports = {
    toAbc: transposeToAbc,
    toTranspose: abcToTranspose
};
