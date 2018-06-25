import React from 'react'
import classnames from 'classnames'
import './toggle.less'

export class Toggle extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: false
        }
        this.onToggle = this.onToggle.bind(this)
    }

    onToggle() {
        this.setState(state => ({ value: !state.value }))
    }

    render() {
        let { children, className, onClick, ...props } = this.props
        let classes = classnames('sd-toggle', className)
        let pegClasses = classnames('sd-toggle-peg',{
            on: this.state.value
        })
        return(
            <div className={classes} onClick={this.onToggle} {...props}>
                <div></div>
                <div></div>
                <div className={pegClasses}></div>
            </div>
        )
    }
}