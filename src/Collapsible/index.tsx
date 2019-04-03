import * as React from 'react'
import { prefixCls } from '../common'

export interface ICollapsibleProps extends React.AllHTMLAttributes<HTMLDivElement> {
    defaultExpand?: boolean
    expand?: boolean
}

export interface ICollapsibleState {
    expand: boolean
}

export default class Collapsible extends React.PureComponent<ICollapsibleProps, ICollapsibleState> {
    private ref: React.RefObject<HTMLDivElement>
    private animating: number = 0
    private _collapsibleHeight: number

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
            expand: props.defaultExpand || false
        }
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

    private handleTransitionEnd = (transitionEndType: string, animatingId: number) => {
        if (animatingId !== this.animating) { return }
        requestAnimationFrame(() => {
            const style = this.node.style
            switch (transitionEndType) {
                case 'end_of_enter':
                    style.height = ``
                    break
                case 'end_of_leave':
                    style.display = 'none'
                    style.height = ``
                    break
                default:
                    console.error('collapsible - invalid param of handletransitionEnd')
            }
            this.animating = 0
        })
    }

    private performEnterAnimation = () => {
        const style = this.node.style
        style.display = 'block' // 1st
        const height = this.collapsibleHeight // 2nd
        const animatingId = ++this.animating
        const handleTransitionEnd = () => {
            this.handleTransitionEnd('end_of_enter', animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        style.height = '0px'
        requestAnimationFrame(() => { style.height = `${height}px` })
    }

    private performLeaveAnimation = () => {
        const style = this.node.style
        const height = this.collapsibleHeight
        const animatingId = ++this.animating
        const handleTransitionEnd = () => {
            this.handleTransitionEnd('end_of_leave', animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        style.height = `${height}px`
        requestAnimationFrame(() => { style.height = `0px` })
    }

    componentDidMount() {
        this.node.style.display = this.expand ? 'block' : 'none'
    }

    componentDidUpdate() {
        if (this.expand && this.node.childElementCount && (this.node.style.display == 'none' || this.animating)) {
            requestAnimationFrame(() => {
                this.performEnterAnimation()
            })
        } else if (!this.expand && this.node.childElementCount && (this.node.style.display == 'block' || this.animating)) {
            requestAnimationFrame(() => {
                this.performLeaveAnimation()
            })
        }
    }

    render() {
        const { className = '', ...rest } = this.props
        return (
            <div {...rest} ref={this.ref} className={`${prefixCls}-collapsible ${className}`} aria-expanded={this.expand}>
                {this.props.children}
            </div>
        )
    }
}