### 现阶段最大的问题

用threejs开发的动效有BUG！！！
参考成熟的落地方案，一丝一茧剥开揉碎，排查解决问题。

目前threejs使用的重大BUG已解决，3D动效没问题了；
后续还有繁复的交互细节要处理：

- [ ] 卡片添加头像调整布局
- [ ] award添加属性repeat用于判断是否允许重复抽奖
- [ ] 同时需要pool变量代替members用于存储当前可用于抽奖的人员
- [ ] 最后还是要考虑一下响应式布局，应对不同尺寸的设备
- [ ] 卡片有头像时如何布局
- [x] BUG排查，为什么重新抽奖的时候不显示中奖人员、获奖记录也为空
- [ ] 音乐在代码中的插入
- [ ] 整体的配色问题：背景、卡片、中奖的卡片、开奖有没有烟花特效；
- [ ] 整体的布局问题：奖项列表、标题、抽奖操作按钮、顶栏操作项
- [ ] 抽奖的状态交互可能还是有BUG，逻辑还有一小部分没捋顺
- [ ] 已开奖项需要增加重新抽取的入口，奖项配置列表里、首页奖项列表里都要有
- [ ] 操作说明页的内容编写

- [x] 动效切换的健壮性【基本解决，偶发还有问题，持续关注排查】
- [x] 操作性的限制：只允许缩放，不允许拖转
- [x] 开奖时屏幕要回正，这是个重要的用户体验点


### 设计细节

- i18n做成预设+可扩展的
- 不用router，改用状态显隐切换，防止组件频繁销毁创建消耗性能，尤其是多人3D动效
- 数据存入indexedDB
- 头像存储是个问题，url下载可能会跨域，base64又需要预先转换


### 待办

- [X] 人员、奖项、音乐这3类数据都应该存在 IndexedDB 中，那么就需要在根页面初始化时捞取数据，因为抽奖页面就需要用到
- [ ] 提供人员导入 Excel 模版下载
- [ ] 人员导入的操作是否要单独开一个 Worker 线程防止阻塞
- [X] 音乐配置列表添加一列播放试听功能
- [X] three.js纳入react的hook和store中管理水太深，还是抽出来独立，不然现阶段卡顿崩溃不可避免.
- [ ] i18n需要补齐，这是一个大工程.
- [ ] 考虑一下是否要添加皮肤切换.
- [ ] 感觉需要添加一个背景更换的功能.
- [ ] 边界问题处理，比如人员为空的时候主页面的操作权限，是不是可以在按钮disable的时候hover提示去添加成员.



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.setting.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 目录结构

```markdown
src/
├── assets/          # 静态资源（图片、Logo、年会背景音乐等）
├── components/      # 全局通用 UI 组件（按钮、弹窗、输入框等）
├── config/          # 全局静态配置文件（奖项级别定义、常量等）
├── db/              # 数据库模块（IndexedDB / Dexie.js 的初始化和封装）
├── hooks/           # 全局自定义 Hook（处理复杂逻辑，如 Excel 解析、3D 动画控制）
├── pages/           # 页面级组件（大屏抽奖页、后台配置页）
│   ├── config/      # 配置页专用的子组件和样式
│   └── lottery/     # 抽奖页专用的子组件（如 Three.js 画布组件）
├── store/           # Zustand 状态管理（Pinia 的亲兄弟）
├── utils/           # 工具函数（如 随机算法、日期格式化等）
├── App.tsx          # 根组件（处理显隐控场的障眼法）
├── index.css        # 全局样式（Reset 样式、全屏背景色等）
└── main.tsx         # 项目入口文件
```

### 🔤 核心命名规范（重点！老手都这么写）
在 React 圈子里，不同的文件类型有非常严格的命名潜规则。为了让你的 TypeScript 类型推导顺畅、WebStorm 自动补全精准，请死守下面这四条铁律：

1. 组件文件 ➡️ 统一使用大驼峰（PascalCase），后缀为 .tsx
   不管是页面组件还是小纽扣组件，只要这个文件返回了 HTML/JSX 标签，首字母必须大写。

  - 正例：index.tsx、UploadButton.tsx、WinnerWall.tsx
  - 反例：lotteryPage.js（首字母小写会跟普通函数混淆，React 会报错）

2. 普通逻辑/工具文件 ➡️ 统一使用小驼峰（camelCase）或下划线，后缀为 .ts
   如果这个文件纯粹是写 JS/TS 逻辑的，不包含任何标签，首字母小写。

  - 正例：excelParser.ts（解析Excel）、indexedDB.ts（数据库）
  - 反例：ExcelParser.tsx（里面又没有写标签，不需要用 .tsx 后缀）

3. Zustand Store 文件 ➡️ 统一使用 use 开头的小驼峰
   因为 Zustand 暴露出来的是一个 React Hook，所以按照官方规范，文件和变量都要以 use 开头，让人一眼看出这是个状态钩子。

  - 正例：lottery.ts、useUserStore.ts

4. 样式文件（CSS / LESS / SCSS） ➡️ 名字与组件完全对齐
   如果你为某个特定的组件写样式，样式文件名最好和组件一模一样，方便在 WebStorm 里高亮结对。

  - 正例：index.tsx 旁边配一个 LotteryPage.css

现代化推荐：如果你用 CSS Modules（Vite 天生支持），可以命名为 LotteryPage.module.css，防止全局样式冲突。
