import React from 'react';

import './Spin.css';

import classnames from 'classnames';
import { throttle } from '../util/util';

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

        this.raf(() => {
            const deg = Math.abs(baseDeg * (index));
            this.pointer.style = `transform: rotateZ(${deg}deg)`;

            this.raf(() => {
                var all = this.dotInst.querySelectorAll('.dot-content');
                var i = current+ 1;
                var k = 1;

                while(i < index) {
                    if (i % 9 === 0) {
                        k = 1;
                    } else {
                        const animationType = this.state.type;
                        this.setStyle(all, i, k, animationType)
                        k++;
                    }
                    i++;
                }

                setTimeout(() => {
                    this.raf(() => {
                        i = current+ 1;
                        while(i < index) {
                            all[i].style= `transform: scale(1)`;
                            i++;
                        }
                    });
                }, 500)
            })
        })

        this.setState({current: index});
    }
    setStyle = (all, i, k, type = 'ease-in-out') => {
        
        this.raf(() =>{
            var s = 1;
            switch(type) {
                case 'ease-in-out':
                    s = 1 + g(k, 4);
                    break;
                case 'ease-in':
                    s = 1 + k * 0.2;
                    break;
                default: 
                    s = 1;
            }
            all[i].style= `transform: scale(${s})`;
        });

        function g(index, base = 2) {
            var P = Math.PI;
            var ap = P / 8;
            var d = Math.cos(ap * index - P/2) * base;
            return d;
        }
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
        const dy = e && e.nativeEvent && e.nativeEvent.deltaY;
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

    render() {
        const {pointers, size, current} = this.state;
        const baseDeg = (360 / pointers.length);
        return (
            <div className="container">
                <span>size: </span><input key={'input'} placeholder={size} onChange={this.change} />
                <span>animation: </span><select onChange={this.select}>
                    <option value="ease-in-out">ease-in-out</option>
                    <option value="ease-in">ease-in</option>
                </select>
                <div key={'spin'} style={{marginTop: 20}} className="flex flex-align spin-container">
                    <div
                        onWheel={throttle(this.mouseWheel, 800)}
                        style={{height: size, width: size}} 
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