---
-idtitle: uniCloud基础知识

postTime: 2023-6-26

categories:
  - 前端笔记

tags:
  - 微信小程序
  - 项目笔记
---

## 富文本设计

- `page` 中引入 editor 组件

```html
<editor
  v-model="artObj.content"
  class="myEdit"
  placeholder="写点什么吧~"
  show-img-size
  show-img-toolbar
  show-img-resize
  @ready="onEditReady"
  @focus="onFocus"
  @statuschange="onStatuschange"
></editor>
```

> 相关属性
> show-img-size：显示图片大小控件；
> show-img-toolbar：显示图片工具栏控件；
> show-img-resize：显示修改尺寸控件；

- 初始化

```javascript
 onEditReady() {//获取富文本控件
   uni.createSelectorQuery().in(this).select(".myEdit").fields({
    size: true,
    context: true
  }, res => {
    this.editorCtx = res.context
}).exec()
```

- 样式改变

```javascript
//修改状态标识，用于将工具栏按钮样式改变
checkStatus(name, detail, obj) {
  if (detail.hasOwnProperty(name)) {
    this[obj] = true
  } else {
    this[obj] = false
  }
},
//样式改变
onStatuschange(e) {
  let detail = e.detail
  this.checkStatus("header", detail, "headShow")
  this.checkStatus("bold", detail, "boldShow")
  this.checkStatus("italic", detail, "italicShow")
},
```

- 按钮样式修改和按钮事件处理

```javascript
//添加大标题
clickHead() {
  this.headShow = !this.headShow
  this.editorCtx.format("header", this.headShow ? 'H2' : false)
},
//加粗
clickBold() {
  this.boldShow = !this.boldShow
  this.editorCtx.format("bold")
},
//倾斜
clickItalic() {
  this.italicShow = !this.italicShow
  this.editorCtx.format("italic")
},
//添加分割线
clickDivider() {
  this.editorCtx.insertDivider()
},
//点击工具条确认
editOk() {
  this.toolShow = false
},
//添加图像
clickInsertImage() {
  uni.chooseImage({
    success: async (res) => {
      uni.showLoading({
        title: "上传中，请稍后",
        mark: true
      })
      for (let item of res.tempFiles) {
        let res = await uniCloud.uploadFile({
          filePath: item.path,
          cloudPath: item.name
        })
        this.editorCtx.insertImage({
          src: res.fileID
        })
      }
      uni.hideLoading()
    },
  })
},
//点击显示工具
onFocus() {
  this.toolShow = true
}
```

## 新增文章内容

- 配置 `schema`
- `page` 配置

```javascript
//连接数据库
addData() {
  db.collection("quanzi_article").add({
    ...this.artObj //解构出设计好的文章对象
  }).then(res => {
    // console.log(res)
    uni.hideLoading()
    uni.showToast({
      title: "发布成功"
    })
  })
}
```

```javascript
//点击按钮提交
onSubmit() {
  this.editorCtx.getContents({
    success: res => {
      this.artObj.description = res.text.slice(0, 80);
      this.artObj.content = res.html
      this.artObj.picurls = getImgSrc(res.html)
      uni.showLoading({
        title: "发布中..."
      })
      this.addData()
    }
  })
}
```

## 详情页

```javascript
//使用unicloud-db组件
/**
 getone：去掉传过来的数据的最外层数组包裹
 collection：连接数据库
    collections: [
      db.collection("quanzi_article").getTemp(),
      db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
    ]
  loading 用于监听数据是否加载完成，如果未处理 loading 会因为异步获取不到数据而导致报错

**/
<unicloud-db :where="`_id=='${artId}'`" v-slot:default="{data,loading,error,options}" :getone="true"
 :collection="collections">
 <view v-if="error">{{error.message}}</view>
 <view v-else-if="loading">
   <u-skeleton rows="8" title :loading="true"></u-skeleton>
 </view>
 <view v-else>
   <view class="title">{{data.title}}</view>
   <view class="userinfo">
     <view class="avatar">
       <image
         :src="data.user_id[0].avatar_file?data.user_id[0].avatar_file.url:'../../static/images/user-default.jpg'"
         mode="aspectFill"></image>
     </view>
     <view class="text">
       <view class="name">{{data.user_id[0].nickname?data.user_id[0].nickname:data.user_id[0].username}}</view>
       <view class="small"><uni-dateformat :date="data.publish_date" format="yyyy年MM月dd日"></uni-dateformat> ·
         {{data.province}}
       </view>
     </view>
   </view>
   <view class="content">
     <u-parse :content="data.content" :tagStyle="tagstyle"></u-parse>
   </view>
 </view>
</unicloud-db>
```

### 文章浏览

- 每次点击文章详情页的时候，文章的浏览量增加一
- 代码实现

```javascript
//创建云函数
const db = uniCloud.database()
const dbCmd = db.command
module.exports = {
  _before: function() {
    // 通用预处理器
  },
  /**
   * table 数据表
   * attr 属性
   * id 操作的id
   * num 1自增 -1自减
   **/
  async operation(table, attr, id, num) {
    let obj = {}
    obj[attr] = dbCmd.inc(num)
    return await db
      .collection(table)
      .doc(id)
      .update(obj)
  },
}
```

```javascript
//在page中引入
const db = uniCloud.database()
const utilsObj = uniCloud.importObject('utilsObj')
//修改阅读量
readUpdate() {
  utilsObj.operation("quanzi_article", "view_count", this.artId, 1).then(res => {
    console.log(res);
  })
}
//在onLoad中引入
```

### 点赞功能

- 点击详情页中的点赞按钮，显示高亮效果，并在后台增加文章的点赞次数，需要注意的是，点赞的时候需要获取当前用户 ID 和文章详情 ID，并且联合 article 表和 like 表，判断当前用户此前是否已经点赞，如果已经点赞则将文章的点赞次数减一，若在数据库表找不到用户 ID，说明用户此前没有点赞该文章，则记录该俩者 ID 并在数据库修改点赞次数。
- 代码实现
  - 创建 like 表，并将文章 ID 与 articl 表的\_id 联合
  - 处理点赞按钮事件

```Javascript
//点赞操作
async clickLike() {
  //需要同时筛选文章id和当前用户id
  let count = await db.collection("quanzi_like").where(
    `article_id == "${this.artId}" && user_id==$cloudEnv_uid`).count()
  if (count.result.total) {
    //原先已有点赞
    db.collection("quanzi_like").where(`article_id == "${this.artId}" && user_id==$cloudEnv_uid`).remove()
    //将文章表中的文章点赞次数减一
    utilsObj.operation("quanzi_article", "like_count", this.artId, -1)
  } else {
    //原先没有点赞
    db.collection("quanzi_like").add({
      article_id: this.artId
    })
    //将文章表中的文章点赞次数加一
    utilsObj.operation("quanzi_article", "like_count", this.artId, 1)
  }
}
```

---

项目链接：https://github.com/AprilEcho/uniCloud_community

---
