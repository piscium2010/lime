import * as React from 'react'
import { prefixCls } from '../common';

interface IRippleState {
    rippleStyle: object
}

export default class Ripple extends React.Component<any, IRippleState> {
    private ref

    constructor(props) {
        super(props)
        this.state = {
            rippleStyle: {}
        }
        this.ref = React.createRef()
    }

    private onMouseDown = evt => {
        const {
            clientX,
            clientY,
            currentTarget: { offsetWidth, offsetHeight }
        } = evt

        const rect = this.ref.current.getBoundingClientRect()
        const max = Math.max(offsetWidth, offsetHeight)

        this.setState({
            rippleStyle: {
                backgroundColor: 'white',
                borderRadius: '50%',
                height: max * .6,
                left: clientX - rect.left,
                opacity: .6,
                pointerEvents: 'none',
                position: 'absolute',
                top: clientY - rect.top,
                transform: 'translate(-50%,-50%)',
                transition: 'initial',
                width: max * .6,
            }
        })

        requestAnimationFrame(() => {
            this.setState({
                rippleStyle: {
                    ...this.state.rippleStyle,
                    height: max * 2,
                    opacity: 0,
                    transition: 'all .5s',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    width: max * 2
                }
            })
        })
    }

    private handleTransitionEnd = evt => {
        if(this.ref.current) {
            this.setState({rippleStyle:{}})
            console.log(`end`,)
        }
    }

    componentDidMount() {
        this.ref.current.parentNode.addEventListener('mousedown', this.onMouseDown)
    }

    componentWillUnmount() {
        this.ref.current.parentNode.addEventListener('mousedown', this.onMouseDown)
    }

    public render() {
        return (
            <div ref={this.ref} className={`${prefixCls}-ripple`}>
                <div style={this.state.rippleStyle} onTransitionEnd={this.handleTransitionEnd}></div>
            </div>
        )
    }
}
