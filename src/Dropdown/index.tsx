import * as classnames from 'classnames'
import * as React from 'react'
import Ripple from '../Ripple/index'
import Scrollbar from '../Scrollbar/index'
import './dropdown.less'

type Props = {
    height?: number
    onBlur?: (event) => void
    onItemClick?: ({ label, value }) => void
    items: Array<{ label, value }>
    show: boolean
}

const Row = ({ item, onClick }) => (
    <Ripple display='block'>
        <div key={item.label} className='sd-dropdown-item' onClick={() => onClick(item)}>
            <span style={{ cursor: 'default' }} title={item.label}>{item.label}</span>
        </div>
    </Ripple>
)

export default class Dropdown extends React.PureComponent<Props, {}> {
    public static defaultProps = {
        height: 300,
        onBlur: () => {},
        onItemClick: () => {}
    }

    private ref

    constructor(props) {
        super(props)
        this.renderRows = this.renderRows.bind(this)
    }

    public render() {
        return (
            <div>
                <div ref={ref => this.ref = ref} className='sd-dropdown-anchor'></div>
                {
                    this.renderRows()
                }
            </div>
        )
    }

    private renderRows() {
        const { items, show, height, onBlur, onItemClick } = this.props
        const rect = show ? this.ref.getBoundingClientRect() : null
        const dropUp = () => window.innerHeight - rect.bottom > height ? false : true

        return (
            show ?
                [
                    <div key={0} className='sd-dropdown-mask' onClick={onBlur}></div>,
                    <div key={1}
                        className='sd-dropdown'
                        style={{ top: dropUp() ? rect.top - height - 5 : rect.bottom }}
                    >
                        <Scrollbar trackVertical height={height} onBlur={onBlur}>
                            {
                                items.map(item => (
                                    <Row key={item.label} item={item} onClick={onItemClick} />
                                ))
                            }
                        </Scrollbar>
                    </div>
                ]
                :
                null
        )
    }
}
