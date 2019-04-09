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
    private entering: number
    private leaving: number

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
            expand: props.defaultExpand || false
        }
        this.entering = 2
        this.leaving = 3
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

    private handleTransitionEnd = (animatingId: number) => {
            if (animatingId !== this.animating) { return }
            const style = this.node.style
            
            if(animatingId % 2 == 0) { // end of enter
                style.height = ``
                // console.log(`3`, animatingId)
            } else { // end of leave
                style.display = 'none'
                    style.height = ``
                // console.log(`7`, animatingId)
            } 
            this.animating = 0
    }

    private performEnterAnimation = () => {
        const style = this.node.style
        style.display = 'block' // 1st
        const height = this.collapsibleHeight // 2nd
        this.entering += 2
        this.animating = this.entering
        const animatingId = this.entering
        const handleTransitionEnd = () => {
            this.handleTransitionEnd(animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        
        style.height = '0px'
        // console.log(`1`, animatingId)
        requestAnimationFrame(() => { 
            style.height = `${height}px`
            // console.log(`2`, animatingId)
            this.node.addEventListener('transitionend', handleTransitionEnd)
        })
    }

    private performLeaveAnimation = () => {
        const style = this.node.style
        const height = this.collapsibleHeight
        this.leaving += 2
        this.animating = this.leaving
        const animatingId = this.leaving
        const handleTransitionEnd = () => {
            this.handleTransitionEnd(animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        
        style.height = `${height}px`
        // console.log(`5`, animatingId)
        requestAnimationFrame(() => { 
            style.height = `0px`
            // console.log(`6`, animatingId)
            this.node.addEventListener('transitionend', handleTransitionEnd)
        })
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