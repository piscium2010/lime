import * as classnames from 'classnames'
import * as React from 'react'
import Scrollbar from '../Scrollbar/index'
import './list.less'

export default class List extends React.PureComponent<any, any> {
    ref
    rowMetaData = []
    scrollTop = 0

    public static defaultProps = {
        height: 200,
        pageItemsCount: 10
    }

    constructor(props) {
        super(props)
        this.state = {
            pageHeight: 0,
            paddingTop: 0,
            paddingBottom: 200
        }
        this.rowMetaData = props.items.map(i => ({ visible: false, height: 0 }))
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

        const { pageHeight, paddingBottom } = this.state
        const { itemHeight } = this.props
        const startIndex = 0 
        const itemsToRender = []
        const approximateHeight = items.length / pageItemsCount * pageHeight

        let flag = 'top'
        let paddingTop = 0
        let rows = []

        items.forEach((item, index) => {
            let isRowVisible = this.isRowVisible(index)
            this.rowMetaData[index].visible = isRowVisible

            if(!isRowVisible && flag === 'top') {
                paddingTop += this.rowMetaData[index].height
            }

            if(isRowVisible && flag === 'top') {
                flag = 'bottom'
            }

            if(isRowVisible) {
                rows.push(<Row
                    key={index}
                    index={index}
                    item={item}
                    rowMetaData={this.rowMetaData}
                    rowRenderer={this.rowRenderer}
                />)
            }
        })

        return (
            approximateHeight ?
                <Scrollbar className={className} height={height} onScroll={this.onScroll}>
                    <div className='sd-list-wrapper'>
                        <div style={{ paddingBottom, paddingTop }}>
                            <div ref={ref => this.ref = ref} className="sd-list-page">
                                {
                                    rows
                                }
                            </div>
                        </div>
                    </div>
                </Scrollbar>
                :
                <div className='sd-list-wrapper'>
                        <div style={{ paddingBottom, paddingTop }}>
                            <div ref={ref => this.ref = ref} className="sd-list-page">
                                {
                                    items.map((item, index) => {
                                        return (
                                            index < pageItemsCount?
                                            <Row
                                                key={index}
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
        )
    }

    private update(scrollTop) {
        console.log(`this.meta`)

        this.forceUpdate()
    }

    private onScroll(evt) {
        const { scrollTop } = evt.target
        this.scrollTop = scrollTop

        setTimeout(() => {
            if(scrollTop === this.scrollTop) {
                this.update(scrollTop)
            }
        },1000)
    }

    private listRenderer(index) {
        
    }

    private isRowVisible(index) {
        let result = null

        const { scrollTop } = this
        const { height, pageItemsCount } = this.props
        const sum = (accumulator, current) => {
            
            return accumulator + current.height || 0
        }
        const selfHeight = this.rowMetaData[index] && this.rowMetaData[index].height ? this.rowMetaData[index].height : 0
        const array = this.rowMetaData.slice(0, index)
        const max = array.reduce(sum, 0) + selfHeight
        const arrayII = this.rowMetaData.slice(pageItemsCount, Math.max(index,pageItemsCount))
        const sumII = (a,c) => {
                //console.log(`index:`+index,c)
            return a + c.height
        }
        
        const min = arrayII.reduce(sumII, 0)
        //const max = min + height + selfHeight
        let a = null, b = null
        

        if (min <= scrollTop && scrollTop <= max) {
            result = true
            a = true
        }

        if (this.rowMetaData.filter((item,i) => item.visible && i < index).length >= pageItemsCount) {
            result = false
            b = true
        }

        console.log(`index:` + index, scrollTop, min, max,result)
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
