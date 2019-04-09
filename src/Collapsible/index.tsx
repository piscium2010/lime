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
    private ENTERING: number
    private LEAVING: number

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.id = `collapsible-${Date.now()}-${Math.round(Math.random()*1000)}`
        this.state = {
            expand: props.defaultExpand || false
        }
        this.ENTERING = 2
        this.LEAVING = 3
        
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
        // return document.getElementById(this.id)
    }

    private handleTransitionEnd = (transitionEndType: string, animatingId: number) => {
        // requestAnimationFrame(() => {
            // return
            if (animatingId !== this.animating) { return }
            const style = this.node.style
            
            // switch (transitionEndType) {
            //     case 'end_of_enter':
            //         style.height = ``
            //         // console.log(`end of enter`,)
            //         console.log(`3`, animatingId)
            //         break
            //     case 'end_of_leave':
            //         style.display = 'none'
            //         style.height = ``
            //         console.log(`7`, animatingId)
            //         // console.log(`end of leave`,)
            //         break
            //     default:
            //         console.error('collapsible - invalid param of handletransitionEnd')
            // }
            if(animatingId % 2 == 0) {
                style.height = ``
                // console.log(`end of enter`,)
                console.log(`3`, animatingId)
            } else if(animatingId % 2 == 1) {
                style.display = 'none'
                    style.height = ``
                    console.log(`7`, animatingId)
            } else {
                console.error('collapsible - invalid param of handletransitionEnd')
            }
            this.animating = 0
        // })
    }

    private performEnterAnimation = () => {
        // if(this.animating && this.animating % 2 == 0) { console.log(`return`,); return }
        // const style = this.node.style
        // console.log(`enter`, this.node.style.height)
        // this.node.style.height = ''
        this.node.style.display = 'block' // 1st
        const height = this.collapsibleHeight // 2nd
        this.ENTERING += 2
        this.animating = this.ENTERING
        const animatingId = this.animating
        const handleTransitionEnd = () => {
            this.handleTransitionEnd('end_of_enter', animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        
        this.node.style.height = '0px'
        console.log(`1`, animatingId)
        requestAnimationFrame(() => { 
            this.node.style.height = `${height}px`; console.log(`2`, animatingId)
            this.node.addEventListener('transitionend', handleTransitionEnd)
        })
    }

    private performLeaveAnimation = () => {
        // if(this.animating && this.animating % 3 == 0) { console.log(`return leave`,);return }
        const style = this.node.style
        const height = this.collapsibleHeight
        this.LEAVING += 2
        this.animating = this.LEAVING
        const animatingId = this.animating
        const handleTransitionEnd = () => {
            this.handleTransitionEnd('end_of_leave', animatingId)
            this.node.removeEventListener('transitionend', handleTransitionEnd)
        }
        
        style.height = `${height}px`
        console.log(`5`, animatingId)
        requestAnimationFrame(() => { 
            style.height = `0px`; console.log(`6`, animatingId)
            this.node.addEventListener('transitionend', handleTransitionEnd)
        })
    }

    componentDidMount() {
        this.node.style.display = this.expand ? 'block' : 'none'
    }

    componentDidUpdate() {
        if (this.expand && this.node.childElementCount && (this.node.style.display == 'none' || this.animating)) {
            requestAnimationFrame(() => {
                // console.log(`p en`,this.animating)
                this.performEnterAnimation()
            })
        } else if (!this.expand && this.node.childElementCount && (this.node.style.display == 'block' || this.animating)) {
            requestAnimationFrame(() => {
                // console.log(`p leav`,this.animating)
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