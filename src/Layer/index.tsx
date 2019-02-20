import * as classnames from 'classnames'
import * as React from 'react'

type Props = {
    boundingClientRect?: { top, right, bottom, left, width, height }
    left?: number,
    top?: number,
    width?: number,
    className?: string
    height?: number
    onBlur: (evt?) => void,
    show?: boolean
}

export default class Layer extends React.PureComponent<Props, {}> {
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
    public render() {
        let {
            boundingClientRect: rect,
            children,
            className,
            left,
            top,
            width,
            height,
            onBlur,
            show } = this.props
        let classes = classnames('sd-layer', className)

        return show ? [
            <div key={0} className='sd-layer-mask' onClick={onBlur}></div>,
            <div key={1}
                className={classes}
                style={this.style}
            >
                {children}
            </div>
        ] : null
    }
}
