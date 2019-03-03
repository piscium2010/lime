import * as React from 'react'
import * as ReactDOM from 'react-dom'
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
    private contentRef: React.RefObject<HTMLDivElement>

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.contentRef = React.createRef()
        this.state = {
            expand: props.expand || props.defaultExpand || false
        }
    }

    private get expand(): boolean {
        return this.props.expand || this.state.expand
    }

    private get maxHeight(): number | string {
        return this.contentRef.current && this.contentRef.current.offsetHeight || 1000
    }

    private performEnterAnimation = () => {
        let node = this.contentRef.current
        let height = node.offsetHeight
        //let node = this.contentRef.current.offsetHeight
        node.style.height = '0px'
        setTimeout(() => {
            console.log(`timeout1`,)
            node.style.height = `${height}px`
        }, 17)
        setTimeout(() => {
            console.log(`timeout2`,)
            node.style.height = ``
        }, 3000)
       
        // setTimeout(() => {
        //     node.style.height = `${height}px`
        // }, 17)
        //this.contentRef.current.style.height = `${h}px`

    }

    componentDidUpdate() {
        let node = this.ref.current
        if (this.expand && node.childElementCount === 0 && this.props.children) {
            console.log(`expand`)
            ReactDOM.render(
                <div ref={this.contentRef} className={`${prefixCls}-collapsible-content`}>
                    {this.props.children}
                </div>,
                node
            )
            setTimeout(this.performEnterAnimation, 0)
            //this.performEnterAnimation()
        } else if (node.childElementCount) {
            console.log(`collapse`)
            ReactDOM.unmountComponentAtNode(node)
        }

        //this.contentRef.current.style.height = `${h}px`
        // if(this.expand) {
        //     console.log(`epand`,)
        //     let h = this.contentRef.current.offsetHeight
        //     console.log(`h`,h)
        //     setTimeout(()=>{

        //     }, 0)
        //     this.contentRef.current.style.height = '0px'
        //     setTimeout(()=>{
        //         this.contentRef.current.style.height = `${h}px`

        //     }, 17)
        //     //this.contentRef.current.style.height = `${h}px`
        // }
    }

    render() {
        return (
            // <div className={`${prefixCls}-collapsible`} aria-expanded={this.expand}
            //     style={{ height: this.expand ? this.maxHeight : 0}}>
            //     <div ref={this.contentRef}>
            //         {this.props.children}
            //     </div>
            // </div>
            // <div className={`${prefixCls}-collapsible`} aria-expanded={this.expand}>
            //     {
            //         this.expand &&
            //         <div ref={this.contentRef} className={`${prefixCls}-collapsible-content`}>
            //             {this.props.children}
            //         </div>
            //     }
            // </div>
            <div ref={this.ref} className={`${prefixCls}-collapsible`} aria-expanded={this.expand}></div>
        )
    }
}
