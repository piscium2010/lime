import * as classnames from 'classnames'
import * as React from 'react'
import * as debounce from 'debounce'
import { prefixCls } from '../common/index'

export interface IScrollProps {
    className?: string
    onBlur?: (evt?) => void
    onScroll?: (evt?) => void
    height: number
    style: object,
    trackVertical?: boolean
}

export interface IScrollState {}

export default class Scroll extends React.PureComponent<IScrollProps, {}> {
    public static defaultProps = {
        onBlur: () => { },
        onScroll: () => { },
        trackVertical: true
    }

    private contentRef
    private scrollRef
    private verticalThumbRef
    private tempPageX: number
    private tempPageY: number
    private tempScrollTop: number
    private debouncedHideScrollVerticalThumb: Function
    private debouncedSetStyle: Function
    private mouseDownVerticalScrollBar: boolean
    private mouseOverVerticalScrollBar: boolean
    private mouseOverVerticalTrack: boolean

    constructor(props) {
        super(props)
        this.contentRef = React.createRef()
        this.scrollRef = React.createRef()
        this.verticalThumbRef = React.createRef()
        this.debouncedHideScrollVerticalThumb = debounce(this.hideScrollVerticalThumb, 1000)
        this.debouncedSetStyle = debounce(this.setStyle, 300)
    }

    private get contentHeight() {
        return this.contentRef.current.offsetHeight
    }

    private get scrollHeight() {
        return this.scrollRef.current.offsetHeight
    }

    private get isHoveringOnTrackVerticalButton() {
        return this.mouseOverVerticalTrack
            || this.mouseOverVerticalScrollBar
            || this.mouseDownVerticalScrollBar
    }

    private get trackVerticalHeight() {
        const contentHeight = this.contentHeight
        const scrollHeight = this.scrollHeight
        const percentage = Math.min(scrollHeight / contentHeight, 1)
        return percentage * scrollHeight
    }

    private onWindowScroll = evt => {
        const target = evt.target
        const classes = target.getAttribute ? target.getAttribute('class') : ''
        if (classes.indexOf(`${prefixCls}-scroll`) >= 0) {
            // do nothing
        } else {
            this.props.onBlur()
        }
    }

    private onScroll = evt => {
        evt.stopPropagation()
        this.showVerticalTrackButton()
        this.debouncedHideScrollVerticalThumb()
        this.props.onScroll(evt)
    }

    private onMouseDownVerticalScrollBar = evt => {
        const { pageY } = evt
        this.mouseDownVerticalScrollBar = true
        this.tempPageY = pageY
        this.tempScrollTop = this.scrollRef.current.scrollTop
        this.setTrackVerticalButtonHoverStyle()
        evt.preventDefault()
        evt.stopPropagation()
    }

    private onMouseOverVerticalScrollBar = evt => {
        this.mouseOverVerticalScrollBar = true
        this.setTrackVerticalButtonHoverStyle()
    }

    private onMouseLeaveVerticalScrollBar = evt => {
        this.mouseOverVerticalScrollBar = false
        if (!this.isHoveringOnTrackVerticalButton) {
            this.setTrackVerticalThumbStyle()
        }
    }

    private onMouseOverVerticalScrollBarArea = evt => {
        this.mouseOverVerticalTrack = true
        this.showVerticalTrackButton()
    }

    private onMouseLeaveVerticalScrollBarArea = evt => {
        this.mouseOverVerticalTrack = false
        this.debouncedHideScrollVerticalThumb()
    }

    private onMouseMove = evt => {
        const { pageY } = evt
        if (Number.isFinite(this.tempPageY)) {
            requestAnimationFrame(() => {
                evt.preventDefault()
                evt.stopPropagation()
                let contentHeight = this.contentHeight
                let scrollHeight = this.scrollHeight
                let move = (pageY - this.tempPageY) / this.scrollHeight * this.contentHeight
                let top
                top = Math.max(move + this.tempScrollTop, 0) // >= 0
                top = Math.min(top, contentHeight - scrollHeight) // <= rect.height - height
                this.scrollRef.current.scrollTop = top
            })
        }
    }

