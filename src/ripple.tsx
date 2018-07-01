import * as React from 'react'

export function withRipple(
    WrappedComponent: ((props) => JSX.Element) | typeof React.Component,
    display = 'inline-block'
) {
    class Ripple extends React.Component<any, any> {
        private ref

        constructor(props) {
            super(props)
            this.state = {
                rippleStyle: {}
            }
            this.onMouseDown = this.onMouseDown.bind(this)
        }

        onMouseDown(evt) {
            const {
                clientX,
                clientY,
                currentTarget: { offsetWidth, offsetHeight }
            } = evt

            const rect = this.ref.getBoundingClientRect()
            const max = Math.max(offsetWidth, offsetHeight)

            this.setState({
                rippleStyle: {
                    position: 'absolute',
                    pointerEvents: 'none',
                    borderRadius: '50%',
                    width: max * .6,
                    height: max * .6,
                    transform: 'translate(-50%,-50%)',
                    backgroundColor: 'white',
                    top: clientY - rect.top,
                    left: clientX - rect.left,
                    opacity: .6,
                    transition: 'initial'
                }
            })

            requestAnimationFrame(() => {
                this.setState({
                    rippleStyle: {
                        ...this.state.rippleStyle,
                        opacity: 0,
                        width: max * 2,
                        height: max * 2,
                        transition: 'all .6s',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }
                })
            })
        }

        render() {
            const { children, ...props } = this.props
            return (
                <div ref={ref => this.ref = ref} onMouseDown={this.onMouseDown} style={{ position: 'relative', display: display }}>
                    <WrappedComponent {...props}>
                        {children}
                    </WrappedComponent>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <div style={this.state.rippleStyle}></div>
                    </div>
                </div>
            )
        }
    }

    return Ripple
}