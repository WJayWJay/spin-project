import React from 'react';

import './Spin.css';

import classnames from 'classnames';
import { throttle } from '../util/util';
import { animation, increaseFn } from '../util/animation';

class Main extends React.Component {
    state = {
        pointers: new Array(72).fill(0),
        current: 0,
        direction: 1,
        size: 500,
        type: 'ease-in-out'
    };
    pointTo = (index, e) => {
        const {current} = this.state;
        console.log(index, current)
        if (index % 9 !== 0 || !this.pointer) return;
        if (current === index) return;
        
        this.transformTo(index);
    }

    transformTo = (index) => {
        const {pointers, current} = this.state;

        const baseDeg = (360 / pointers.length);

        
        const deg = Math.abs(baseDeg * (index));
        this.pointer.style = `transform: rotateZ(${deg}deg)`;

        
        var all = this.dotInst.querySelectorAll('.dot-content');
        var i = current+ 1;
        const aType = this.state.type;

        var dura = Math.abs(1000 / ((index - current) / 9))
        var reverse = current > index;
        console.log('--------', current, index, reverse)

        if (reverse) {
            runReverse(all, current - 1, index, dura);
        } else {
            run(all, i, index, dura);
        }

        function runReverse(arr, start, end, duration) {
            var k = 8;
            var i = start;

            if (start > end) {
                while (k > 0) {
                    (0, (i, k) => 
                    {
                        var from = 1 + increaseFn(k, aType);
                        var to = 1;
                        animation({
                            from, to, duration, 
                            callback: (v, isEnd) => {
                                arr[i].style= `transform: scale(${v})`;
                                if (isEnd && k === 1) {
                                    runReverse(arr, start - 9, end, duration);
                                }
                            }
                        });
                    })(i, k);
                    i--;
                    k--;
                }
            }
        }


        function run(arr, start, end, duration) {
            var k = 1;
            var i = start;
            if (start < end) {
                while (k < 9) {
                    (0, (i, k) => 
                    {
                        var to = 1 + increaseFn(k, aType);
                        var from = 1;

                        animation({
                            from, to, duration, 
                            callback: (v, isEnd) => {
                                arr[i].style= `transform: scale(${v})`;
                                if (isEnd && k === 8) {
                                    run(arr, start + 9, end, duration);
                                }
                            }
                        })
                    })(i, k);
                    i++;
                    k++;
                }
            }
        }

        this.setState({current: index});
    }

    

    raf = (fn) => fn && window.requestAnimationFrame(fn);

    realPointers = (ref) => {
        this.pointer = ref;
    }
    dotCon = (ref) => {
        this.dotInst = ref;
    }
    change = (e) => {
        var val = e.target.value;
        val = parseFloat(val)
        if (isNaN(val)) return

        this.setState({
            size: val >= 100 ? val : 100
        })
    }

    mouseWheel = (e) => {
        const {current} = this.state;
        // const dy = e && e.nativeEvent && e.nativeEvent.deltaY;
        const dy = e;
        if (dy) {
            let index = current;
            if (dy < 0) {
                // up
                index -= 9;
                index = index < 0 ? 72 + index : index
            } else {
                // down
                index += 9;
                index = index > 72 ? index - 72 : index
            }
            this.transformTo(index);
        }
    }

    select = (e) => {
        var val = e.target.value;
        this.setState({
            type: val
        })
    }

    toRem = (val) => {
        var html = document.firstElementChild;
        var size = val + 'px';
        var w = window.innerWidth || window.outerWidth;
        if (html && html.tagName === 'HTML' && window.getComputedStyle) {
            var htmlStyle = window.getComputedStyle(html);
            var fs = parseFloat(htmlStyle.fontSize);
            if (val > w) val = w - 20;
            size = val / fs + 'rem';
            
        }
        return size;
    }

    componentDidMount() {
        this.wheel = throttle(this.mouseWheel, 50);
    }

    render() {
        const {pointers, size, current} = this.state;
        const baseDeg = (360 / pointers.length);

        var rsize = this.toRem(size);

        return (
            <div className="container">
                <span>size: </span><input key={'input'} placeholder={size} onChange={this.change} />
                <span>animation: </span><select onChange={this.select}>
                    <option value="ease-in-out">ease-in-out</option>
                    <option value="ease-in">ease-in</option>
                </select>
                <div key={'spin'} style={{marginTop: 20}} className="flex flex-align spin-container">
                    <div
                        onWheel={(e) => {
                            var dy = e && e.nativeEvent && e.nativeEvent.deltaY;
                            this.wheel(dy)
                        }}
                        style={{height: rsize, width: rsize}} 
                        className="spin">
                        <div key={1} className="spin-center"></div>
                        <div key={2} className="spin-pointer">
                            <div ref={this.realPointers} className="real-pointer"></div>
                        </div>

                        <div ref={this.dotCon} key={3} className="dot-container">
                            {pointers.map((j, i) =>{
                                return (
                                    <div 
                                        onClick={this.pointTo.bind(this, i)}
                                        style={{ transform: `rotateZ(${ baseDeg * (i)}deg)`}} 
                                        key={i} 
                                        className={classnames({'dot': true, 'big-dot': i % 9 === 0, 'highlight-dot': current >= i })}
                                    >
                                        <div className="dot-content" />
                                    </div>
                                )
                            })
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Main;