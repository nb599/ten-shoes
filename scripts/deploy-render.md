# Render 一键部署指南

## 🚀 一键部署（推荐）

点击下面的按钮一键部署到 Render：

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/huangchongfu/ten-shoes)

## 手动部署步骤

### 1. 创建 Render 账户
- 访问 [Render](https://render.com)
- 使用 GitHub 账号登录（免费）

### 2. 部署 Web Service
1. 点击 "New +" → "Web Service"
2. 选择 "Deploy an existing image from a registry"
3. 输入镜像：`patrickhulce/lhci-server:latest`
4. 配置服务：
   - **Name**: `ten-shoes-lhci`
   - **Region**: Oregon (US West)
   - **Instance Type**: Free
   - **Port**: 9001

### 3. 环境变量配置
在 Environment 部分添加：
\`\`\`
PORT=9001
LHCI_STORAGE__SQL_DATABASE_PATH=/data/db.sql
\`\`\`

### 4. 持久化存储
1. 在左侧菜单点击 "Disks"
2. 点击 "Add Disk"
3. 配置：
   - **Name**: `lhci-data`
   - **Mount Path**: `/data`
   - **Size**: 1GB (免费额度)

### 5. 部署
- 点击 "Create Web Service"
- 等待部署完成（通常 3-5 分钟）
- 获取生成的 URL（如：https://ten-shoes-lhci.onrender.com）

## 验证部署

1. 访问生成的 URL
2. 应该能看到 "Welcome to Lighthouse CI!" 界面
3. 需要使用命令行创建项目（界面上没有创建按钮）

## 创建项目（命令行方式）

在本地运行以下命令来创建项目：

\`\`\`bash
# 设置服务器地址
export LHCI_SERVER_URL=https://your-render-url.onrender.com

# 运行 wizard 创建项目
npx @lhci/cli wizard

# 按提示操作：
# 1. 选择 "new-project"  
# 2. 输入项目名称：ten-shoes
# 3. 输入服务器 URL（已设置的环境变量）
# 4. 保存显示的 Build Token 和 Admin Token
\`\`\`

或者直接使用 API 创建：

\`\`\`bash
# 创建项目
curl -X POST https://your-render-url.onrender.com/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "ten-shoes", "externalUrl": "https://github.com/huangchongfu/ten-shoes"}'

# 响应会返回 project token
\`\`\`

## GitHub Secrets 配置

在 GitHub 仓库 Settings → Secrets → Actions 中添加：
- `LHCI_SERVER_URL`: https://ten-shoes-lhci.onrender.com
- `LHCI_BUILD_TOKEN`: 从 LHCI 界面获取的 token

## 注意事项

- Render 免费版在无访问时会休眠，首次访问可能需要等待 30 秒启动
- 免费版每月有 750 小时限制，对个人项目足够
- 数据会持久化保存在磁盘中
