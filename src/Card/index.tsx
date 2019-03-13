import * as classnames from 'classnames'
import * as React from 'react'

export default class Card extends React.PureComponent<any, any> {
    public render() {
        const { children, className, ...props } = this.props
        const classes = classnames('lime-card', className)
        return (
            <div className={classes} {...props}>{children}</div>
        )
    }
}
