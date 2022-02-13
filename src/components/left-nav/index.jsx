import React, { Component } from 'react'
import "./index.less"
import logo from "../../assets/images/logo2.png"
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import cookieStore from "../../utils/cookieStore"
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  Home,appstore,bars,tool,user,safety,areaChart,barChart,lineChart,pieChart
} from '@ant-design/icons';
import menuList from "../../config/menuConfig"
const { SubMenu } = Menu;
class LeftNav extends Component {
    state = {
        collapsed: false,
        openkey:""
      };
      toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };
      //map,react内部的jsx机制允许，返回一个标签数组然后西渲染页面
      getMenuNodes_map=(list)=>{
       return list.map((item) => {
            //如果有子节点，循环子菜单
            if (item.children) {
                return (
                    <SubMenu key={item.key} icon={item.icon} title="商品">
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>)
            } else {
                //没有子菜单则循环一级菜单
                return (
                    <Menu.Item key={item.key} icon={item.icon} >
                        <Link to={item.key}><span>{item.title}</span></Link>
                    </Menu.Item>
                )
            }
        })
      }
      //reduce
      getMenuNodes=(list)=>{
        const path = this.props.location.pathname
        //console.log(path)
          //第二个参数是初始值，第一个参数里pre累加值，item表示当前值
          return list.reduce((pre,item)=>{
              //向pre里添加menu.item,
              if(!item.children){
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon} >
                        <Link to={item.key}><span>{item.title}</span></Link>
                    </Menu.Item>
                ))
              }else{
                // const citem = item.children.find(citem =>citem.key === path)
                //查找一个与当前请求路径匹配的子item（刷新测试看是否刷新后还是展开状态）
                //indexof用来确认只要是父路由路径开头的页面路径，打开状态不会丢失比如：'/product'和'/product/detail'
                const citem = item.children.find(citem =>path.indexOf(citem.key)===0)
                //如果存在，说明当前item的子列表需要展开
                console.log(citem)
                if(citem){
                    this.openkey = item.key
                    console.log(this.openkey)
                }
                pre.push((
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                ))
              }
              return pre
          },[])
      }
    //   componentWillMount=()=>{
    //     this.menunodes = this.getMenuNodes(menuList)
    //   }
    changesub=(key)=>{
            console.log(key)
            this.setState({
                openkey:key
            })
        }
    componentDidMount=()=>{
        //this.menunodes = this.getMenuNodes(menuList)
        let path = this.props.history.location.pathname
        //openkey是在页面渲染后所获得的与当前路由页面路径匹配的二级菜单的标题key，products或者charts，
        //然后通过setstate修改openkey的值
        let openkey = this.openkey
        console.log(openkey)
        this.setState({
            openkey:[openkey]
        })
      }
    render() {
        //当前页面路由位置
        let path = this.props.history.location.pathname
        //用来确认'/product'和'/product/detail'，都能是选中菜单栏状态保持不变，indexof指定字符串某一个区域
        //如果以/product开头则下标必为0
        if(path.indexOf("/product")===0){
            path = "/product"
        }
        console.log(path)
        return (
            <div className='left-nav'>
                <header className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>瀚鲸</h1>
                </header>
                <div className='left-nav-menu' style={{ width: '100%', }}>
                    {/* 根据当前路由界面自动选中菜单项动态更新，selectedKeys，传入值为数组
                        defaultOpenKeys自动打开哪个二级菜单 
                    */}
                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[path]}
                        openKeys={this.state.openkey}
                        onOpenChange={this.changesub}
                    >
                        {this.getMenuNodes(menuList)}
                        {/* {this.menunodes} */}
                    </Menu>
                </div>
            </div>
        )
    }
}
//withrouter,包装非路由组件，返回一个新的组件
export default withRouter(LeftNav)
