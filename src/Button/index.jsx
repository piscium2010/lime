import React from 'react'
import widthRipple from '../ripple'
import classnames from 'classnames'
import './button.less'

class Button_ extends React.PureComponent {
    static defaultProps = {
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

    onMouseDown() {
        this.setState({active:true})
    }

    onMouseUp() {
        this.setState({active:false})
    }

    render() {
        let { children, className, primary, ...props } = this.props
        let classes = classnames('sd-button',className,{
            active: this.state.active,
            primary: primary
        })
        return (
            <button className={classes} {...props} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>{children}</button>
        )
    }
}

export const Button = widthRipple(Button_) 