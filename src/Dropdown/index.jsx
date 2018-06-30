import React from 'react'
import classnames from 'classnames'
import { Scrollbar } from '../Scrollbar'
import withRipple from '../ripple'
import './dropdown.less'

const Item = ({ item, onClick }) => (
    <div key={item.label} className='sd-dropdown-item' onClick={() => onClick(item)}>
        <span style={{cursor:'default'}} title={item.label}>{item.label}</span>
    </div>
)

const RippleItem = withRipple(Item,'block')

export class Dropdown extends React.PureComponent {
    static defaultProps = {
        height: 300,
        onBlur: () => {},
        onItemClick: () => {}
    }

    constructor(props) {
        super(props)
        this.ref = null
        this.renderRows = this.renderRows.bind(this)
    }

    renderRows() {
        let { items, show, height, onBlur, onItemClick } = this.props
        let rect = show ? this.ref.getBoundingClientRect() : null
        let dropUp = () => window.innerHeight - rect.bottom > height ? false : true

        return (
            show ?
                [
                    <div key={0} className="sd-dropdown-mask" onClick={onBlur}></div>,
                    <div key={1} className="sd-dropdown" style={{ top: dropUp() ? rect.top - height - 5 : rect.bottom }}>
                        <Scrollbar trackVertical height={height} onBlur={onBlur}>
                            {
                                items.map(item => (
                                    <RippleItem key={item.label} item={item} onClick={onItemClick}/>
                                ))
                            }
                        </Scrollbar>
                    </div>
                ]
                :
                null
        )
    }

    render() {
        return (
            <div>
                <div ref={ref => this.ref = ref} className="sd-dropdown-anchor"></div>
                {
                    this.renderRows()
                }
            </div>
        )
    }
}