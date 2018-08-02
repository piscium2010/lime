import * as classnames from 'classnames'
import * as React from 'react'

type Props = {
    className?: string
    onBlur?: (evt?) => void
    onScroll?: (evt?) => void
    height: number
    trackVertical?: boolean
}

type State = {
    rect: { height }
    scrollTop: number
}

export default class Scrollbar extends React.PureComponent<Props, State> {
    public static defaultProps = {
        onBlur: () => { },
        onScroll: () => {},
        trackVertical: true
    }

    private ref
    private scrollRef
    private trackVerticalRef
    private tempPageX
    private tempPageY
    private tempScrollTop

    constructor(props) {
        super(props)
        this.state = {
            rect: null,
            scrollTop: 0
        }
        this.onScroll = this.onScroll.bind(this)
        this.onWindowScroll = this.onWindowScroll.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll, true)
        window.addEventListener('mousemove', this.onMouseMove, true)
        window.addEventListener('mouseup',this.onMouseUp, true)
        this.setState({ rect: this.ref.getBoundingClientRect() })
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    public render() {
        const { rect, scrollTop } = this.state
        const { className, height, trackVertical, children } = this.props
        const wrapperClasses = classnames('sd-scrollbar-wrapper', className)
        const classes = classnames('sd-scrollbar', {
            ['track-vertical']: trackVertical
        })
        //const top = scrollTop / rect.height * height
        const VerticalTrack = props => (
            rect &&
            <div
                ref={ref => this.trackVerticalRef = ref}
                className='track-vertical-button'
                style={{ height: height / rect.height * height }}
                onMouseDown={this.onMouseDown}
            >
            </div>
        )
        //console.log(`render`,)

        return (
            <div className={wrapperClasses} style={{ height }}>
                <div ref={ref => this.scrollRef = ref} className={classes} style={{ height }} onScroll={this.onScroll}>
                    {
                        rect &&
                        <div
                            ref={ref => this.trackVerticalRef = ref}
                            className='track-vertical-button'
                            style={{ height: height / rect.height * height }}
                            onMouseDown={this.onMouseDown}
                        >
                        </div>
                    }
                    <div ref={ref => this.ref = ref}>
                        {
                            children
                        }
                    </div>
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
        //console.log(`scroll`,)
        //this.setState({ scrollTop: this.scrollRef.scrollTop })
        const { rect } = this.state
        const { height } = this.props
        const trackVerticalHeight = height - height / rect.height * height
        //console.log(`this.trackVerticalRef.style`,this.trackVerticalRef.style)
        this.trackVerticalRef.style.top = Math.min(this.scrollRef.scrollTop, trackVerticalHeight) + 'px'
        this.props.onScroll(evt)
    }

    private onMouseDown(evt) {
        const { pageX, pageY } = evt
        this.tempPageX = pageX
        this.tempPageY = pageY
        this.tempScrollTop = this.scrollRef.scrollTop
        //console.log(`pageY`,pageY)
        evt.preventDefault()
        evt.stopPropagation()
    }

    private onMouseMove(evt) {
        const { pageX, pageY } = evt
        //console.log(`move`,)
        //console.log(`this.tempPagey`,pageY - this.tempPageY, Number.isFinite(this.tempPageY))
        setTimeout(() => {
            if(Number.isFinite(this.tempPageY)) {
                evt.preventDefault()
                evt.stopPropagation()
                // this.setState({
                //     scrollTop: pageY - this.tempPageY + this.tempScrollTop
                // })
                this.scrollRef.scrollTop = pageY - this.tempPageY + this.tempScrollTop
                console.log(`mousemove:`,pageY - this.tempPageY, ' scroll:', pageY - this.tempPageY + this.tempScrollTop)
            }    
        }, 17);
        
        //setTimeout()
        
    }

    private onMouseUp(evt) {
        const { pageX, pageY } = evt
        this.tempPageX = undefined
        this.tempPageY = undefined
        this.tempScrollTop = undefined
        console.log(`pageY`,pageY)
    }
}
