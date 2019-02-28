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
    show?: boolean
    top?: number,
    width?: number,
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
            boundingClientRect: rect,
            left,
            top,
            width,
            height
        } = this.props
        let style = Object.assign({
            left: left || rect.left,
            top: top || rect.top
        }, width && { width }, height && { height })
        return style
    }

    private onWindowMouseDown = evt => {
        let { target } = evt
        let { onBlur = () => {} } = this.props
        if(this.ref.current && !this.ref.current.contains(target)) {
            //console.log(`blur`,)
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
        let {
            boundingClientRect: rect,
            children,
            className,
            left,
            mask,
            top,
            width,
            height,
            onBlur,
            show } = this.props
        let classes = classnames(`${prefixCls}-layer`, className)

        return show ? [
            mask && <div key={0} className={`${prefixCls}-layer-mask`} ></div>,
            <div key={1}
                ref={this.ref}
                className={classes}
                style={this.style}
            >
                {children}
            </div>
        ] : null
    }
}
