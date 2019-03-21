import * as React from 'react'
import { prefixCls } from '../common'
import * as debounce from 'debounce'

export interface ICollapsibleProps extends React.AllHTMLAttributes<HTMLDivElement> {
    defaultExpand?: boolean
    expand?: boolean
}

export interface ICollapsibleState {
    expand: boolean
}

export default class Collapsible extends React.PureComponent<ICollapsibleProps, ICollapsibleState> {
    private ref: React.RefObject<HTMLDivElement>
    private animating: string
    private _collapsibleHeight: number
    private handlTransitionEnd: Function
    private debouncedhandlTransitionEnd: Function

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
            expand: props.defaultExpand || false
        }
        this.debouncedhandlTransitionEnd = debounce(this.handlTransitionEnd, 500)
    }

    private get collapsibleHeight() {
        if (!this.animating) {
            this._collapsibleHeight = this.node.offsetHeight
        }
        return this._collapsibleHeight
    }

    private get expand(): boolean {
        return 'expand' in this.props ? this.props.expand : this.state.expand
    }

    private get node(): HTMLElement {
        return this.ref.current
    }

    private handleTransitionEnd = transitionEndType => {
        switch (transitionEndType) {
            case 'end_of_enter':
                this.node.style.height = ``
                break
            case 'end_of_leave':
                this.node.style.display = 'none'
                this.node.style.height = ``
                break
            default:
                throw 'collapsible - invalid param of handletransitionEnd'
        }
        this.animating = ''
    }

    private performEnterAnimation = () => {
        this.node.style.height = ``
        this.node.style.display = 'block'
        const height = this.collapsibleHeight // 1st
        this.animating = 'enter' // 2nd
        const handleTransitionEnd = () => {
            if (this.animating === 'enter') {
                this.debouncedhandlTransitionEnd('end_of_enter')
            }
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        this.node.style.height = '0px'
        setTimeout(() => { this.node.style.height = `${height}px` }, 17)
    }

    private performLeaveAnimation = () => {
        const height = this.collapsibleHeight // 1st
        this.animating = 'leave' // 2nd
        const handleTransitionEnd = () => {
            if (this.animating === 'leave') {
                this.debouncedhandlTransitionEnd('end_of_leave')
            }
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        this.node.style.height = `${height}px`
        setTimeout(() => { this.node.style.height = `0px` }, 17)
    }

    componentDidMount() {
        this.node.style.display = this.expand ? 'block' : 'none'
    }

    componentDidUpdate() {
        if (this.expand && this.node.childElementCount && (this.node.style.display == 'none' || this.animating)) {
            this.performEnterAnimation()
        } else if (!this.expand && this.node.childElementCount && (this.node.style.display == 'block' || this.animating)) {
            this.performLeaveAnimation()
        }
    }

    render() {
        return (
            <div ref={this.ref} className={`${prefixCls}-collapsible`} aria-expanded={this.expand}>
                {this.props.children}
            </div>
        )
    }
}
