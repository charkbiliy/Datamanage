//更新分类
import React, { Component } from 'react'
import PropTypes from "prop-types"
import { withRouter } from 'react-router-dom'
import {
    Form,Select,Input
} from 'antd'
export default class Updateform extends Component {
    //指定传参对象格式要求
    state={
        inputval:"",

    }
    myform = React.createRef()
    static propTypes={
        categoryName:PropTypes.string.isRequired,
        getformdata:PropTypes.func.isRequired,
    }
    getform= async ()=>{
        console.log(this.myform.current)
        try{
             await this.myform.current.validateFields(['categoryName'])
        }catch(err){
            console.log(err)
            const errmsg = err
            const {categoryName} = this.myform.current.getFieldsValue()
            console.log(categoryName)
            this.props.getformdata({categoryName,errmsg})
            // if(err.errorFields.length){
            //     console.log("出错了")
            //     console.log(err.errorFields[0].errors[0])
            // }else{
            //     console.log("正确输入")
            //     console.log(err.errorFields)
            // }
        }
        //console.log(value)
    }
    render() {
        const validateMessages = {
            required: "分类名称必须填写哟",
            // ...
          };
        //console.log(this.props.categoryName)
        const {categoryName} =this.props
        return (
            <Form
            ref={this.myform}
            onValuesChange={this.getform}
            validateMessages={validateMessages}
            >
                <Form.Item label="分类名称" initialValue={categoryName} name="categoryName" rules={[{ required: true }]}>
                    <Input  placeholder="请输入分类名称"/>
                </Form.Item> 
            </Form>
        )
    }
}
