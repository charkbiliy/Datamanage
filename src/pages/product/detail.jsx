import React, { Component } from 'react';
import {Card,Select,Icon,
  Button,Table, Input,List} from 'antd'
import { ArrowLeftOutlined} from '@ant-design/icons';
import {reqCategoryName,reqUpdateProductStatus} from "../../api"
export default class ProductDetail extends Component {
  state = {
    cName1:"", //一级分类名
    cName2:""  //二级分类名
  }
  componentDidMount = async () => {
    console.log(this.props.location.state.product)
    const { categoryId, pCategoryId } = this.props.location.state.product
    //一级分类商品pCategoryId为0
    if (pCategoryId === '0') {
      const result = await reqCategoryName(categoryId)
      console.log(result.data.data.name)
      const cName1 = result.data.data.name
      this.setState({ cName1 })
    } else {
      // const result1 = await reqCategoryName(pCategoryId)
      // const result2 = await reqCategoryName(categoryId)
      //两个await请求，是按顺序请求，使用primiseall，全部返回结果后统一再赋值
      const results = await Promise.all([reqCategoryName(pCategoryId),reqCategoryName(categoryId)])
      console.log(results)
      const cName1 = results[0].data.data.name
      const cName2 = results[1].data.data.name
      this.setState({
        cName1, cName2
      })
    }

  }
  render() {
    const {name,desc,price,detail} = this.props.location.state.product
    const {cName1,cName2} = this.state
    const title = (
      <div>
        <ArrowLeftOutlined onClick={()=>this.props.history.goBack()} style={{marginRight:"15px",color:"#7cb421"}}/>
        <span style={{color:"#7cb421",fontSize:"16px"}} >商品详情</span>
      </div>
    )
    return(
      <Card title={title}>
        <List
          size="large"
          bordered
          className='product-detail'>
            <List.Item>
              <span className='left'>商品名称:</span>
              <span>{name}</span>
            </List.Item>
            <List.Item>
              <span className='left'>商品描述:</span>
              <span>{desc}</span>
            </List.Item>
            <List.Item>
              <span className='left'>商品价格:</span>
              <span>{price}</span>
            </List.Item>
            <List.Item>
              <span className='left'>所属分类:</span>
              <span>{cName1}{cName2?" --- "+cName2:''}</span>
            </List.Item>
            <List.Item>
              <span className='left'>商品图片:</span>
              <img
              className='product-img'
              src="	https://img.alicdn.com/imgextra/i2/111003577/O1CN015saDf61cIJOvQzDnC_!!0-saturn_solar.jpg_468x468q75.jpg_.webp" alt="" />
            </List.Item>
            <List.Item>
              <span className='left'>商品详情:</span>
              {/* 动态显示html标签页面值dangerouslySetInnerHTML */}   
              <span dangerouslySetInnerHTML={{__html:detail}}></span>
            </List.Item>
          </List>
      </Card>
    )
  }
}
