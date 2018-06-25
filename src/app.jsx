import React from 'react';
import { Button } from './Button'
import { Card } from './Card'
import { Toggle } from './Toggle'
import { TextField } from './TextField'


export default class App extends React.Component {
    render() {
        return <div>
            <Card style={{width:'80%', height:200}}>
                <Button>开始使用</Button>
                <Button>预览</Button>
                <div style={{margin:10}}>
                    <Toggle></Toggle>
                </div>
                <div style={{margin:10}}>
                    <TextField label='Standard'/>
                </div>
            </Card>
        </div>
    }
}