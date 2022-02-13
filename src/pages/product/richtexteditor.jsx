import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default class Richtexteditor extends Component {
    static propTypes = {
        detail:PropTypes.string
    }
  state = {
    editorState: EditorState.createEmpty(),
  }
  //加入constructor可用来初始化state参数，像富编辑器这种特殊的，文本需要进行转格式
  //打开页面设置默认文本就需要利用constructor来初始化state值，比较方便
  constructor(props){
      super(props)
      console.log(this.props)
      const html = this.props.detail
      console.log(html)
      if (html) { //如果html标签存在初始化默认内容
          const contentBlock = htmlToDraft(html)
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          const editorState = EditorState.createWithContent(contentState)
          console.log(editorState)
          this.state = {
            editorState
        }
      } else { //不存在默认内容则置空
        this.state = {
              editorState: EditorState.createEmpty()
          };
      }
    }
  //父组件通过ref获取getdatail方法
  getdetail=()=>{
    //返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  uploadImageCallBack =(file)=>{
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/v1/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片的url
          console.log(url)
          //注意以下正确resolve 传参写法
          resolve({data: {link: url}})
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
//   componentDidMount=()=>{
//       console.log(this.props)
//       if (this.props.detail){
        // this.setState({
        //     editorState:EditorState.createEmpty(this.props.detail)
        //   });
//       }
//   }
//   <textarea
//           disabled
//           value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
//     /> 
  render(){
    const { editorState } = this.state;
    return (
        <Editor
          editorState={editorState}
        //   wrapperClassName="demo-wrapper"
        //   editorClassName="demo-editor"
        editorStyle={{border:"1px solid black",minHeight:"200px",paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
          //图片上传小模块
          toolbar={{
            image:{uploadCallback:this.uploadImageCallBack,alt:{present:true,mandatory:true}},
          }}
        />
    );
  }
}