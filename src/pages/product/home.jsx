import React, { Component } from 'react';
import {Card,Select,Icon,Button,Table, Input,message} from 'antd'
import {PlusOutlined} from  '@ant-design/icons';
import {reqProductList,reqSearchProduct,reqUpdateProductStatus} from "../../api/"
import {PAGE_SIZE} from "../../utils/constant"
//product的默认子路由组件
export default class ProductHome extends Component {
  state = {
    total:0, //商品总数量
    loading:false, //是否正在加载
    //搜索关键字
    searchName:"",
    buttonStatus:"",
    //搜索类型，默认按名称搜索
    searchType:"productName",
    products:[],
    columns:[
      {
          title: '商品名称',
          dataIndex: 'name',
      },
      {
          title: '商品描述',
          dataIndex:'desc'
      },
      {
        title: '价格',
        width:100,
        dataIndex:'price',
        //指定了字段属性dataIndex，传的是对应的属性值，若没指定是整行的属性
        render:(price)=>'￥' + price
      },
      {
        //在售：2，下架：1，
        title: '状态',
        width:100,
        //修改状态需要传入全部信息，不能设置dataindex
        render:(products)=>{
          return (
            <div>
              <Button onClick={()=>this.updateProduct(products)} type="primary">{products.status===1?'下架':'上架'}</Button>
              <span>{products.status===1?'在售':'已下架'}</span>

            </div>
          )
        }
      },
      {
        title: '操作',
        width:100,
        //传入整个行商品的属性
        render:(product)=>{
          return(
            <div>
              <Button size='small' style={{marginBottom:"10px"}}
              // 通过push带参数传参status
              onClick={()=>this.props.history.push("/product/detail",{product})} 
              type="primary" ghost>
                详情
              </Button>
              <Button 
              onClick={()=>this.props.history.push("/product/addupdate",{product})} 
              size='small' type="primary" ghost>
                修改
              </Button>
            </div>
          )
        }
      },
  ]
  }
  //更新状态
  updateProduct = async (products)=>{
    console.log(products)
    const {_id,status} = products
    const statuschange = status === 1?2:1
    const result = await reqUpdateProductStatus(_id,statuschange)
    if (result.data.status === 0){
      console.log(result)
      message.success('修改成功');
      //重新获取列表
      this.getPruduct(this.pageNum)
    }
  }
  //获取商品列表
  getPruduct= async (pageNum)=>{
    //保存当前页的值，方便其他方法使用
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchName,searchType} = this.state
    console.log(searchName,searchType)
    let result =""
    //按名称搜索还是按描述搜索
    if(searchName){
      result = await reqSearchProduct(pageNum, PAGE_SIZE, searchName, searchType)
      console.log(result)
    }else{
      console.log(222)
      result = await reqProductList(pageNum,PAGE_SIZE)
    }
    this.setState({loading:false})
      if (result.data.status === 0){
        console.log(result)
        const {list,total} = result.data.data
        this.setState({
            products:list,
            total
        })}
  }
  getSearchData=()=>{
    console.log(this.getSelectId.current.focus)
  }

  componentDidMount=()=>{
    //初始化页面显示第一页的值
    this.getPruduct(1)
  }
  getSelectId=React.createRef()
  render() {
    const {products,columns,total,loading,searchName,searchType} = this.state
    const title = (
      <div>
        {/* 在浏览器react插件可直接看到state有没有变化 */}
       <Select  
       onChange={value=>this.setState({searchType:value})}
       name="selectv" ref={this.getSelectId} value={searchType}>
         <Select.Option value="productName">按名称搜索</Select.Option>
         <Select.Option value="productDesc">按描述搜索</Select.Option>
       </Select>
       <Input
       //注意获取select的value和input的方法不一样
       onChange={event=>this.setState({searchName:event.target.value})}
       placeholder="Basic usage" value={searchName} style={{width:150,margin:'0 15px'}}/>
       <Button onClick={()=>this.getPruduct(1)} type="primary">搜索</Button>
      </div>
    )
    const extra =(
      <Button type="primary" onClick={()=>this.props.history.push("/product/addupdate")} icon={<PlusOutlined />}>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra} >
        <Table  
        rowKey={'_id'}
        dataSource={products} 
        columns={columns}
        pagination={{
          total,
          defaultPageSize:PAGE_SIZE,
          // onChange:(pagenum) =>{this.getPruduct(pagenum)}
          onChange:this.getPruduct,
          //快速跳转
          showQuickJumper:true
          }}
          loading={loading}
          />
      </Card>
    )
  
  }
}