import * as classnames from 'classnames'
import * as React from 'react'
import './dialog.less'

export default class Dialog extends React.PureComponent<any, any> {
    public static defaultProps = {
        show: false
    }

    public render() {
        const { children, show } = this.props
        return show ?
            <div key={0} className='sd-dialog-mask'>
                <div className="sd-dialog">
                    {children}
                </div>
            </div>
            :
            null
    }
}