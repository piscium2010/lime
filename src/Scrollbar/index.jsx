import React, { Children } from 'react'
import classnames from 'classnames'
import './scrollbar.less'

export class Scrollbar extends React.PureComponent {
    static defaultProps = {
        onBlur: () => { }
    }

    constructor(props) {
        super(props)
        this.state = {
            rect: null,
            scrollTop: 0
        }
        this.ref = null
        this.onScroll = this.onScroll.bind(this)
        this.onWindowScroll = this.onWindowScroll.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll',this.onWindowScroll,true)
        this.setState({ rect: this.ref.getBoundingClientRect() })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll',this.onWindowScroll)
    }

    onWindowScroll(evt) {
        let target = evt.target
        let classes = target.getAttribute ? target.getAttribute('class') : ''
        if(classes.indexOf('sd-scrollbar') >= 0) {
            //do nothing
        }
        else{
            this.props.onBlur()
        }
    }

    onScroll() {
        this.setState({scrollTop:this.scrollRef.scrollTop})
    }

    render() {
        let { rect, scrollTop } = this.state
        let { height, trackVertical, children } = this.props
        let classes = classnames('sd-scrollbar', {
            ['track-vertical']: trackVertical
        })
        let VerticalTrack = props => (
            rect &&
            <div
                className="track-vertical-button"
                style={{ height: height / rect.height * height, top: scrollTop / rect.height * height }}
            >
            </div>
        )

        return (
            <div className="sd-scrollbar-wrapper" style={{ height }}>
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
}