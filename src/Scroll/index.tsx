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

export interface IScrollState {
    rect: { width?, height?}
}

export default class Scroll extends React.PureComponent<IScrollProps, IScrollState> {
    public static defaultProps = {
        onBlur: () => { },
        onScroll: () => { },
        trackVertical: true
    }

    private contentRef
    private scrollRef
    private trackVerticalRef
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
        this.state = {
            rect: {}
        }
        this.contentRef = React.createRef()
        this.scrollRef = React.createRef()
        this.onScroll = this.onScroll.bind(this)
        this.onWindowScroll = this.onWindowScroll.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.debouncedHideScrollVerticalThumb = debounce(this.hideScrollVerticalThumb, 2500)
        this.debouncedSetStyle = debounce(this.setStyle, 200)
    }

    private get contentHeight() {
        return this.contentRef.current.offsetHeight
    }

    private get scrollHeight() {
        return this.scrollRef.current.offsetHeight
    }

    private updateRect = () => {
        let { rect } = this.state
        let { width, height } = this.contentRef.current.getBoundingClientRect()
        if (width != rect.width || height != rect.height) {
            this.setState({ rect: { width, height } })
        }
    }

    componentDidUpdate() {
        this.updateRect()
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll, true)
        window.addEventListener('mousemove', this.onMouseMove, true)
        window.addEventListener('mouseup', this.onMouseUp, true)
        this.updateRect()
        this.contentRef.current.addEventListener('resize', ()=>{console.log(`resize`,)})
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    render() {
        const { rect } = this.state
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
                            ></div>,
                            <div
                                key={1}
                                ref={ref => this.trackVerticalRef = ref}
                                className={`${prefixCls}-scroll-vertical-thumb`}
                                style={{ height: rect.height ? this.trackVerticalHeight : 0 }}
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

    private onWindowScroll(evt) {
        const target = evt.target
        const classes = target.getAttribute ? target.getAttribute('class') : ''
        if (classes.indexOf(`${prefixCls}-scroll`) >= 0) {
            // do nothing
        } else {
            this.props.onBlur()
        }
    }

    private onScroll(evt) {
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
            this.setTrackVerticalButtonStyle()
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

    private onMouseMove(evt) {
        const { pageY } = evt
        requestAnimationFrame(() => {
            if (Number.isFinite(this.tempPageY)) {
                evt.preventDefault()
                evt.stopPropagation()
                let { rect } = this.state
                let { height } = this.props
                let move = (pageY - this.tempPageY) / height * rect.height
                let top
                top = Math.max(move + this.tempScrollTop, 0) // >= 0
                top = Math.min(top, rect.height - height) // <= rect.height - height
                this.scrollRef.current.scrollTop = top
            }
        })
    }

    private onMouseUp() {
        this.tempPageX = undefined
        this.tempPageY = undefined
        this.tempScrollTop = undefined
        this.mouseDownVerticalScrollBar = false
        if (!this.isHoveringOnTrackVerticalButton
            && this.trackVerticalRef) {
            this.setTrackVerticalButtonStyle()
        }
        this.debouncedHideScrollVerticalThumb()
    }

    private showVerticalTrackButton = () => {
        let top
        let { rect } = this.state
        const contentHeight = this.contentRef.current.offsetHeight
        let { height } = this.props
        top = Math.max(this.scrollRef.current.scrollTop / rect.height * height, 0) // >= 0
        top = Math.min(top, height - this.trackVerticalHeight) // less or equal to height - trackVerticalHeight
        this.trackVerticalRef.style.top = top + 'px'
        this.trackVerticalRef.style.visibility = 'visible'
    }

    private hideScrollVerticalThumb = () => {
        if (!this.isHoveringOnTrackVerticalButton
            && this.trackVerticalRef) {
            this.trackVerticalRef.style.visibility = 'hidden'
            this.setTrackVerticalButtonStyle()
        }
    }

    private setTrackVerticalButtonStyle = () => {
        this.debouncedSetStyle(1)
    }

    private setTrackVerticalButtonHoverStyle = () => {
        this.debouncedSetStyle(2)
    }

    private setStyle = (option: number) => {
        if (this.contentRef.current && this.trackVerticalRef) {
            switch (option) {
                case 1:
                    this.contentRef.current.style.pointerEvents = 'auto'
                    this.trackVerticalRef.style.width = '6px'
                    this.trackVerticalRef.style.borderRadius = '3px'
                    this.trackVerticalRef.style.backgroundColor = 'rgba(0, 0, 0, .3)'
                    break
                case 2:
                    this.contentRef.current.style.pointerEvents = 'none'
                    this.trackVerticalRef.style.width = '8px'
                    this.trackVerticalRef.style.borderRadius = '4px'
                    this.trackVerticalRef.style.backgroundColor = 'rgba(0, 0, 0, .5)'
                    break;
                default:
            }
        }
    }

    get isHoveringOnTrackVerticalButton() {
        return this.mouseOverVerticalTrack
            || this.mouseOverVerticalScrollBar
            || this.mouseDownVerticalScrollBar
    }

    get trackVerticalHeight() {
        const contentHeight = this.contentHeight
        const scrollHeight = this.scrollHeight
        const percentage = Math.min(scrollHeight / contentHeight, 1)
        return percentage * scrollHeight
    }
}
