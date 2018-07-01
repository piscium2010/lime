import * as classnames from 'classnames'
import * as React from 'react'
import './card.less'

export default class Card extends React.PureComponent<any, any> {
    public render() {
        const { children, className, ...props } = this.props
        const classes = classnames('sd-card', className)
        return (
            <div className={classes} {...props}>{children}</div>
        )
    }
}
