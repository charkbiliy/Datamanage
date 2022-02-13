//添加新增分类
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import {
    Form,Select,Input
} from 'antd'
export default class Addform extends Component {
    myform = React.createRef()
    state={
        categroyname:"",
        parentId:""
    }
    static propTypes={
            getaddformdata:PropTypes.func.isRequired,
            categorys:PropTypes.array.isRequired, //一级分类数组
            parentId:PropTypes.string.isRequired,  //父分类parentid
    }
    // uploadformdata =(event)=>{
    //     const form = 
    //     console.log(this.myform.current.getFieldsValue())
    //     this.setState({
    //         categroyname:event.target.value
    //     },()=>{
    //         const {categroyname}  = this.state
    //         const {parentId} = this.props
    //         const addformdata = {categroyname,parentId}
    //         console.log(addformdata)
    //         this.props.getaddformdata(addformdata)
    //     })
    // }
    getform = async () => {
        //获取当前表单实例的所有的属性值，记得给item加name
        try {
            //验证有无输入，直接把错误信息传到父组件
            await this.myform.current.validateFields(['categoryName'])
        } catch (err) {
            console.log(err)
            const errmsg = err
            console.log(this.myform.current.getFieldsValue())
            const { parentId, categoryName } = this.myform.current.getFieldsValue()
            this.props.getaddformdata({ parentId, categoryName, errmsg })
        }
    }
    // componentDidMount= async ()=>{
    //     try {
    //         await this.myform.current.validateFields(['categoryName'])
    //     } catch (err) {
    //         console.log(err)
    //         const errmsg = err
    //         console.log(this.myform.current.getFieldsValue())
    //         const { parentId, categroyname } = this.myform.current.getFieldsValue()
    //         this.props.getaddformdata({ parentId, categroyname, errmsg })
    //     }
    // }

    render() { 
        const validateMessages = {
            required: "分类名称必须填写哟",
            // ...
          };
        const {categorys,parentId} = this.props
        console.log(parentId)
        return (
            <Form
            ref={this.myform}
            onValuesChange={this.getform}
            validateMessages={validateMessages}
            >
                <Form.Item name='parentId' initialValue={parentId} label="所属分类">
                    <Select>
                            <Select.Option value="0">一级分类</Select.Option>
                        {/* <Select.Option value="1">Demo</Select.Option>
                        <Select.Option value="2">Demo</Select.Option> */}
                        {
                            categorys.map(item=>{
                                return (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>  
                <Form.Item rules={[{ required: true }]} name="categoryName" label="分类名称">
                    <Input placeholder='请输入分类名称'/>
                </Form.Item> 
            </Form>
        )
    }
}
