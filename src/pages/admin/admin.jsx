import React, { Component } from 'react'
import { Redirect ,BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import cookieStore from "../../utils/cookieStore"
import { Layout } from 'antd';
import LeftNav from "../../components/left-nav"
import Header from "../../components/header"

import Home from "../home/home"
import Category from "../category/category"
import Bar from "../charts/bar"
import Line from "../charts/line"
import Pie from "../charts/pie"
import Product from "../product/product"
import Role from "../role/role"
import User from "../user/user"


const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    //退出登录
    // componentDidMount = async ()=>{
    //     // const loginif = cookieStore.getUser()
    //     // console.log(loginif)
    //     // if(!loginif){
    //     //     //return <Redirect to="/login" />
    //     //     this.props.history.replace("/login")
    //     // }
    // }
    render() {
       // 页面主动判断是否登录
        const loginif = cookieStore.getUser()
        console.log(loginif)
        if(!loginif){
            return <Redirect to="/login" />
            //this.props.history.replace("/login")
        }
        return (
                <Layout style={{minHeight:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header />
                        <Content style={{margin:20,backgroundColor:"#fff"}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect from='/' to="/home"/>
                        </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:"#cccc",}}>网页由瀚鲸科技技术团队支持</Footer>
                    </Layout>
                </Layout>
        )
    }
}
