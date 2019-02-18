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

export default class Docker extends React.PureComponent<Props, {}> {
    public static defaultProps = {
    }

    public render() {
        return (
            <div className='sd-docker-wrapper'>
            <div className="sd-docker-container">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Andorid</a></li>
                    <li><a>IOS</a></li>
                </ul>
            </div>
            </div>
        )
    }
}
