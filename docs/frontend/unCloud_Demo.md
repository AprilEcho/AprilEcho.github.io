---
-idtitle: uniCloud基础知识

postTime: 2023-6-26

categories:
  - 前端笔记

tags:
  - 微信小程序
  - 项目笔记
---

## 文章社区项目（uni-cloud）

### 富文本设计

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

### 新增文章内容

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

---

项目链接：https://github.com/AprilEcho/uniCloud_community

---
