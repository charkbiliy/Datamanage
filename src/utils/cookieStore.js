//存储用户登录信息
import cookie from 'react-cookies'

//定义常量
const USERNAME = 'uname'
export default {
	saveUser(user){
		cookie.save(USERNAME, user)
	},
	//根据实际情况进行json转换，json.parse/json.stringfy
	getUser(){
		return cookie.load(USERNAME)
	},

	removeUser(){
		cookie.remove(USERNAME)
	}
}