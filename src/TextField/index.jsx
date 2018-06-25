import React from 'react'
import classnames from 'classnames'
import './textField.less'

export class TextField extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.onTextChange = this.onTextChange.bind(this)
    }
    
    onTextChange(evt) {
        this.setState({value:evt.target.value})
    }

    render() {
        let { children, className, label, onChange, ...props } = this.props
        let classes = classnames('sd-input', className,{
            filled: this.state.value ? true : false
        })

        return(
            <div className={classes}>
                {label && <label>{label}</label>}
                <input type="text" onChange={this.onTextChange} value={this.state.value} />
            </div>
        )
    }
}