import * as React from 'react'
import { prefixCls } from '../common';

export interface IRippleProps {
    color?: string
}

interface IRippleState {
    rippleStyle: object
}

export default class Ripple extends React.Component<IRippleProps, IRippleState> {
    private ref
    private animation: number

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
        const { color = 'rgba(255,255,255,.1)' } = this.props
        const rect = this.ref.current.getBoundingClientRect()
        const max = Math.max(offsetWidth, offsetHeight)

        this.setState({
            rippleStyle: {
                backgroundColor: color,
                borderRadius: '50%',
                height: max * .6,
                left: clientX - rect.left,
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
                    height: max * 10,
                    transition: 'all 1.5s',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    width: max * 10
                }
            })
        })
    }

    private handleTransitionEnd = evt => {
        this.animation = requestAnimationFrame(() => {
            this.setState({ rippleStyle: {} })
        })
    }

    componentDidMount() {
        this.ref.current.parentNode.addEventListener('mousedown', this.onMouseDown)
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.animation)
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
