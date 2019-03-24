import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common/index'

export interface IToggleProps {
    className?: string
    name: string
    checked: boolean
    onChange?: (event) => void
}

interface IToggleState {
    checked: boolean
}

export default class Toggle extends React.PureComponent<IToggleProps, IToggleState> {
    constructor(props) {
        super(props)
        this.state = {
            checked: props.defaultChecked || false
        }
    }

    get checked() {
        return 'checked' in this.props ? this.props.checked : this.state.checked
    }

    private onToggle = evt => {
        const checked = !this.state.checked
        const { name } = this.props
        this.setState({ checked })
        this.props.onChange && this.props.onChange({name, checked})
    }

    render() {
        const { children, className, name = '', ...rest } = this.props
        const classes = classnames(`${prefixCls}-toggle`, className)
        const pegClasses = classnames(`${prefixCls}-toggle-peg`, {
            on: this.checked
        })

        return (
            <div className={classes} onClick={this.onToggle} {...rest}>
                <div className={pegClasses}></div>
                <input name={name} type='checkbox' checked={this.checked} style={{ position: 'absolute', visibility: 'hidden' }} />
            </div>
        )
    }
}
