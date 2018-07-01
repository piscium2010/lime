import * as classnames from 'classnames'
import * as React from 'react'
import Ripple from '../Ripple/index'
import './button.less'

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
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
    }

    public render() {
        const { children, className, type, ...props } = this.props
        const classes = classnames('sd-button', className, type, {
            active: this.state.active
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
