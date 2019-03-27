import * as classnames from 'classnames'
import * as React from 'react'
import ChoiceOption from './Option'
import { prefixCls } from '../common/index'

export type Option = { value }

export interface IChoiceGroupProps {
    className?: string
    defaultValue?: string | number
    name?: string
    onChange?: (option?: Option) => void
    options: Array<Option>
    value?: string | number
}

interface IChoiceGroupState {
    value: string | number
}

export default class ChoiceGroup extends React.PureComponent<IChoiceGroupProps, IChoiceGroupState> {
    static Option = ChoiceOption

    static defaultProps = {
        onChange: () => { }
    }

    constructor(props) {
        super(props)
        this.state = {
            value: 'defaultValue' in props ? props.defaultValue : ''
        }
    }

    private get value() {
        return 'value' in this.props ? this.props.value : this.state.value
    }

    private onClickChoice = (option: Option) => {
        this.setState({ value: option.value })
        this.props.onChange(option)
    }

    render() {
        const { className, children, defaultValue, name = '', options, onChange, ...rest } = this.props
        const classes = classnames(`${prefixCls}-choice-group`, className)

        return (
            <div className={classes} {...rest}>
                {
                    React.Children.toArray(children).map((el: React.ReactElement) => {
                        return React.cloneElement(el,
                            {
                                activeValue: this.value,
                                name,
                                onClickChoice: option => this.onClickChoice(option)
                            })
                    })
                }
            </div>
        )
    }
}
