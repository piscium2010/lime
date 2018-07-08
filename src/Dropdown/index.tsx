import * as classnames from 'classnames'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Ripple from '../Ripple/index'
import Scrollbar from '../Scrollbar/index'
import './dropdown.less'

type LayerProps = {
    boundingClientRect: { top, right, bottom, left, width, height }
    height: number
    onBlur: (evt?) => void
}

class Layer extends React.PureComponent<LayerProps, {}> {
    public render() {
        const { boundingClientRect: rect, children, height, onBlur } = this.props
        const dropUp = window.innerHeight - rect.bottom > height ? false : true

        return [
            <div key={0} className='sd-dropdown-mask' onClick={onBlur}></div>,
            <div key={1}
                className='sd-dropdown'
                style={{ top: dropUp ? rect.top - height - 5 : rect.bottom, left: rect.left, width: rect.width, height }}
            >
               {children}
            </div>
        ]
    }
}

type Props = {
    itemHeight?: number
    height?: number
    maxItems?: number
    onBlur?: (event) => void
    onItemClick?: ({ label, value }) => void
    items: Array<{ label, value }> | Promise<Array<{ label, value}>>
    show: boolean
}

const Row = ({ item, height, onClick }) => (
    <Ripple display='block'>
        <div 
            key={item.label} 
            className='sd-dropdown-item' 
            onClick={() => onClick(item)}
            style={{height}}
        >
            <span style={{ cursor: 'default', lineHeight:height+'px' }} title={item.label}>{item.label}</span>
        </div>
    </Ripple>
)

export default class Dropdown extends React.PureComponent<Props, {}> {
    public static defaultProps = {
        itemHeight: 38,
        maxItems: 10,
        onBlur: () => {},
        onItemClick: () => {}
    }

    private loading
    private ref
    private _node

    public componentDidUpdate() {
        const { show, items } = this.props

        if (show && Array.isArray(items)) {
            this.renderDropdown()
        } else if (show && items instanceof Promise) {
            this.renderLoading()
            items.then(() => {
                if (items === this.props.items) {
                    this.renderDropdown()
                }
            })
        } else {
            this.removeDropdownNode()
        }
    }

    public render() {
        return (
            <div ref={ref => this.ref = ref} className='sd-dropdown-anchor'></div>
        )
    }

    private renderLoading() {
        const { itemHeight, onBlur } = this.props

        const Loading: any = () => (
            <Layer
                boundingClientRect={this.ref.getBoundingClientRect()}
                height={itemHeight}
                onBlur={onBlur}
            >
                <div className='sd-dropdown-loading'></div>
            </Layer>
        )

        if (!this.loading) {
            this.loading = true
            ReactDOM.render(<Loading />, this.node)
        }
    }

    private renderDropdown() {
        this.loading = false
        const { items, itemHeight, maxItems, onBlur, onItemClick } = this.props
        
        const Scrollable: any = ({ items }) => (
            <Layer
                boundingClientRect={this.ref.getBoundingClientRect()}
                height={maxItems * itemHeight}
                onBlur={onBlur}
            >
                <Scrollbar trackVertical height={maxItems * itemHeight} onBlur={onBlur}>
                    {
                        items.length === 0 ?
                            <div className='sd-dropdown-item'>
                                <span style={{ cursor: 'default' }}>No result found</span>
                            </div>
                            :
                            items.map(item => (
                                <Row key={item.label} item={item} onClick={onItemClick} height={itemHeight}/>
                            ))
                    }
                </Scrollbar>
            </Layer>
        )

        if(Array.isArray(items)) {
            ReactDOM.render(<Scrollable items={items} />, this.node)
        } else if (items as any instanceof Promise) {
            items.then(list => {
                ReactDOM.render(<Scrollable items={list} />, this.node)
            })
        }
    }

    private removeDropdownNode() {
        this.loading = false
        if (this._node) {
            ReactDOM.unmountComponentAtNode(this._node)
            document.removeChild(this._node)
            this._node = null
        }
    }

    private get node() {
        if(!this._node) {
            this._node = document.createElement('div')
            document.body.appendChild(this._node)
        }
        return this._node
    }
}
