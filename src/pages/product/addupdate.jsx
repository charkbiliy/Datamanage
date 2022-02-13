import React, { Component } from 'react';
import {Card,
  Select,Icon,
  Button,
  Form, Input,
  message,Cascader,Upload,InputNumber} from 'antd'
import { ArrowLeftOutlined,PlusOutlined } from '@ant-design/icons';
import {reqCategoryList} from "../../api/"
import Pictureswall from './pictureswall';
import Richtexteditor from './richtexteditor';
import {reqUpdateOrAddProduct} from "../../api"
const { TextArea } = Input;
//product的添加和更新
export default class ProductAddUpdate extends Component {
  state={
    options: [],
    childOptions:[],
    showTitle:""
  }
  //设置ref获取表单整体信息
  myform=React.createRef()
  //可直接通过ref获取上传图片模块的信息，上传组件模块是表单的子组件，这种方法获取比较直接简单
  //在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
  mypic = React.createRef()
  mytext = React.createRef()
  //提交表单
  onFinish = async () => {
    //1.收集所有数据封装成product对象
    //添加和更新已有商品的信息区别是是否需要商品_id,cate是一个级联数组长度不定
    const {name,desc,price,cate} = this.myform.current.getFieldsValue()
    let pCategoryId,categoryId
    if(cate.length===1){
      pCategoryId = '0'
      categoryId =cate[0]
    }else{
      pCategoryId = cate[0]
      categoryId =cate[1]
    }

    const imgs = this.mypic.current.getImgs()
    const detail = this.mytext.current.getdetail()
    const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
    if(this.update){
      product._id = this.product.product._id
      console.log(product)
    }
    console.log(product)
    //2.调用接口请求更新/添加数据
    const result = await reqUpdateOrAddProduct(product)

    //3.根据结果显示
    if(result.data.status === 0){
      message.success(`${this.update?'更新':'添加'}商品成功`)
     // this.props.history.goBack()
    }else{
      message.error(`${this.update?'更新':'添加'}商品出错`)
    }
  }
  //用来加载下一级列表的回调函数
  loadData = async selectedOptions => {
    //得到选的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    //this.getCategory()
    // console.log(targetOption)
    // isLeaf: false
    // label: "纸张2"
    // loading: false
    // value: "5e1346c83ed02518b4db0cd9"
     const subcategory = await this.getCategory(targetOption.value)
     //二级列表存在且数组长度大于0
     targetOption.loading = false;
    if (subcategory && subcategory.length > 0) {
      const childOptions = subcategory.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      //关联到当前父option上
      targetOption.children=childOptions
    } else {
      //当前一级分类的二级列表无内容(为叶子时候，点击才能显示到输入框)
      targetOption.isLeaf = true
    }
    // load options lazily
    // setTimeout(() => {
    //   targetOption.loading = false;
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: 'dynamic1',
    //       //是否还由下一级进行选择，false有，true为最后节点
    //       isLeaf: true
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: 'dynamic2',
    //       isLeaf: true
    //     },
    //   ];
      //因为要更新一级列表部分的状态，而不是重新给与一整个新数组，所以推荐一下写法来更新一级列表数组
      this.setState({
        options: [...this.state.options]
      })
    //   //setOptions([...options]);
    // }, 1000);
  }
  //获取分类列表（一级或二级）
  getCategory = async(parentId)=>{
    const result = await reqCategoryList(parentId)
    if (result.data.status === 0){
      // console.log(result)
      const categorys = result.data.data
      //判断一级还是二级分类
      if(parentId === '0'){
        this.initOptions(categorys)
      }else{
        //返回二级列表，async函数返回值还是一个promise对象
        return categorys
      }
      
    }
  }
  initOptions = async (categorys)=>{
    //根据接收的数组生成option数组,传给专门的antd组件
    const options = categorys.map(c=>({
      value:c._id,
      label:c.name,
      isLeaf:false   
    })) 
    //如果是一个二级分类商品的更新
    const {update,product} = this
    // console.log(product)
    //若没有product信息说明点的是添加商品，有才可能需要进行二级列表显示
    if(product){
      const {name,desc,price,pCategoryId,categoryId} = product.product
      //console.log(pCategoryId)
      // console.log(imgs)
      // this.imgs = imgs
      //是否需要显示二级列表
      if(update && pCategoryId!=='0'){
        //要获取二级商品列表
        const subcategory = await this.getCategory(pCategoryId)
       // console.log(subcategory)
        const childOptions = subcategory.map(c=>({
          value:c._id,
          label:c.name,
          isLeaf:true   
        }))
        //找到当前二级商品分类对应的一级option对象
        const targetOption = options.find( option => option.value === pCategoryId)
        //关联子选项到父选项上
        targetOption.children = childOptions
        //更新表单内容
        this.myform.current.setFieldsValue({
          name,
          desc,
          price,
          cate:[pCategoryId,categoryId]
        })
      }else{
        //是一级分类，只需要加载一节列表
        this.myform.current.setFieldsValue({
          name,
          desc,
          price,
          cate:[categoryId]
        })
      }
    }
    //更新option状态
    this.setState({
      options
    })
  }

