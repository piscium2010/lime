import * as classnames from 'classnames'
import * as React from 'react'
import './layer.less'

type Props = {
    boundingClientRect: { top, right, bottom, left, width, height }
    className?: string
    height: number
    onBlur: (evt?) => void
}

export default class Layer extends React.PureComponent<Props, {}> {
    public render() {
        const { boundingClientRect: rect, children, className, height, onBlur } = this.props
        const dropUp = window.innerHeight - rect.bottom > height ? false : true
        const classes = classnames('sd-layer', className)
        return [
            <div key={0} className='sd-layer-mask' onClick={onBlur}></div>,
            <div key={1}
                className={classes}
                style={{
                    height,
                    left: rect.left,
                    top: dropUp ? rect.top - height - 5 : rect.bottom,
                    width: rect.width
                }}
            >
                {children}
            </div>
        ]
    }
}
