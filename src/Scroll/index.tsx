import * as classnames from 'classnames'
import * as React from 'react'
import * as debounce from 'debounce'

type Props = {
    className?: string
    onBlur?: (evt?) => void
    onScroll?: (evt?) => void
    height: number
    trackVertical?: boolean
}

type State = {
    rect: { height }
}

export default class Scroll extends React.PureComponent<Props, State> {
    public static defaultProps = {
        onBlur: () => { },
        onScroll: () => { },
        trackVertical: true
    }

    private ref
    private scrollRef
    private trackVerticalRef
    private tempPageX: number
    private tempPageY: number
    private tempScrollTop: number
    private debouncedHideTrackVerticalButton: Function
    private mouseDownVerticalScrollBar: boolean
    private mouseOverVerticalScrollBar: boolean
    private mouseOverVerticalScrollBarArea: boolean


    constructor(props) {
        super(props)
        this.state = {
            rect: null
        }
        this.onScroll = this.onScroll.bind(this)
        this.onWindowScroll = this.onWindowScroll.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.debouncedHideTrackVerticalButton = debounce(this.hideTrackVerticalButton, 2500)
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll, true)
        window.addEventListener('mousemove', this.onMouseMove, true)
        window.addEventListener('mouseup', this.onMouseUp, true)
        this.setState({ rect: this.ref.getBoundingClientRect() })
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    public render() {
        const { rect } = this.state
        const { className, height, trackVertical, children } = this.props
        const extraHeightToHideBrowserScroll = 20
        const wrapperClasses = classnames('sd-scrollbar-wrapper', className)
        const classes = classnames('sd-scrollbar', {
            ['track-vertical']: trackVertical
        })

        return (
            <div className={wrapperClasses} style={{ height }}>
                <div ref={ref => this.scrollRef = ref} className={classes} style={{ height: height + extraHeightToHideBrowserScroll }} onScroll={this.onScroll}>
                    <div ref={ref => this.ref = ref} >
                        {
                            children
                        }
                    </div>
                    {
                        trackVertical && [
                            <div key={0}
                                className='track-vertical-area'
                                onMouseOverCapture={this.onMouseOverVerticalScrollBarArea}
                                onMouseLeave={this.onMouseLeaveVerticalScrollBarArea}
                            ></div>,
                            <div
                                key={1}
                                ref={ref => this.trackVerticalRef = ref}
                                className='track-vertical-button'
                                style={{ height: rect ? this.trackVerticalHeight : 0 }}
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
        if (classes.indexOf('sd-scrollbar') >= 0) {
            // do nothing
        } else {
            this.props.onBlur()
        }
    }

    private onScroll(evt) {
        this.showVerticalTrackButton()
        this.debouncedHideTrackVerticalButton()
        this.props.onScroll(evt)
    }

    private onMouseDownVerticalScrollBar = evt => {
        const { pageY } = evt
        this.mouseDownVerticalScrollBar = true
        this.tempPageY = pageY
        this.tempScrollTop = this.scrollRef.scrollTop
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
        this.mouseOverVerticalScrollBarArea = true
        this.showVerticalTrackButton()
    }

    private onMouseLeaveVerticalScrollBarArea = evt => {
        this.mouseOverVerticalScrollBarArea = false
        this.debouncedHideTrackVerticalButton()
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
                this.scrollRef.scrollTop = top
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
        this.debouncedHideTrackVerticalButton()
    }

    private showVerticalTrackButton = () => {
        let top
        let { rect } = this.state
        let { height } = this.props
        top = Math.max(this.scrollRef.scrollTop / rect.height * height, 0) // >= 0
        top = Math.min(top, height - this.trackVerticalHeight) // <= height - trackVerticalHeight
        this.trackVerticalRef.style.top = top + 'px'
        this.trackVerticalRef.style.visibility = 'visible'
    }

    private hideTrackVerticalButton = () => {
        if (!this.isHoveringOnTrackVerticalButton
            && this.trackVerticalRef) {
            this.trackVerticalRef.style.visibility = 'hidden'
            this.setTrackVerticalButtonStyle()
        }
    }

    private setTrackVerticalButtonStyle = () => {
        this.ref.style.pointerEvents = 'auto'
        this.trackVerticalRef.style.width = '6px'
        this.trackVerticalRef.style.borderRadius = '3px'
        this.trackVerticalRef.style.backgroundColor = 'rgba(0, 0, 0, .3)'
    }

    private setTrackVerticalButtonHoverStyle = () => {
        this.ref.style.pointerEvents = 'none'
        this.trackVerticalRef.style.width = '8px'
        this.trackVerticalRef.style.borderRadius = '4px'
        this.trackVerticalRef.style.backgroundColor = 'rgba(0, 0, 0, .5)'
    }

    get isHoveringOnTrackVerticalButton() {
        return this.mouseOverVerticalScrollBarArea
            || this.mouseOverVerticalScrollBar
            || this.mouseDownVerticalScrollBar
    }

    get trackVerticalHeight() {
        const { rect } = this.state
        const { height } = this.props
        return height / rect.height * height
    }
}
