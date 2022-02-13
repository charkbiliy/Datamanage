import React, { Component } from 'react';
import { Upload,Modal,message } from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import {reqDeletePic} from "../../api"
//上传图片
export default class pictureswall extends Component {
    state = {
        previewVisible: false,  //是否显示大图预览，modal标签 
        index1:1,
        previewImage: '',
        previewTitle: '',
        fileList: [
          // {
          //   uid: '-4',  //每个file都有自己唯一的id，最好为负数
          //   name: 'image.png', //图片文件名
          //   status: 'done',  // 图片的状态
          //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          // }
          // {
          //   name: "image-1559402396338.jpg",
          //   status: "done",
          //   uid: -,
          //   url: "http://localhost:8888/images/image-1559402396338.jpg"
          // }
        ],
      };
    // uploadpic=()=>{
    //     return this.state.fileList.map(item=>{
    //         return (
              
    //         )
    //       })
    // }
    getBase64=(file)=>{
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
    /*
  获取所有已上传图片文件名的数组
   */
  //父组件通过ref获取getImgs方法
    getImgs  = () => {
      return this.state.fileList.map(file => file.name)
    }
    //隐藏modal
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview = async file => {
        //console.log.log(file)
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };
    
      handleChange = async ({file, fileList }) => {
        console.log(file)
        //console.log(fileList)
        //一旦上传成功，将上传的file的信息修正（name，url）
        if(file.status === 'done'){
            const result =  file.response
            if(result.status === 0){
                message.success("上传图片成功")
                const {name,url} = result.data
                //console.log(name,url)
                //传入的file与filelist当前最新文件，不是一一对应的需要手动更新file值
                file = fileList[fileList.length-1]
                //改名和
                file.name = name
                file.url = url
            }else{
                message.error("上传图片出错")
            }
        }else if(file.status === 'removed'){
            console.log("删除图片")
            const result = await reqDeletePic(file.name)
            if(result.status === 0){
                message.success("删除图片成功")
            }else{
                message.error("删除图片失败")
            }
        }


        //再操作（上传/删除）过程中更新filelist状态，不然不能显示已经上传的图片   
        this.setState({
            fileList
        })
      };
      //获取

  componentDidMount=()=>{
    //根据是添加商品还是修改商品界面，父组件会传来参数信息
    //如果是修改信息，imgs会存在每个商品的图片信息，由于是测试所以我只指定了一个专有图片
    console.log(this.props)
    //如果imgs存在，则是商品的修改界面，需要添加默认图片
    if (this.props.imgs){
      const {imgs} = this.props
      const imgList = imgs.map((item, index) => {
        return (
          {
            uid: -index-1,  //每个file都有自己唯一的id，最好为负数
            name: item, //图片文件名
            status: 'done',  // 图片的状态
            url: 'http://localhost:8888/images/' + item,
          }
        )
      })
      console.log(imgList)
      this.setState({
        fileList:imgList
      })
    }
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
    <div>
        <Upload
          action="/v1/manage/img/upload" //上传图片地址  
          accept='image/*'   //指定接收图片格式
          name='image' //请求参数名 
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </div>
    )
  }
}
