import * as classnames from 'classnames'
import * as React from 'react'
import './toggle.less'

type Props = {
    className?: string
    onClick?: (event) => void
}

type State = {
    value: boolean
}

export default class Toggle extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            value: false
        }
        this.onToggle = this.onToggle.bind(this)
    }

    public render() {
        const { children, className, onClick, ...props } = this.props
        const classes = classnames('sd-toggle', className)
        const pegClasses = classnames('sd-toggle-peg', {
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

    private onToggle() {
        this.setState(state => ({ value: !state.value }))
    }
}
