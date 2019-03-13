import * as classnames from 'classnames'
import * as React from 'react'

type Props = {
    className?: string
    label?: string
}

type State = {
    checked: boolean
}

export default class Checkbox extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
        this.onClick = this.onClick.bind(this)
    }

    public render() {
        const { checked } = this.state
        const { className, label, ...restProps } = this.props
        const classes = classnames('lime-checkbox-wrapper', className)
        const boxClasses = classnames('lime-checkbox', {
            checked
        })

        return(
            <div className={classes} onClick={this.onClick}>
                <div className={boxClasses}>
                    <input className='lime-checkbox-input' type='checkbox' {...restProps}/>
                </div>
                {
                    label &&
                    <label className='lime-checkbox-label'>{label}</label>
                }
            </div>
        )
    }

    private onClick(evt) {
        this.setState(preState => ({
            checked: !preState.checked
        }))
    }
}
