import * as classnames from 'classnames'
import * as React from 'react'
import Dropdown from '../Dropdown/index'

type Option = {key, text}

type Props = {
    className?: string
    defaultSelectedKey?: string | number
    onChange?: (option?: Option) => void
    options: Array<Option>
    selectedKey?: string | number
}

type State = {
    selectedKey: string | number
}

export default class ChoiceGroup extends React.PureComponent<Props, State> {
    public static defaultProps = {
        onChange: () => {}
    }

    constructor(props) {
        super(props)
        this.state = {
            selectedKey: props.defaultSelectedKey
        }
    }

    public render() {
        const { className, options, ...props } = this.props
        const classes = classnames('sd-choice-group', className)

        return (
            <div className={classes}>
                {
                    options.map(option => {
                        const choiceClasses = classnames('sd-choice', {
                            selected: option.key == this.selectedKey
                        })
                        return (
                            <div key={option.key}
                                className={choiceClasses}
                                onClick={evt => this.onClickChoice(option)}
                            >
                                <div className='sd-choice-radio'></div>
                                <div className='sd-choice-text'>{option.text}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    private onClickChoice(option: Option) {
        const { onChange } = this.props
        this.setState({
            selectedKey: option.key
        })
        onChange(option)
    }

    private get selectedKey() {
        return this.props.selectedKey || this.state.selectedKey
    }
}
