import * as React from 'react'
import { prefixCls } from '../common';

export interface ICollapsibleProps extends React.AllHTMLAttributes<HTMLDivElement> {
    defaultExpand?: boolean
    expand?: boolean
}

export interface ICollapsibleState {
    expand: boolean
}

export default class Collapsible extends React.PureComponent<ICollapsibleProps, ICollapsibleState> {
    private ref: React.RefObject<HTMLDivElement>

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
            expand: props.expand || props.defaultExpand || false
        }
    }

    private get expand(): boolean {
        return this.props.expand || this.state.expand
    }

    private get node(): HTMLElement {
        return this.ref.current
    }

    private performEnterAnimation = () => {
        this.node.style.display = 'block'
        let height = this.node.offsetHeight
        let handleTransitionEnd = () => {
            this.node.style.height = ``
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        this.node.style.height = '0px'
        setTimeout(() => { this.node.style.height = `${height}px` }, 17)
    }

    private performLeaveAnimation = () => {
        let height = this.node.offsetHeight
        let handleTransitionEnd = () => {
            this.node.style.display = 'none'
            this.node.style.height = ``
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        this.node.addEventListener('transitionend', handleTransitionEnd)
        this.node.style.height = `${height}px`
        setTimeout(() => { this.node.style.height = `0px` }, 17)
    }

    componentDidMount() {
        this.node.style.display =  this.expand ? 'block' : 'none'
    }

    componentDidUpdate() {
        if (this.expand && this.node.childElementCount && this.node.style.display == 'none') {
            this.performEnterAnimation()
        } else if (this.node.childElementCount) {
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
