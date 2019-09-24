import * as React from 'react'
import * as classnames from 'classnames'
import { prefixCls } from '../common';

interface IOneProps {
    left: number
    top: number
    width: number
    onTransitionEnd: any
    dark: boolean
}

export default class One extends React.Component<IOneProps, {}> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef()

    componentDidMount() {
        const scale = this.props.width / 100 * 3
        requestAnimationFrame(() => {
            if(!this.ref.current) { return }
            this.ref.current.style.opacity = '1'
            this.ref.current.style.transform = `scale(${scale})`
            setTimeout(() => {
                if(!this.ref.current) { return }
                this.ref.current.style.opacity = '0'
                this.ref.current.style.transform = `scale(${scale})`
                this.ref.current.addEventListener('transitionend', this.props.onTransitionEnd)
            }, 800);
        })
    }

    public render() {
        const { left, top, dark = false } = this.props
        const className = classnames(`${prefixCls}-ripple`, {
            [`${prefixCls}-ripple-dark`]: dark
        })
        return (
            <div ref={this.ref} className={className} style={{ left, top }}></div>
        )
    }
}