    private onMouseUp = evt => {
        this.tempPageX = undefined
        this.tempPageY = undefined
        this.tempScrollTop = undefined
        this.mouseDownVerticalScrollBar = false
        if (!this.isHoveringOnTrackVerticalButton
            && this.verticalThumbRef.current) {
            this.setTrackVerticalThumbStyle()
        }
        this.debouncedHideScrollVerticalThumb()
    }

    private showVerticalTrackButton = () => {
        let top: number
        let contentHeight = this.contentHeight
        let scrollHeight = this.scrollHeight
        let trackVerticalHeight = this.trackVerticalHeight
        top = Math.max(this.scrollRef.current.scrollTop / contentHeight * scrollHeight, 0) // >= 0
        top = Math.min(top, scrollHeight - trackVerticalHeight) // less or equal to height - trackVerticalHeight
        this.verticalThumbRef.current.style.height = trackVerticalHeight + 'px'
        this.verticalThumbRef.current.style.top = top + 'px'
        this.verticalThumbRef.current.style.visibility = 'visible'
    }

    private hideScrollVerticalThumb = () => {
        if (!this.isHoveringOnTrackVerticalButton
            && this.verticalThumbRef.current) {
            this.verticalThumbRef.current.style.visibility = 'hidden'
            this.setTrackVerticalThumbStyle()
        }
    }

    private setTrackVerticalThumbStyle = () => {
        this.debouncedSetStyle(1)
    }

    private setTrackVerticalButtonHoverStyle = () => {
        this.debouncedSetStyle(2)
    }

    private setStyle = (option: number) => {
        if (this.contentRef.current && this.verticalThumbRef.current) {
            switch (option) {
                case 1:
                    this.contentRef.current.style.pointerEvents = 'auto'
                    this.verticalThumbRef.current.style.width = '6px'
                    this.verticalThumbRef.current.style.borderRadius = '3px'
                    this.verticalThumbRef.current.style.backgroundColor = 'rgba(0, 0, 0, .3)'
                    break
                case 2:
                    this.contentRef.current.style.pointerEvents = 'none'
                    this.verticalThumbRef.current.style.width = '8px'
                    this.verticalThumbRef.current.style.borderRadius = '4px'
                    this.verticalThumbRef.current.style.backgroundColor = 'rgba(0, 0, 0, .5)'
                    break;
                default:
            }
        }
    }

    componentDidUpdate() {
        //this.updateRect()
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll, true)
        window.addEventListener('mousemove', this.onMouseMove, true)
        window.addEventListener('mouseup', this.onMouseUp, true)
        //this.updateRect()
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    render() {
        const { className, height, trackVertical, children, style: _style } = this.props
        const wrapperClasses = classnames(`${prefixCls}-scroll-wrapper`, className)
        const style = Object.assign({ height }, _style)
        const classes = classnames(`${prefixCls}-scroll`, {
            ['track-vertical']: trackVertical
        })

        return (
            <div className={wrapperClasses} style={style}>
                <div ref={this.scrollRef} className={classes} onScroll={this.onScroll}>
                    <div className={`${prefixCls}-scroll-content`} ref={this.contentRef} >
                        {children}
                    </div>
                    {
                        trackVertical && [
                            <div key={0}
                                className={`${prefixCls}-scroll-vertical-track`}
                                onMouseOverCapture={this.onMouseOverVerticalScrollBarArea}
                                onMouseLeave={this.onMouseLeaveVerticalScrollBarArea}
                            >
                            </div>,
                            <div
                                key={1}
                                ref={this.verticalThumbRef}
                                className={`${prefixCls}-scroll-vertical-thumb`}
                                onMouseDown={this.onMouseDownVerticalScrollBar}
                                onMouseOver={this.onMouseOverVerticalScrollBar}
                                onMouseLeave={this.onMouseLeaveVerticalScrollBar}
                            >
                            </div>
                        ]
                    }
                </div>
            </div>
        )
    }
}
