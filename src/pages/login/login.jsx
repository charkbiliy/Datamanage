import React, { Component } from 'react'
import './login.less'
//import {Cookie} from "../../utils/cookieinfo" 
import cookieStore from "../../utils/cookieStore"
import logo from "../../assets/images/logo.png"
import { Redirect } from 'react-router-dom'
import axios from  "axios"
// import qs from 'qs';
import { Form, Input, Button, Checkbox } from 'antd';
// import cookie from 'react-cookies'
// import Password from 'antd/lib/input/Password';
import {reqLogin} from "../../api/index"
//登陆的路由
export default class Login extends Component {
    onFinish = async (values) => {
        console.log('Success:', values)
        const {username,password} = values
        try{
            const res = await reqLogin(username,password)
            console.log(res.data)
            const result = res.data
            if(result.status==1){
                console.log(cookieStore.getUser("hahah"))
                const user = result.username
                cookieStore.saveUser(user)
                cookieStore.getUser("hahah")
                this.props.history.replace('/')
            }
        }catch(error){
            console.log("数据异常",error.message)
        }
          
      };
    
    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    // componentDidMount=()=>{
    //     // const loginif = cookieStore.getUser()
    //     // console.log(loginif)
    //     // if(loginif){
    //     //     this.props.history.replace("/")
        
    //     //     // return <Redirect to="/" />
    //     // }
    // }
    render() {
        const loginif = cookieStore.getUser()
        console.log(loginif)
        if(loginif){
            return <Redirect from='/login' exact to="/"/>}
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>天气数据后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <div>
                        <Form
                            ref={c=>{this.formdata=c}}
                            className='login-form'
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="姓名"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                    {
                                        min: 4,
                                        message: '用户名最少4位',
                                    },
                                    {
                                        max: 12,
                                        message: '用户名最长12位',
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_]+$/,
                                        message: '用户名必须是由英文，数字或下划线组成',
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button className='login-button' type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}
