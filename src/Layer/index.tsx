import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common'

export interface ILayerProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: 'slide-down'
    bottom?: string | number
    boundingClientRect?: { top, right, bottom, left, width, height }
    className?: string
    left?: string | number
    mask?: boolean
    onBlur: (evt?) => void
    onDismiss?: (evt?) => void
    right?: string | number
    show?: boolean
    top?: string | number
}

export default class Layer extends React.PureComponent<ILayerProps, {}> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef()

    static defaultProps = {
        mask: false
    }

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
        // return { ...locationStyle, ...style }
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
            animation,
            boundingClientRect: rect,
            children,
            className,
            left,
            mask,
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

        return [
            mask && <div key={0} className={`${prefixCls}-layer-mask`} ></div>,
            <div key={1}
                ref={this.ref}
                className={classes}
                style={locationStyle}
                {...rest}
            >
                <div className={animationClasses} style={restStyle}>
                    {children}
                </div>
            </div>
        ]
    }
}
