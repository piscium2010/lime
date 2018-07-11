import * as classnames from 'classnames'
import * as React from 'react'
import Scrollbar from '../Scrollbar/index'
import './list.less'

export default class List extends React.PureComponent<any, any> {
    ref
    rowMetaData = []

    public static defaultProps = {
        height: 200,
        pageItemsCount: 10
    }

    constructor(props) {
        super(props)
        this.state = {
            pageHeight: 0,
            scrollTop: 0
        }
        this.update = this.update.bind(this)
        this.onScroll = this.onScroll.bind(this)
    }

    public componentDidMount() {
        this.setState({
            pageHeight: this.ref.offsetHeight
        })
    }

    public render() {
        const { className, items, height, pageItemsCount } = this.props
        const classes = classnames('sd-list-wrapper', className)

        const { pageHeight } = this.state
        const { scrollTop, itemHeight } = this.props
        const startIndex = 0 
        const itemsToRender = []
        const approximateHeight = items.length / pageItemsCount * pageHeight

        for (let i = 0; i < pageItemsCount; i++) {
            itemsToRender.push(items[i + startIndex])
        }

        return (
            approximateHeight ?
                <Scrollbar className={className} height={height} onScroll={this.onScroll}>
                    <div className='sd-list-wrapper'>
                        <div style={{ paddingBottom: approximateHeight }}>
                            <div ref={ref => this.ref = ref} className="sd-list-page">
                                {
                                    items.map((item, index) => {
                                        let isRowVisible = this.isRowVisible(index)
                                        let metaData = this.rowMetaData[index] || {}
                                        metaData.visible = isRowVisible
                                        this.rowMetaData[index] = metaData

                                        return (
                                            isRowVisible ?
                                            <Row
                                                index={index}
                                                item={item}
                                                rowMetaData={this.rowMetaData}
                                                rowRenderer={this.rowRenderer}
                                            />
                                            :
                                            null
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Scrollbar>
                :
                <div className='sd-list-wrapper'>
                    <div style={{ paddingBottom: 0 }}>
                        <div ref={ref => this.ref = ref} className="sd-list-page">
                            {
                                itemsToRender.map(item => this.rowRenderer(item))
                            }
                        </div>
                    </div>
                </div>
        )
    }

    private update(scrollTop) {
        console.log(`this.meta`,this.rowMetaData)
    }

    private onScroll(evt) {
        const { scrollTop } = evt.target
        this.setState({
            scrollTop
        })
        setTimeout(() => {
            this.update(scrollTop)
        });
    }

    private listRenderer(index) {
        
    }

    private isRowVisible(index) {
        let result = false

        const { scrollTop } = this.state
        const { height, pageItemsCount } = this.props
        const sum = (accumulator, current) => {
            console.log(`current`,current)
            return accumulator + current.height || 0
        }
        const array = this.rowMetaData.slice(0, index)
        const min = array.reduce(sum, 0)
        const max = min + height

        if (min <= scrollTop && scrollTop < max) {
            result = true
        }

        if (this.rowMetaData.filter(i => i.visible).length >= pageItemsCount) {
            result = false
        }

        return result
    }

    private rowRenderer(item) {
        return (
            <div style={{ height: 20 }}>{item}</div>
        )
    }

    private bottomSpacing() {

    }
}

class Row extends React.PureComponent<any, any> {
    ref

    public componentDidMount() {
        const { index, rowMetaData } = this.props
        const metaData = rowMetaData[index] || {}
        rowMetaData[index] = Object.assign(metaData, { height: this.ref.offsetHeight })
    }

    public render() {
        const { rowRenderer, item } = this.props

        return (
            <div ref={ref => this.ref = ref}>
                {
                    rowRenderer(item)
                }
            </div>
        )
    }
}
