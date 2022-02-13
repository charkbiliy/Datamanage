import React, { Component } from 'react'
import {Card,
    Select,Icon,
    Table,
    Button,
    Form, Input,
    message,Cascader,Upload,InputNumber} from 'antd'

//角色管理
export default class Role extends Component {
    state = {
        role:[]
    }
    initColumn = () =>{
        this.colums = [
        {
            title:'角色名称',
            dataIndex:'name',
        },
        {
            title:'创建时间',
            dataIndex:'create_time',
        },
        {
            title:'授权时间',
            dataIndex:'auth_time',
        },
        {
            title:'授权人',
            dataIndex:'name',
        },
        ]
    }
    render(){
    const title=(
        <div>
            <Button type="primary" style={{marginRight:"15px"}}>创建角色</Button>
            <Button type='primary'>设置角色权限</Button>
        </div>
    )
        return (
           <Card title={title}>

           </Card>
        )
    }
}
