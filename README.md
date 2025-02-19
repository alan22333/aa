# 旅行费用分摊应用 (Travel Expense Splitter)

一个具有赛博朋克风格的旅行团队费用分摊应用，帮助团队成员轻松管理和计算旅行期间的共同支出。

![](https://pic1.imgdb.cn/item/67b185e1d0e0a243d4ffc511.png)

## 功能特点

### 1. 旅行管理
- 创建新的旅行团队
- 设置旅行起止日期
- 查看所有旅行列表
- 删除旅行记录

### 2. 成员管理
- 添加团队成员
- 查看成员列表
- 为每个成员分配费用份额

### 3. 费用管理
- 添加新的费用记录
- 编辑现有费用
- 删除费用记录
- 查看费用详情
- 选择费用支付者
- 选择费用分摊成员

### 4. 费用统计
- 自动计算每个成员的支付总额
- 计算每个成员应付金额
- 生成最优结算方案
- 显示成员间转账建议

### 5. 界面特色
- 赛博朋克像素风格设计
- 响应式布局，支持移动端
- 直观的用户界面
- 实时更新的费用计算

## 技术栈

- **前端框架**: Next.js 15
- **样式**: Tailwind CSS
- **数据库**: MongoDB
- **ORM**: Prisma
- **字体**: Google Fonts (Press Start 2P, VT323)

## 本地开发

1. 克隆项目
```bash
git clone [repository-url]
cd travel-expense-splitter
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件并添加以下配置：
```
DATABASE_URL="你的MongoDB连接URL"
```

4. 初始化数据库
```bash
npx prisma generate
npx prisma db push
```

5. 启动开发服务器
```bash
npm run dev
```

6. 访问应用
打开浏览器访问 `http://localhost:3000`

## 部署

本项目可以使用 Vercel 进行部署：

1. 在 Vercel 上导入项目
2. 配置环境变量
3. 部署应用

## 使用说明

### 创建新旅行
1. 在首页点击 "CREATE TRIP"
2. 输入旅行名称和日期
3. 点击创建按钮

### 添加成员
1. 进入旅行详情页
2. 在 "ADD MEMBER" 区域输入成员名称
3. 点击添加按钮

### 记录费用
1. 在 "ADD EXPENSE" 区域填写费用信息：
   - 描述
   - 金额
   - 日期
   - 支付者
   - 参与成员
2. 点击添加按钮

### 查看结算
1. 在 "SETTLEMENT" 区域查看：
   - 每个成员的支付总额
   - 应付金额
   - 建议的转账方案

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

