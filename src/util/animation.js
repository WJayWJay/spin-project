
function defaltCal(start, from , range, dura) {

    return range * start / dura + from;
}

/**
 * {from, to, duration, callback, calVal: defaltCal}
 * @param {number} option.from
 * @param {number} option.to
 * @param {number} option.duration
 * @param {Function} option.callback
 * @param {Function} option.calVal
 */
export function animation (
    option
) {
    
    var options = Object.assign({
        duration: 300,
        easing: 'Linear',
        calVal: defaltCal,
        callback: function() {}
    }, option || {});
    
    var calVal = options.calVal;
    var start = 0;
    var req = null;
    var during = Math.ceil(options.duration / 17);

    var from = options.from;
    var to = options.to;


    const fnGetValue = (start, from , range, dura) => {
        if (calVal) {
            return calVal(start, from , range, dura);
        }
        return range * start / dura + from;
    };

    const tick = function() {
        var value = fnGetValue(start, from, to - from, during);
        start++;
        if (start <= during) {
            options.callback(value);
            req = window.requestAnimationFrame(tick);
        } else {
            options.callback(to, true);
        }
    }
    const cancelRaf = () => {
        window.cancelAnimationFrame(req);
    }
    const resume = () => {
        tick();
    }

    tick();

    return () => ({
        req,
        cancelRaf,
        resume
    });
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