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
    private contentRef: React.RefObject<HTMLDivElement>

    constructor(props) {
        super(props)
        this.contentRef = React.createRef()
        this.state = {
            expand: props.defaultExpand || false
        }
    }

    private get expand(): boolean {
        return this.props.expand || this.state.expand
    }

    private get maxHeight(): number | string {
        return this.contentRef.current && this.contentRef.current.offsetHeight || 1000
    }

    componentDidUpdate() {
        if(this.expand) {
            console.log(`epand`,)
            let h = this.contentRef.current.offsetHeight
            console.log(`h`,h)
            setTimeout(()=>{
                
            }, 0)
            this.contentRef.current.style.height = '0px'
            setTimeout(()=>{
                this.contentRef.current.style.height = `${h}px`

            }, 17)
            //this.contentRef.current.style.height = `${h}px`
        }
    }

    render() {
        return (
            // <div className={`${prefixCls}-collapsible`} aria-expanded={this.expand}
            //     style={{ height: this.expand ? this.maxHeight : 0}}>
            //     <div ref={this.contentRef}>
            //         {this.props.children}
            //     </div>
            // </div>
            <div className={`${prefixCls}-collapsible`} aria-expanded={this.expand}>
                {
                    this.expand &&
                    <div ref={this.contentRef} className={`${prefixCls}-collapsible-content`}>
                        {this.props.children}
                    </div>
                }
            </div>
        )
    }
}
