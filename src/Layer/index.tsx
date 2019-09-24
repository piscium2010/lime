import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common';

export interface ILayerProps {
    boundingClientRect?: { top, right, bottom, left, width, height }
    className?: string
    height?: number
    left?: number,
    mask?: boolean,
    onBlur: (evt?) => void,
    onDismiss?: (evt?) => void,
    style?: object,
    show?: boolean
    top?: number,
    width?: number
}

export default class Layer extends React.PureComponent<ILayerProps, {}> {
    private ref: React.RefObject<HTMLDivElement>

    static defaultProps = {
        mask: false
    }

    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    get style() {
        let {
            boundingClientRect: rect = {} as { left?, top?},
            left = rect.left || 0,
            top = rect.top || 0,
            width,
            height,
            style: _style,
        } = this.props
        let style = Object.assign({},
            _style,
            { left, top },
            width && { width },
            height && { height })
        return style
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
