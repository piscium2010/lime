import React from 'react'
import classnames from 'classnames'
import { Dropdown } from '../Dropdown'
import './select.less'

export class Select extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            focus: false
        }
        this.onTextChange = this.onTextChange.bind(this)
        this.onDropdownBlur = this.onDropdownBlur.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onItemClick = this.onItemClick.bind(this)

    }

    onFocus() {
        this.setState({ focus: true })
    }

    onDropdownBlur() {
        this.setState({focus: false})
    }

    onTextChange(evt) {
        this.setState({value:evt.target.value})
    }

    onItemClick(item) {
        this.setState({value:item.label, focus: false})
    }

    render() {
        let { focus } = this.state
        let { children, className, label, onChange, options, ...props } = this.props
        let classes = classnames('sd-select-input', className,{
            filled: this.state.value ? true : false
        })

        return (
            <div className={classes}>
                {label && <label className='sd-select-input-label'>{label}</label>}
                <input 
                    type="text" 
                    onChange={this.onTextChange} 
                    value={this.state.value}
                    onClick={this.onFocus}
                    readOnly
                />
                <Dropdown
                    show={focus ? true : false}
                    onBlur={this.onDropdownBlur}
                    items={options}
                    onItemClick={this.onItemClick}
                />
                
            </div>
        )
    }
}