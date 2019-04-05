import * as React from 'react'
import One from './One'
import { prefixCls } from '../common';

export interface IRippleProps {
    dark?: boolean
}

interface IRippleState {
    waves: Array<{ left, top, width }>
}

export default class Ripple extends React.Component<IRippleProps, IRippleState> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef()
    private transitionId: number = 0

    state = { waves: [] }

    private onMouseDown = evt => {
        const {
            clientX,
            clientY,
            currentTarget: { offsetWidth: width }
        } = evt
        const rect = this.ref.current.getBoundingClientRect()
        const size = 100 // px
        const left = clientX - rect.left - size / 2
        const top = clientY - rect.top - size / 2

        this.setState(prevState => {
            const n = Array.from(prevState.waves)
            n.push({ left, top, width })
            return {
                waves: n
            }
        })
    }

    private handleTransitionEnd = id => {
        if (id === this.transitionId) {
            this.setState({ waves: [] })
        }
    }

    componentDidMount() {
        this.ref.current.parentNode.addEventListener('mousedown', this.onMouseDown)
    }

    componentWillUnmount() {
        this.ref.current.parentNode.addEventListener('mousedown', this.onMouseDown)
    }

    public render() {
        const { dark } = this.props
        return (
            <div ref={this.ref} className={`${prefixCls}-ripple-mask`}>
                {
                    this.state.waves.map((item, index) => {
                        const id = ++this.transitionId
                        return (
                            <One
                                key={index}
                                left={item.left}
                                top={item.top}
                                width={item.width}
                                onTransitionEnd={() => this.handleTransitionEnd(id)}
                                dark={dark}
                            />
                        )
                    })
                }
            </div>
        )
    }
}
