---
title: uniCloud基础知识
postTime: 2022-05-06
categories:
  - 前端笔记
tags:
  - 微信小程序
---

## uniCloud 云函数和云对象

### 创建方法

- 点击项目文件下的 `uniCloud`文件夹选择 `cloudfunctions`文件夹，新建 `云函数和云对象`

### 云函数

**创建一个云函数**

```javascript
'use strict'
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)
  //返回数据给客户端
  return event
}
```

**在 page methods 下调用该云函数**

```javascript
uniCloud
  .callFunction({
    name: 'art_get_all', //云函数名称
    data: {}, //传递的参数
  })
  .then((res) => {}) //成功的回调
```

### 云对象

**创建一个云对象**

```javascript
module.exports = {
  _before: function() {
    // 通用预处理器
  },
  async get(num) {
    //传递一个参数
    return await db
      .collection('article')
      .limit(num) //返回多少条数据
      .get()
  },
  add: async () => {
    await db.collection('article').add({
      title: '测试标题',
      content: '测试内容',
    })
  },
}
```

**在 page 下调用该云对象**

```javascript
//全局导入
const db = uniCloud.database()
//methods调用云对象
getData() {
 db.collection("article").get().then(res => {
   console.log(res)
  })
}
```

> 此时控制台会报错，还需要在 database 中下载所有 DB Schema,并修改对应的 json

```javascript
"permission": {
  "read": true,//将false修改为true，后续需要根据uid进行修改
  "create": false,
  "update": false,
  "delete": false
},
```

## Schema 学习

### 字段类型

```javascript
"properties": {
  "_id": {
   "description": "ID，系统自动生成"
  },
  //自定义字段
  "title": {
    "bsonType": "string",//类型
    "title": "文章标题",//标题
    "description": "文章的标题",//描述
    "errorMessage": "标题必须填写"//错误描述,用于必填项
  },
  "posttime": {
    "bsonType": "timestamp",
    "title": "发布时间",
    "description": "发布的时间",
    "defaultValue": {
    "$env": "now"//时间戳
    }
  }
}
```

## JQL 语法

### 联表查询

- 在 schema 中配置 id

```json
"userid":{
  "foreignKey":"uni-id-users._id"
}
```

- 关联主表和副表

```javascript
let artTemp = db.collection("cloudDemo).field("title,content,userid").getTemp()
let userTemp = db.collection("uni-id-users).field("_id,username,avatar_file,nickname").getTemp();
db.collection(artTemp,userTemp).get().then(res=>{
  console.log(res)
})
```
