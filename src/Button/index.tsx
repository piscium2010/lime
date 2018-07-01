import * as classnames from 'classnames'
import * as React from 'react'
import Ripple from '../Ripple/index'
import './button.less'

type Props = {
    className?: string
    primary?: boolean
}

type State = {
    active: boolean
}

export default class Button extends React.Component<Props, State> {
    public static defaultProps = {
        primary: true
    }

    constructor(props) {
        super(props)
        this.state = {
            active: false
        }
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
    }

    public render() {
        const { children, className, primary, ...props } = this.props
        const classes = classnames('sd-button', className, {
            active: this.state.active,
            primary
        })
        return (
            <Ripple>
                <button
                    className={classes}
                    {...props}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                >
                    {children}
                </button>
            </Ripple>
        )
    }

    private onMouseDown() {
        this.setState({ active: true })
    }

    private onMouseUp() {
        this.setState({ active: false })
    }
}
