
function defaltCal(start, from , range, dura) {

    return range * start / dura + from;
}

export function animation (from, to, duration, callback, calVal = defaltCal) {

    var options = Object.assign({
        duration: 300,
        easing: 'Linear',
        callback: function() {}
    }, {
        duration, callback
    });

    var start = 0;
    var req = null;
    var during = Math.ceil(options.duration / 17);

    const fnGetValue = (start, from , range, dura) => {
        if (calVal) {
            return calVal(start, from , range, dura);
        }
        return range * start / dura + from;
    };

    const tick = function() {
        var value = fnGetValue(start, from, Math.abs(to - from), during);
        start++;
        if (start <= during) {
            options.callback(value);
            req = window.requestAnimationFrame(tick);
        } else {
            options.callback(to, true);
        }
    }

    tick();

    return () => req;
}


export function increaseFn(k, type) {
    var s = 0;
    switch(type) {
        case 'ease-in-out':
            s = g(k, 2);
            break;
        case 'ease-in':
            s = k * 0.2;
            break;
        default: 
            s = 0;
    }

    return s;

    function g(index, base = 4) {
        var P = Math.PI;
        var ap = P / 8;
        var d = Math.cos(ap * index - P/2) * base;
        return d;
    }
}