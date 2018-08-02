import * as classnames from 'classnames'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Layer from '../Layer/index'
import Ripple from '../Ripple/index'
import Scrollbar from '../Scrollbar/index'

type Props = {
    itemHeight?: number
    height?: number
    maxItems?: number
    onBlur?: (event) => void
    onItemClick?: ({ key, text }) => void
    items: Array<{ key, text }> | Promise<Array<{ key, text }>>
    show: boolean
}

const Row = ({ item, height, onClick }) => (
    <Ripple display='block'>
        <div
            key={item.key}
            className='sd-dropdown-item'
            onClick={() => onClick(item)}
            style={{ height }}
        >
            <span style={{ cursor: 'default', lineHeight: height + 'px' }} title={item.text}>{item.text}</span>
        </div>
    </Ripple>
)

export default class Dropdown extends React.PureComponent<Props, {}> {
    public static defaultProps = {
        itemHeight: 38,
        maxItems: 10,
        onBlur: () => { },
        onItemClick: () => { }
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
                className='sd-dropdown'
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
        const { itemHeight, maxItems, onBlur, onItemClick } = this.props

        const Scrollable: any = ({ items }) => (
            <Layer
                className='sd-dropdown'
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
                                <Row key={item.key} item={item} onClick={onItemClick} height={itemHeight} />
                            ))
                    }
                </Scrollbar>
            </Layer>
        )

        processArrayOrPromise(this.props.items, result => {
            ReactDOM.render(<Scrollable items={result} />, this.node)
        })
    }

    private removeDropdownNode() {
        this.loading = false
        if (this._node) {
            ReactDOM.unmountComponentAtNode(this._node)
            document.body.removeChild(this._node)
            this._node = null
        }
    }

    private get node() {
        if (!this._node) {
            this._node = document.createElement('div')
            document.body.appendChild(this._node)
        }
        return this._node
    }
}

function processArrayOrPromise(arrayOrPromise, process) {
    if (Array.isArray(arrayOrPromise)) {
        process(arrayOrPromise)
    } else if (arrayOrPromise as any instanceof Promise) {
        arrayOrPromise.then(result => {
            process(result)
        })
    }
}
