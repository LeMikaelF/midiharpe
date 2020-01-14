function ScaleController(divs, onFocus) {
    let x = 0;
    let blurScale = function(div) {
        div.style.border = '';
    };
    let focusScale = function(div) {
        div.style.border = 'thick solid black';
        onFocus(div);
    };
    let adjustScroll = (div) => {
        div.scrollIntoView(false);
    };
    let setDisplayIndex = function(index) {
        document.getElementById('currentscale').innerHTML = index + 1;
    };
    this.increment = () => {
        if (x >= divs.length - 1)
            return;
        document.getElementById('previous').disabled = false;
        blurScale(divs[x]);
        x++;
        focusScale(divs[x]);
        if (x >= divs.length - 1)
            document.getElementById('next').disabled = true;
        setDisplayIndex(x);
        adjustScroll(divs[x]);
    };
    this.decrement = () => {
        if (x <= 0)
            return;
        document.getElementById('next').disabled = false;
        blurScale(divs[x]);
        x--;
        focusScale(divs[x]);
        if (x <= 0)
            document.getElementById('previous').disabled = true;
        setDisplayIndex(x);
        adjustScroll(divs[x]);
    };
    focusScale(divs[0]);
    divs.slice(1).forEach(div => blurScale(div));
    setDisplayIndex(0);
}

module.exports = ScaleController;
