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
    private id: string

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.id = `collapsible-${Date.now()}-${Math.round(Math.random()*1000)}`
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
        // return this.ref.current
        return document.getElementById(this.id)
    }

    private handleTransitionEnd = (transitionEndType: string, animatingId: number) => {
        if (animatingId !== this.animating) { return }
        requestAnimationFrame(() => {
            const style = this.node.style
            switch (transitionEndType) {
                case 'end_of_enter':
                    style.height = ``
                    // console.log(`end of enter`,)
                    break
                case 'end_of_leave':
                    style.display = 'none'
                    style.height = ``
                    // console.log(`end of leave`,)
                    break
                default:
                    console.error('collapsible - invalid param of handletransitionEnd')
            }
            this.animating = 0
        })
    }

    private performEnterAnimation = () => {
        // const style = this.node.style
        console.log(`enter`, this.node.style.height)
        this.node.style.height = ''
        this.node.style.display = 'block' // 1st
        const height = this.collapsibleHeight // 2nd
        const animatingId = ++this.animating
        const handleTransitionEnd = () => {
            this.handleTransitionEnd('end_of_enter', animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        this.node.style.height = '0px'
        requestAnimationFrame(() => { this.node.style.height = `${height}px` })
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
            <div {...rest} id={this.id} ref={this.ref} className={`${prefixCls}-collapsible ${className}`} aria-expanded={this.expand}>
                {this.props.children}
            </div>
        )
    }
}