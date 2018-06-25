import React from 'react'
import classnames from 'classnames'
import './card.less'

export class Card extends React.PureComponent {
    render() {
        let { children, className, ...props } = this.props
        let classes = classnames('sd-card', className)
        return (
            <div className={classes} {...props}>{children}</div>
        )
    }
}