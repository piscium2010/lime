import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common/index'

export interface ICheckboxProps extends React.AllHTMLAttributes<HTMLDivElement> {
    boxStyle?: React.CSSProperties
    className?: string
    defaultChecked?: boolean
    label?: string
    name?: string
    onChange?: Function
}

export interface ICheckboxState {
    checked: boolean
}

export default class Checkbox extends React.PureComponent<ICheckboxProps, ICheckboxState> {
    static defaultProps = {
        onchange: () => { },
        onClick: () => { }
    }

    constructor(props) {
        super(props)
        this.state = {
            checked: 'defaultChecked' in props ? props.defaultChecked : false
        }
    }

    get checked() {
        return 'checked' in this.props ? this.props.checked : this.state.checked
    }

    private onClick = evt => {
        const { checked } = this.state
        this.setState({ checked: !checked })
        this.props.onChange({ name: this.props.name, checked: !checked })
        this.props.onClick(evt)
    }

    public render() {
        const { checked } = this.state
        const { boxStyle, className, label, name = '', onChange, onClick, ...rest } = this.props
        const classes = classnames(`${prefixCls}-checkbox-wrapper`, className)
        const boxClasses = classnames(`${prefixCls}-checkbox`, { checked })

        return (
            <div className={classes} onClickCapture={this.onClick} {...rest}>
                <span className={boxClasses} style={boxStyle}>
                    <input className={`${prefixCls}-checkbox-input`} type='checkbox' name={name} checked={this.checked} />
                </span>
                {
                    label && <label className={`${prefixCls}-checkbox-label`} for={name} >{label}</label>
                }
            </div>
        )
    }
}
