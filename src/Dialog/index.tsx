import * as classnames from 'classnames'
import * as React from 'react'

export default class Dialog extends React.PureComponent<any, any> {
    public static defaultProps = {
        show: false
    }

    public render() {
        const { className, children, show } = this.props
        const classes = classnames('sd-dialog', className)

        return show ?
            <div key={0} className='sd-dialog-mask'>
                <div className={classes}>
                    {children}
                </div>
            </div>
            :
            null
    }
}
