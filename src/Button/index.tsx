import * as classnames from 'classnames'
import * as React from 'react'
import Ripple from '../Ripple/index'

type Props = {
    className?: string
    type?: 'primary' | 'text'
}

type State = {
    active: boolean
}

export default class Button extends React.Component<Props, State> {
    public static defaultProps = {
        type: 'primary'
    }

    constructor(props) {
        super(props)
        this.state = {
            active: false
        }
    }

    public render() {
        const { children, className, type, ...props } = this.props
        const classes = classnames('lime-button', className, type, {
            active: this.state.active
        })
        return (
                <button
                    className={classes}
                    {...props}
                >
                    {children}
                </button>
        )
    }
}
