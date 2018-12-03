# GALLERY


## WEB 重构

- [x] 登陆注册md5加密

## WEB bonus

1. 图片合成使用ml5，机器学习方式合成图片 **BASED ON** [fast-style-transfer-deeplearnjs](https://github.com/reiinakano/fast-style-transfer-deeplearnjs)
2. 图片自动识别并添加标签，调用百度ai开放api端口


## Project setup

```
npm install
```

### Compiles and hot-reloads for frontend development

```
npm run frontend
```

### Compiles and hot-reloads for backend development

```
npm run backend
```

## Project structure


```
-src //前端源代码
    -api //api文件
    -asserts //静态文件（图片）
    -layout //主布局
    -router //路由
    -store //vuex状态管理
    -style //样式工具
    -util //工具文件
    -views //页面
    
-server //后端源代码
    -data //常量
    -models //ORM建表模块
    -routes //路由
    -util //工具
```