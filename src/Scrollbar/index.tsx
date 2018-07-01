import * as classnames from 'classnames'
import * as React from 'react'
import './scrollbar.less'

type Props = {
    onBlur: (evt?) => void
    height: number
    trackVertical: boolean
}

type State = {
    rect: { height }
    scrollTop: number
}

export default class Scrollbar extends React.PureComponent<Props, State> {
    public static defaultProps = {
        onBlur: () => { }
    }

    private ref
    private scrollRef

    constructor(props) {
        super(props)
        this.state = {
            rect: null,
            scrollTop: 0
        }
        this.onScroll = this.onScroll.bind(this)
        this.onWindowScroll = this.onWindowScroll.bind(this)
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.onWindowScroll, true)
        this.setState({ rect: this.ref.getBoundingClientRect() })
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.onWindowScroll)
    }

    public render() {
        const { rect, scrollTop } = this.state
        const { height, trackVertical, children } = this.props
        const classes = classnames('sd-scrollbar', {
            ['track-vertical']: trackVertical
        })
        const VerticalTrack = props => (
            rect &&
            <div
                className='track-vertical-button'
                style={{ height: height / rect.height * height, top: scrollTop / rect.height * height }}
            >
            </div>
        )

        return (
            <div className='sd-scrollbar-wrapper' style={{ height }}>
                <div ref={ref => this.scrollRef = ref} className={classes} style={{ height }} onScroll={this.onScroll}>
                    <VerticalTrack />
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

    private onScroll() {
        this.setState({ scrollTop: this.scrollRef.scrollTop })
    }
}
