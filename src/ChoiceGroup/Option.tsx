import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common/index'

export interface IChoiceOptionProps extends React.AllHTMLAttributes<HTMLDivElement> {
    activeValue: string | number
    onClickChoice: ({ value }) => any
    name: string
    value: string | number
}

export default class Option extends React.PureComponent<IChoiceOptionProps, {}> {
    
    onClick = evt => {
        this.props.onClickChoice({ value: this.props.value })
        this.props.onClick(evt)
    }

    public render() {
        const { value, activeValue, onClick, ...rest } = this.props
        const checked = value === activeValue
        const choiceClasses = classnames(`${prefixCls}-choice`, {
            selected: checked
        })

        return (
            <div className={choiceClasses} onClick={this.onClick} {...rest}>
                <div key={0} className={`${prefixCls}-choice-radio`}></div>
                <div key={1} className={`${prefixCls}-choice-text`}>{this.props.children}</div>
                <input key={2} type="radio" name={name} value={value} checked={checked}></input>
            </div>
        )
    }
}
