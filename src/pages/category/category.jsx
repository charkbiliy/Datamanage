import React, { Component } from 'react'
import { Card,Table,Button,Icon,Modal} from 'antd';
import { PlusOutlined,RollbackOutlined } from '@ant-design/icons';
import {reqCategoryList,reqAddCategory,reqUpdateCategory} from "../../api/index"
import Addform from "./addform"
import Updateform from "./updateform"
//import  
//商品分类路由
export default class Category extends Component {
    state = {
        //一级分类
        loading:true,
        categorys:[],//一级分类列表
        subCategory:[],//二级分类列表
        parentId:"0", //当前需要显示的分类列表的一级列表
        parentName:"", //进入二级分类需要显示的父类名字
        pagenum:1,
        showstatus:0,//
        columns : [
            {
                title: '分类名称',
                dataIndex: 'name',
                key:"name"
            },
            {
                title: '操作',
                width:300,
                render: (cate) => (
                    <div>
                        <Button style={{marginRight:'15px'}} onClick={()=>this.showUpdatemodal(cate)} size="small" type="primary">修改分类</Button>
                        {this.state.parentId==='0' ? <Button onClick={()=>{this.getSubcategroyList(cate)}} size="small" type="primary">查看子分类</Button> : null}
                    </div>
                ),
            }
        ]
    }
    //显示二级列表，要接收一级分类的key
    getSubcategroyList=(cate)=>{
        console.log(cate)
        const {name,_id} = cate
        console.log(name,_id)
        //setstate是异步函数，回调函数会在状态更新且render()后执行
        this.setState({
            parentId:_id,
            parentName:name
        },()=>{
            this.getcatelist()
        })
    }
    //初始化table所有列的数组
    //获取一级/二级分类
    getcatelist = async (parentid) =>{
        this.setState({loading: true})
        //页面显示列表是根据state中的parentid来进行判断显示一级还是二级列表
        //这里传入的参数是如果在二级列表中添加一级类，
        //又不想更新二级列表当前页面也不会跳转，就传入一个参数给这个函数，来进行一级列表的更新
        const parentId = parentid || this.state.parentId
        console.log(parentId)
        const result = await reqCategoryList(parentId)
        if (result.data.status === 0){
            console.log(result)
            const categorys = result.data.data
            if (parentId === '0') {
                this.setState({
                    categorys,
                    loading: false
                })
            }else {
                this.setState({
                    subCategory:categorys,
                    loading: false,
                    pagenum:1,
                })
            }
        }
       
    }
    //返回一级列表
    BackTopfristca=()=>{
        this.setState({
            parentId:'0'
        })
    }
    //分页不知到啥原因二级只显示第二页，只能通过onchang解决，跳转前重置1
    changpage=(val)=>{
        console.log(val)
        this.setState({
            pagenum:val
        })
    }
    myRef = React.createRef()
    page
    //添加分类
    addCategory= async ()=>{
        const {parentId,categoryName,errmsg} = this.addformdata
        if (errmsg.errorFields.length) {
            console.log("出错了")
            console.log(errmsg.errorFields[0].errors[0])
        } else {
            console.log("正确输入")
            console.log(errmsg.errorFields)
            //隐藏确认框
            this.setState({
                showstatus: 0
            })
            console.log(parentId, categoryName)
            //点击确认时，获取到parrentId(0或者已有parentID)和新增类名
            const result = await reqAddCategory(categoryName, parentId)
            if (result.data.status === 0) {
                //如果在当前父类列表中修改需要重新渲染，如果改的不是当前类，不需要重新渲染当前的列表
                if (parentId === this.state.parentId) {
                    console.log(result.data.data)
                    //重新显示渲染列表
                    this.getcatelist()
                } else if (parentId === "0") {
                    this.getcatelist("0")
                }
            }
        }
    }
    //更新分类
    updateCategory = async () => {
        const { categoryName, errmsg } = this.newCategoryName
        // console.log(categoryName)
        // console.log(errmsg)
        if (errmsg.errorFields.length) {
            console.log("出错了")
            console.log(errmsg.errorFields[0].errors[0])
        } else {
            console.log("正确输入")
            console.log(errmsg.errorFields)
            //确认后隐藏显示框
            this.setState({
                showstatus: 0
            })
            // //点击修改分类时获取到的分类名信息
            const categoryId = this.cateid
            console.log(categoryId)
            console.log(categoryName)
            // //发送请求修改数据
            const result = await reqUpdateCategory(categoryId, categoryName)
            if (result.data.status === 0) {
                console.log(result.data.data)
                //重新显示渲染列表
                this.getcatelist()
            }
        }
    }
    handleCancel=()=>{
        this.setState({
            showstatus:0
        })
    }
    //两个确认框，通过修改showstatus来改变
    showAddmodal=()=>{
        this.setState({
            showstatus:1
        })
    }
    //每次打开修改，默认会显示当前点击的类名，通过传参解决
    showUpdatemodal=(cate)=>{
        console.log(cate)
        //获取点击类的id
        this.cateid = cate._id
        //获取点击的
        this.categoryName=cate.name
        this.setState({
            showstatus:2
        })
    }
    componentDidMount=()=>{
        this.getcatelist()
    }
    render() {
        const {categorys,subCategory,parentId,parentName,loading,columns,showstatus} = this.state
        //点击修改分类时才会传参，但是初次页面渲染由于在updateform中定义传参要求，不能传入参数会报错，所以定义一个初始值传入即可
        const categoryName =this.categoryName || "init"
        const leftTitle = parentId === '0'?"一级分类列表":(
            <span>
                <Button style={{marginRight:"20px"}} type="primary"  onClick={this.BackTopfristca} shape="round" icon={<RollbackOutlined />} size={'small'}>返回一级列表</Button>
                <span>{parentName}</span>
            </span>

            )
        const rightArea = (
            <Button type="primary" onClick={this.showAddmodal} icon={<PlusOutlined />} size='large'>
                添加
            </Button>
        )
        
        return (
                <Card title={leftTitle} extra={rightArea}>
                    {/* 表格依次是设置key，默认显示行数，可以快速跳转页签 */}
                   <Table dataSource={parentId==="0"?categorys:subCategory} loading={loading} rowKey={"_id"} pagination={{defaultPageSize:5,current:this.state.pagenum,onChange:this.changpage}} bordered columns={columns}/>
                   {/* <Table dataSource={parentId==="0"?categorys:subCategory} loading={loading} rowKey={"_id"} bordered columns={columns}>
                        <Pagination defaultPageSize='5' showQuickJumper='true' defaultCurrent='1' onChange={this.onPageNum}/>
                   </Table> */}
                <Modal title="添加分类" destroyOnClose='true' visible={showstatus===1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <Addform categorys={categorys} parentId={parentId} getaddformdata={(val)=>{this.addformdata = val}}/>
                </Modal>
                <Modal title="更新分类" destroyOnClose='true' visible={showstatus===2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <Updateform categoryName={categoryName} parentName={parentName} getformdata={(val)=>{this.newCategoryName = val}}/>
                </Modal>
                </Card>
                
        )
    }
}
