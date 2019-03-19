import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common/index'

export type Option = {key, value}

export interface IChoiceGroupProps {
    className?: string
    defaultSelectedKey?: string | number
    name?: string
    onChange?: (option?: Option) => void
    options: Array<Option>
    selectedKey?: string | number
}

export interface IChoiceGroupState {
    selectedKey: string | number
}

export default class ChoiceGroup extends React.PureComponent<IChoiceGroupProps, IChoiceGroupState> {
    public static defaultProps = {
        onChange: () => {}
    }

    constructor(props) {
        super(props)
        this.state = {
            selectedKey: props.defaultSelectedKey
        }
    }

    private get selectedKey() {
        return 'selectedKey' in this.props ? this.props.selectedKey : this.state.selectedKey
    }

    private onClickChoice = (option: Option) => {
        this.setState({
            selectedKey: option.key
        })
        this.props.onChange(option)
    }

    public render() {
        const { className, name = '', options, onChange, ...rest } = this.props
        const classes = classnames(`${prefixCls}-choice-group`, className)

        return (
            <div className={classes} {...rest}>
                {
                    options.map(option => {
                        const choiceClasses = classnames(`${prefixCls}-choice`, {
                            selected: option.key == this.selectedKey
                        })
                        return (
                            <div key={option.key}
                                className={choiceClasses}
                                onClick={evt => this.onClickChoice(option)}
                            >
                                <div className={`${prefixCls}-choice-radio`}></div>
                                <div className={`${prefixCls}-choice-text`}>{option.value}</div>
                                <input type="radio" name={name} value={option.value}></input>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
