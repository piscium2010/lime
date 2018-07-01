import * as classnames from 'classnames'
import * as React from 'react'
import './textField.less'

export default class TextField extends React.PureComponent<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.onTextChange = this.onTextChange.bind(this)
    }

    public render() {
        const { children, className, label, onChange, ...props } = this.props
        const classes = classnames('sd-textField-input', className, {
            filled: this.state.value ? true : false
        })

        return (
            <div className={classes}>
                {label && <label className='sd-textField-input-label'>{label}</label>}
                <input type='text' onChange={this.onTextChange} value={this.state.value} />
            </div>
        )
    }

    private onTextChange(evt) {
        this.setState({value: evt.target.value})
    }
}
