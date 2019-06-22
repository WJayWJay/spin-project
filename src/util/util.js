
const now = () => performance ? performance.now() : Date.now()
export function throttle(fn, timeout = 1000) {

    var cur = now();
    var id;

    return function() {
        var n = now();
        var args = [].slice.apply(arguments)
        if (id) {
            clearTimeout(id);
        }
        if ((n - cur) > timeout) {
            fn && fn.apply(null, args);
            cur = now();
        } else {
            id = setTimeout(() => {
                fn && fn.apply(null, args);
                id = 0;
                cur = now();
            }, timeout)
        }
    }
}