  componentDidMount=()=>{
     //初始化，第一次获取分类列表肯定全是一级分类
    this.getCategory('0')
    // console.log(this.myform.current)
    // console.log(this.props.location.state)
    //保存一个是否更新标识，修改商品和添加商品都会跳转到该页，需要判断是添加商品还是更新商品
    //!!为强制转换布尔值，判断props中的state是否存在，添加商品没值，修改有值
    // console.log(this.update)
    // console.log(product)
    // form表单 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新，
    //需要使用setFieldsValue对需要修改数据的地方进行更新
    this.setState({
      showTitle:this.update?"修改商品":"添加商品"
    })
  }
  render() {
    //收取前端页面点击信息，看是否有传product信息
    const product = this.props.location.state
    //确认是否点击的是添加商品
    this.update = !! product
    //有商品信息则传入全局的参数后面方法进行调用
    this.product = product ||""
    console.log(this.product)
    const {imgs,detail} = this.product?this.product.product:[]
    const {showTitle} = this.state
    //console.log(product.name)
    const title = (
      <div>
        <ArrowLeftOutlined onClick={()=>this.props.history.goBack()} style={{marginRight:"15px",color:"#7cb421"}}/>
        <span style={{color:"#7cb421",fontSize:"16px"}} >
         {showTitle}
        </span>
      </div>
    )
    const validateMessages = {
      required: '${label}必须填写哟!',
      // types:{
      //   number:'${label} 不是有效范围哦!',
      // },
      // number: {
      //   range:'${label}不能低于${min}',
      // }
    };
    //表单列宽
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 12,
      },
    };
    //级联列表传入数组格式
    // const optionLists = [
    //   {
    //     value: 'zhejiang',
    //     label: 'Zhejiang',
    //     isLeaf: false,
    //   },
    //   {
    //     value: 'jiangsu',
    //     label: 'Jiangsu',
    //     isLeaf: false,
    //   },
    // ];
    return (
      <Card title={title}>
        <Form ref={this.myform} {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
          <Form.Item name='name' label="商品名称" rules={[{ required: true }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item rules={[{ required: true }]}  name="desc" label="商品描述">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入商品描述" />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[
              // {
              //   type: 'number',
              //   min: 0,
              //   max:999
              // },{
              {
                type: 'number',
                min: 0,
                message:"价格不不能低于0"
              },{
                type: 'number',
                max: 888888,
                message:"价格不能高于1000000"
              }
            ]}
            label="商品价格">
               <InputNumber addonAfter="￥" placeholder="请输入商品价格" />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} name="cate" label="商品分类"> 
            <Cascader options={this.state.options} loadData={this.loadData} changeOnSelect />
          </Form.Item>
          <Form.Item name="pic" label="商品图片">
            {/* 表单提交不能直接读子组件图片数据 */}
            <Pictureswall ref={this.mypic} imgs={imgs}/>
          </Form.Item>
          <Form.Item name="eiditor" label="商品详情"  
          labelCol={{span: 3}}
          wrapperCol={{ span: 20}}>
             <Richtexteditor detail={detail} ref={this.mytext}/>
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}
