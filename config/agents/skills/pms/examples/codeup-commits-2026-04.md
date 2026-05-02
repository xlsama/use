# 2026.04.01 - 2026.04.30 云效 Commit 汇总

## aigc-chatbot

- Merge #4 into develop from feature/chatbot_bug_fix-v1.2.0
- chore: 忽略 data/ 运行时缓存目录，避免污染 git 工作树
- feat: 语音转写接口新增 AAC（ADTS）格式支持，适配移动端音频流

## aigc-chatbot-web

- refactor: 回退侧边栏新建对话下拉菜单，恢复输入区「更多」上传入口并从工具菜单拆分
- refactor: 将上传文件并入消息输入区工具菜单，移除独立「更多」入口与 Google 云端硬盘
- docs: 添加 Starbucks PAPP SDK 接入文档

## aigc-platform-web

- chore: 全局接口查询卸载即清缓存，并关闭失败自动重试
- feat: add shadcn/ui
- feat: 业务域列表空状态与工具栏布局对齐全站规范
- feat: 新增业务域模块，修复 antd Menu 弃用警告与 Button ref 警告
- docs: prd
- refactor: 升级 React 到 v19，迁移 MobX 到 Zustand 并移除自动导入
- refactor: 重构 PromptProject 页面，支持文件夹管理、收藏筛选和日期范围
- feat: 业务域新增默认域保护与应用用户 Tab，抽离通用 FilterBar 筛选栏
- feat: 复制模板改为弹表单确认，支持先修改后再创建
- feat: 模型调用监控数字卡与迷你曲线按时间粒度联动
- fix: 修复 Combobox 弹出层搜索输入框右侧边框被遮挡的显示问题
- fix: 挂载 Toaster 以恢复表单保存等场景的全局提示
- fix: 重写下拉菜单实现，消除打开与关闭时的位置闪烁
- refactor: 优化对话框动画方案与复制按钮交互体验
- refactor: 消除 antd 5.29 废弃属性警告，切换至 destroyOnHidden 与 popupRender
- refactor: 统一 toast 方案到 sonner，修复 React 19 下登录提示不显示
- refactor: 统一业务域表单字段样式，并完善卡片菜单与分页等细节
- feat: 业务域授权管理接入真实接口，修正模型监控字段类型
- feat: 动态表单新增 switch 开关控件，并微调 MixSearch 新增过滤按钮间距
- feat: 新增业务域授权管理页，支持模型与 Prompt 文件夹绑定
- feat: 新增通用多选 Combobox 组件，并用于业务管理员 AD 选择
- feat: 通用动态表单支持 visibleOn 条件显隐，隐藏时自动清值
- fix: 修复 TitleHeader 在长内容页面被挤压，面包屑高度不一致的问题
- fix: 修复分时趋势图 brush 拖拽回弹，并完善授权页与调用监控的加载体验
- fix: 去除表格空数据时 placeholder 行下方多余的分隔线
- refactor: 业务域禁止新增文件夹，MixSearch 与 ADUGTemplate 按钮迁移至 shadcn
- refactor: 各表单统一使用通用多选 Combobox，消除内联重复实现
- refactor: 收紧 shadcn Table 默认行高，同步调整 Antd table padding 分层
- refactor: 模型中心页面迁移至 shadcn，沉淀 ListCard/BackButton/CopyButton 等通用组件
- refactor: 模型详情迁移至 shadcn Tabs，API 示例新增下载/复制，ListCard 抽出 Header/Icon/Tags 子组件
- refactor: 移除 i18next 基础设施，所有文案改为中文硬编码
- refactor: 移除动态表单末步"点击确定完成提交"提示及其 i18n 条目
- refactor: 表格 loading 改用极简骨架与顶部进度条，操作列右对齐
- style: 微调 Prompt 工程骨架屏颜色，侧栏变浅卡片变深，头像对齐真实尺寸
- style: 微调模型详情 Tabs 尺寸，强制高度生效并加宽按钮内边距
- style: 收紧 Antd 表格小尺寸行高，修正选择器特异性并压缩操作列按钮高度
- style: 精简 Prompt 工程卡片骨架屏，降低视觉密度增强空气感
- style: 调整业务域表格卡片样式，从阴影改用细边框
- feat: 业务管理员AD下拉项展示"姓名(AD账号)"便于识别用户
- feat: 新增 GPU 资源监控页面；筛选条改响应式栅格，维度表统一行高，业务域表单标签简化
- feat: 模型申请绑定业务域、审批历史展示业务域名称；修正应用账号详情业务域 ID 标签与字段顺序
- fix: 修正应用账号详情业务域 ID 标签，调整提示词字段顺序
- fix: 修复切换模型来源后标签名称列退化为输入框的问题
- fix: 修复新增模型对话框 retry_info 请求 URL 超长导致网关断连

## store-health-web

- Merge #27 into develop from 1.4.1
- Merge #28 into develop from 1.4.1
- chore: 升级项目依赖
- chore: 对齐 Vite+ 工程化配置(tsconfig 现代化、favicon、enum 改 as const)
- chore: 统一依赖版本范围为 caret，升级 recharts 与 @typescript/native-preview
- docs: add docs
- refactor: 对齐 Nuxt 原版的 SVT 状态、API 错误处理与持久化策略
- refactor: 将项目从 Nuxt 3 迁移到 Vite + React 技术栈
- refactor: 迁移至 vite-plus 框架，统一开发工具链配置
- update
- chore: 升级 lucide-react 到 1.14.0
- feat: P13M Trend 图例支持点击切换显隐并打磨骨架屏视觉
- feat: 用 Motion AnimatePresence 实现指标卡分页交叉滑动
- fix: 修复 resize 后神策埋点 RESOLUTION 字段不更新的问题
- fix: 修复指标树点击 checkbox 误触发整行展开收起的问题
- fix: 对齐首页 Monthly Insights 与合规差距高度并打磨视觉细节
- refactor: 打磨对比页与 SVT 页表格交互，统一展开箭头方向
- refactor: 统一接入 OverlayScrollbars 并打磨首页与弹窗视觉细节
- refactor: 重构首页指标卡，拆分合规差距并提取 TrendArrow
- style: P13M Trend 弹窗补齐 Y 轴绿色轴线并替换 ECharts 风格图例
- style: 三级指标列表限高展示 4 条并加粗 Monthly Insights 标题
- style: 修复首页指标卡 header 圆角缺口并打磨整页视觉细节
- style: 全局加大表格行高并对齐 shadcn 标准色变量
- style: 微调指标卡 header 分隔条颜色
- style: 打磨首页指标卡 vs 行对齐与三级指标行视觉细节
