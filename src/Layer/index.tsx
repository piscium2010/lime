import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common'

export interface ILayerProps {
    bottom?: string | number
    boundingClientRect?: { top, right, bottom, left, width, height }
    className?: string
    height?: string | number
    left?: string | number
    mask?: boolean
    onBlur: (evt?) => void
    onDismiss?: (evt?) => void
    right?: string | number
    style?: object
    show?: boolean
    top?: string | number
    width?: string | number
}

export default class Layer extends React.PureComponent<ILayerProps, {}> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef()

    static defaultProps = {
        mask: false
    }

    get style() {
        const isNotNull = v =>  v !== undefined &&  v !== null ? true : undefined
        const {
            boundingClientRect: rect = {} as { left?, top?},
            left,
            top,
            right,
            bottom,
            width,
            height,
            style,
        } = this.props
        
        const locationStyle = Object.assign({},
            isNotNull(left) && { left },
            isNotNull(right) && { right },
            isNotNull(bottom) && { bottom },
            isNotNull(top) && { top },
            isNotNull(width) && { width },
            isNotNull(height) && { height })
        
        return { ...locationStyle, ...style }
    }

    private onWindowMouseDown = evt => {
        let { target } = evt
        let { onBlur = () => { }, onDismiss = () => { } } = this.props
        if (this.ref.current && !this.ref.current.contains(target)) {
            onDismiss(evt)
            onBlur(evt)
        }
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.onWindowMouseDown)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onWindowMouseDown)
    }

    render() {
        const {
            boundingClientRect: rect,
            children,
            className,
            left,
            mask,
            top,
            width,
            height,
            onBlur,
            style,
            show,
            right,
            bottom,
            ...rest } = this.props
        const classes = classnames(`${prefixCls}-layer`, className)

        return show ? [
            mask && <div key={0} className={`${prefixCls}-layer-mask`} ></div>,
            <div key={1}
                ref={this.ref}
                className={classes}
                style={this.style}
                {...rest}
            >
                {children}
            </div>
        ] : null
    }
}
