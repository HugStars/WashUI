# CyanUI

技术栈：Vue3、Vite、VitePress

## 命令

```sh
# 安装依赖
npm install

# 启动开发服务
npm run serve

# 打包编译
npm run build

# UI框架打包编译
npm run build:ui

# 启动预览服务
npm run preview

# 启动文档服务
npm run serve:docs

# 打包文档
npm run build:docs

# 预览文档
npm run preview:docs

# 同时启动开发服务和文档服务
npm run serve_both
```

## 目录

```text
├─Cyan           UI框架源码目录
├─CyanUI         UI框架打包目录
├─docs           文档目录
│  └─.vitepress  文档配置目录
│      ├─dist    文档打包目录
│      ├─public  文档公共资源
│      └─theme   文档自定义主题
├─public         项目公共资源
└─src            项目代码目录
    ├─router     路由
    └─views      页面
```
