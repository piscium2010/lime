import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common'

export interface ILayerProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: 'slide-down'
    bottom?: string | number
    boundingClientRect?: { top, right, bottom, left, width, height }
    className?: string
    left?: string | number
    onBlur?: (evt?) => void
    onDismiss?: (evt?) => void
    right?: string | number
    show?: boolean
    top?: string | number
}

export default class Layer extends React.PureComponent<ILayerProps, {}> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef()

    get style() {
        const isNotNull = v => v !== undefined && v !== null ? true : undefined
        const {
            boundingClientRect: rect = {} as { left?, top?},
            left,
            top,
            right,
            bottom,
            style = {},
        } = this.props
        const { transform, ...restStyle } = style
        const locationStyle = Object.assign({},
            isNotNull(left) && { left },
            isNotNull(right) && { right },
            isNotNull(bottom) && { bottom },
            isNotNull(top) && { top },
            isNotNull(transform) && { transform }
        )

        return [locationStyle, restStyle]
    }

    private onWindowMouseDown = evt => {
        const { target } = evt
        const { show, onBlur = () => { }, onDismiss = () => { } } = this.props
        if (show && this.ref.current && !this.ref.current.contains(target)) {
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
            animation,
            boundingClientRect: rect,
            children,
            className,
            left,
            top,
            onBlur,
            style,
            show,
            right,
            bottom,
            ...rest } = this.props
        const classes = classnames(
            `${prefixCls}-layer`,
            {
                [`${prefixCls}-layer-inactive`]: !show
            }
        )

        const animationClasses = classnames(
            className,
            `${prefixCls}-shadow`,
            {
                [`${prefixCls}-animate-slide-down-in`]: animation === 'slide-down' && show,
                [`${prefixCls}-animate-slide-up-out`]: animation === 'slide-down' && !show,
                [`${prefixCls}-layer-out`]: !animation && !show,
                [`${prefixCls}-layer-active`]: show
            }
        )

        const [locationStyle, restStyle] = this.style

        return (
            <div
                ref={this.ref}
                className={classes}
                style={locationStyle}
                {...rest}
            >
                <div className={animationClasses} style={restStyle}>
                    {children}
                </div>
            </div>
        )
    }
}
