import * as classnames from 'classnames'
import * as React from 'react'
import Scrollbar from '../Scrollbar/index'

export default class List extends React.PureComponent<any, any> {
    public static defaultProps = {
        height: 200,
        pageSize: 10,
        rowHeight: 30,
        rowRenderer: defaultRowRenderer
    }

    private scrollTop = 0

    constructor(props) {
        super(props)
        this.onScroll = this.onScroll.bind(this)
    }

    public render() {
        const { className, items, height, rowHeight, rowRenderer } = this.props
        const classes = classnames('sd-list-wrapper', className)
        const rows = []

        let flag = 'paddingTop'
        let paddingTop = 0
        let paddingBottom = 0
        let isRowVisible

        items.forEach((item, index) => {
            isRowVisible = this.isRowVisible(index)
            flag = isRowVisible ? 'paddingBottom' : flag // switch from paddingTop to paddingBottom

            if (!isRowVisible && flag === 'paddingTop') {
                paddingTop += rowHeight
            } else if (!isRowVisible && flag === 'paddingBottom') {
                paddingBottom += rowHeight
            } else {
                rows.push(
                    <div
                        className='sd-list-item'
                        key={index}
                        style={{
                            height: rowHeight
                        }}
                    >
                        {rowRenderer(item)}
                    </div>
                )
            }
        })

        return (
            <Scrollbar className={className} height={height} onScroll={this.onScroll}>
                <div className={classes}>
                    <div style={{ paddingBottom, paddingTop }}>
                        <div className='sd-list-page'>
                            {
                                rows
                            }
                        </div>
                    </div>
                </div>
            </Scrollbar>
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
        const { pageSize, rowHeight } = this.props
        const min = (index - pageSize + 1) * rowHeight
        const max = (index + 1) * rowHeight

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
            <span style={{alignSelf: 'center'}} title={item}>{item}</span>
        </div>
    )
}
