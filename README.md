# Publisher

基于kissy1.4.1的发布器组件

Demo: http://kissydemo.sinaapp.com/

## 快速使用

```javascript
	var publisher = new Publisher({
	    node : '#J_Test'
	});
```

## 配置

| 参数名称        | 类型           | 默认值  | 必填 | 备注|
| :------------- |:-------------| :-----|:------|:------|
| node      | String | null |    是   |  发布器的父节点 |
| maxLen      | Number | 1500 |    否   |  发布器最大字数 |
| placeholderText      | String | '请输入你的分享，1500字以内' |    否   |  发布器默认文字 |
| charType      | String | 'cn' |    否   |  字符计算方法，'cn'表示中文字符计算方法，'en'表示英文字符计算方法 |
| timeInterval      | Number | 30 |    否   |  两次发布间隔秒数 |
| url      | String | null |    是   |  发布器请求链接 |
| callback      | Function | null |    否   |  请求成功回调函数 |

也可以通过publisher.on('submit',function(){...})编写提交发布器后的逻辑

## 方法

| 方法名称        | 参数           | 备注|
| :------------- |:-------------| :-----|
| reset      | 无| 清空发布器 |
| val      | 无| 返回textarea当前值 |
| fontCount      | 无| 返回当前字数 |