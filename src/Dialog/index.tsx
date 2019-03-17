import * as classnames from 'classnames'
import * as React from 'react'
import { prefixCls } from '../common/index'

export interface IDialog extends React.AllHTMLAttributes<HTMLDivElement> {
    show: boolean,
    onBlurDialog: Function
}

export default class Dialog extends React.PureComponent<any, {}> {

    private contentRef: React.RefObject

    public static defaultProps = {
        show: false,
        onBlurDialog: () => { }
    }

    constructor(props) {
        super(props)
        this.contentRef = React.createRef()
    }

    get contentNode() {
        return this.contentRef.current
    }

    onBlurDialog = evt => {
        if (this.contentNode && !this.contentNode.contains(evt.target)) {
            this.props.onBlurDialog()
        }
    }

    public render() {
        const { className, children, show, onBlurDialog, ...rest } = this.props
        const classes = classnames(`${prefixCls}-dialog`, className)

        return show ?
            <div className={`${prefixCls}-dialog-mask`} onClick={this.onBlurDialog}>
                <div ref={this.contentRef} className={classes} {...rest}>
                    {children}
                </div>
            </div>
            :
            null
    }
}
