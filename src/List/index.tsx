import * as classnames from 'classnames'
import * as React from 'react'
import Scroll from '../Scroll/index'
import { prefixCls } from '../common/index'

export default class List extends React.PureComponent<any, any> {
    public static defaultProps = {
        pageSize: 20,
        itemHeight: 30,
        renderItem: defaultRowRenderer
    }

    private scrollTop = 0

    constructor(props) {
        super(props)
        this.onScroll = this.onScroll.bind(this)
    }

    public render() {
        const { className, items, itemHeight, pageSize, renderItem, ...rest } = this.props
        const classes = classnames(`${prefixCls}-list-wrapper`, className)
        const rows = []
        if(!items) return null

        let flag = 'paddingTop'
        let paddingTop = 0
        let paddingBottom = 0
        let isRowVisible
        let scrollHeight = Math.min(pageSize, items.length || 0) * itemHeight

        items.forEach((item, index) => {
            isRowVisible = this.isRowVisible(index)
            flag = isRowVisible ? 'paddingBottom' : flag // switch from paddingTop to paddingBottom

            if (!isRowVisible && flag === 'paddingTop') {
                paddingTop += itemHeight
            } else if (!isRowVisible && flag === 'paddingBottom') {
                paddingBottom += itemHeight
            } else {
                rows.push(
                    <div
                        className={`${prefixCls}-list-row`}
                        key={item.key || index}
                        style={{
                            height: itemHeight,
                            // lineHeight: `${itemHeight}px`
                        }}
                    >
                        {renderItem(item, index)}
                    </div>
                )
            }
        })

        return (
            <Scroll className={className} height={scrollHeight} onScroll={this.onScroll}>
                <div id='test' {...rest} className={classes}>
                    <div style={{ paddingBottom, paddingTop }}>
                        <div className='lime-list-page'>
                            {
                                rows
                            }
                        </div>
                    </div>
                </div>
            </Scroll>
        )
    }

    private onScroll(evt) {
        const { scrollTop } = evt.target
        this.scrollTop = scrollTop

        setTimeout(() => {
            if (scrollTop === this.scrollTop) {
                this.forceUpdate()
            }
        })
    }

    private isRowVisible(index) {
        const { scrollTop } = this
        const { pageSize, itemHeight } = this.props
        const min = (index - pageSize + 1) * itemHeight
        const max = (index + 1) * itemHeight

        if (min <= scrollTop && scrollTop < max) {
            return true
        } else {
            return false
        }
    }
}

function defaultRowRenderer(item) {
    return (
        <div
            style={{padding: '0 13px', display: 'flex', height: '100%'}}
        >
            <span style={{alignSelf: 'center'}} title={item.value}>{item.value}</span>
        </div>
    )
}
