import * as React from 'react'

export default class Ripple extends React.Component<any, any> {
    public static defaultProps = {
        display: 'inline-block'
    }

    private ref

    constructor(props) {
        super(props)
        this.state = {
            rippleStyle: {}
        }
        this.onMouseDown = this.onMouseDown.bind(this)
    }

    public render() {
        const { children, display, ...props } = this.props
        return (
            <div ref={ref => this.ref = ref}
                onMouseDown={this.onMouseDown}
                style={{ position: 'relative', display }}>
                {children}
                <div
                    style={{
                        height: '100%',
                        left: 0,
                        overflow: 'hidden',
                        pointerEvents: 'none',
                        position: 'absolute',
                        top: 0,
                        width: '100%'
                    }}
                >
                    <div style={this.state.rippleStyle}></div>
                </div>
            </div>
        )
    }

    private onMouseDown(evt) {
        const {
            clientX,
            clientY,
            currentTarget: { offsetWidth, offsetHeight }
        } = evt

        const rect = this.ref.getBoundingClientRect()
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
                    transition: 'all .6s',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    width: max * 2
                }
            })
        })
    }
}
