import React, { Component } from 'react'
import "./index.less"
import { withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import cookieStore from "../../utils/cookieStore"
import {reqWeather} from "../../api/index"
import {formatDate} from "../../utils/dataFormate"
import { CloudOutlined } from '@ant-design/icons';
import { Modal, Button} from 'antd';
import { ExclamationCircleOutlined,LoginOutlined} from '@ant-design/icons';
const { confirm } = Modal;
class Header extends Component {
    state={
        currentTime:formatDate(Date.now()),
        city:"",
        weather:""
    }
    logout=()=>{
        let that = this 
            confirm({
              title: '确定要退出吗?',
              icon: <ExclamationCircleOutlined />,
              content: '退出后数据将自动保存',
              onOk() {
                cookieStore.removeUser()
                that.props.history.replace("/login")
                // console.log('OK');
              }
            });
    }
    //第一次render后执行一次，一般执行异步操作或者启动定时器
    getTime=()=>{
        this.timer = setInterval(()=>{
            this.setState({
                currentTime:formatDate(Date.now())
            })
        },1000)
    }
    //find适合一层数组，多层不行
    //动态更改标题
    getTitle=()=>{
        let path = this.props.history.location.pathname
        //发现跳转到商品详情没有头部标题，是因为这里没有匹配到导致
        if(path.indexOf("/product")===0){
            path = "/product"
        }
       // path.indexOf(citem.key)===0
        let title=""
        menuList.forEach(item=>{
            if(item.key === path){
                title = item.title
            }else if(item.children){
                //在子item中查找
                const citem = item.children.find(citem=>citem.key===path)
                if(citem){
                title = citem.title
                }
            }
        })
        return title
    }
    getWeather = async ()=>{
        const {city,weather} = await reqWeather()
        this.setState({
            city,weather
        })
    }
    componentDidMount = ()=>{
        this.getTime()
        this.uname = cookieStore.getUser("hahah")
        this.getWeather()
    }

    //页面跳转时候需要卸载定时器或者ajax请求
    componentWillUnmount=()=>{
        clearInterval(this.timer)
    }
    render(){
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>{this.uname}</span>
                    <Button icon={<LoginOutlined />} size="small" onClick={this.logout} type="primary">退出</Button>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{this.state.currentTime}</span>
                        {/* <img src="" alt="" /> */}
                        <CloudOutlined />
                        <span>{this.state.city} {this.state.weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
