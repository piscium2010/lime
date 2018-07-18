import React from 'react';
import Button from './Button'
import Card from './Card'
import Toggle from './Toggle'
import TextField from './TextField'
import Select from './Select'
import Checkbox from './Checkbox'
import Dialog from './Dialog'
import List from './List'
import ChoiceGroup from './ChoiceGroup'

const options = []
for(let i = 0; i < 20; i++) {
    options.push({
        key: i,
        text: 'a' + i
    })
}

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDialog: false
        }
    }
    render() {
        return <div style={{height:600, position:'relative'}}>
            {/* <Card style={{width:'80%', height:400, position:'absolute',top:100, display:'flex',flexDirection:'column',justifyContent:'space-between',padding:10}}>
                <div>
                    <Button onClick={()=>{
                        this.setState({showDialog:true})
                    }}>开始使用</Button>
                </div>
                <div>
                    <Button type='text'>预览</Button>
                </div>
                <div style={{margin:10}}>
                    <Toggle></Toggle>
                </div>
                <div style={{margin:10}}>
                    <TextField label='Standard'/>
                </div>
                <div style={{margin:10}}>
                    <Select label='Standard' options={options}/>
                </div>
                <div>
                    <Checkbox label='es lint'/>
                </div>
                <Dialog show={this.state.showDialog}>
                    <div style={{height:100, fontSize:'1.1rem'}}>
                    <p>
                        10块钱买不了吃亏买不了上当
                    </p>
                    </div>
                    <div style={{float:'right'}}>
                        <Button type='text'>取消</Button>
                        <Button onClick={()=>this.setState({showDialog:false})}>确定</Button>
                    </div>
                </Dialog>
                

            </Card>
            <Card style={{width:'80%', height:200, position:'absolute',top:700}}>
                <Button>开始使用</Button>
                <Button>预览</Button>
                <div style={{margin:10}}>
                    <Toggle></Toggle>
                </div>
                <div style={{margin:10}}>
                    <TextField label='Standard'/>
                </div>
                <div style={{margin:10}}>
                    <Select label='Standard' options={options}/>
                </div>
            </Card> */}
            <Card style={{width:'80%', height:500, position:'absolute',bottom:100}}>
                <Button>开始使用</Button>
                <Button>预览</Button>
                <div style={{margin:10}}>
                    <Toggle></Toggle>
                </div>
                <div style={{margin:10}}>
                    <TextField label='Standard'/>
                </div>
                <div style={{margin:10}}>
                    <Select label='Standard' options={options}/>
                </div>
                <div style={{margin:10}}>
                    <List items={options.map(i => i.text)}/>
                </div>
                <div style={{margin:10}}>
                    <ChoiceGroup options={[{key:1,text:'屌丝'},{key:2,text:'女神'}]}/>
                </div>
            </Card>

             
        </div>
    }
}
