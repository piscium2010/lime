import React from 'react';
import Button from './Button'
import Card from './Card'
import Toggle from './Toggle'
import TextField from './TextField'
import Select from './Select'

const options = []
for(let i = 0; i < 20; i++) {
    options.push({
        label: 'a' + i,
        value: i
    })
}

export default class App extends React.Component {
    render() {
        return <div style={{height:2000, position:'relative'}}>
            <Card style={{width:'80%', height:200, position:'absolute',top:100}}>
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
            </Card>
            <Card style={{width:'80%', height:200, position:'absolute',bottom:100}}>
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
            </Card>

             
        </div>
    }
}