# Lighthouse CI 历史报告快速设置指南

## 第一步：部署 LHCI Server

### 选项 A：使用 Railway（最简单）

1. 点击此按钮一键部署：
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2FGoogleChrome%2Flighthouse-ci%2Ftree%2Fmain%2Fdocs%2Frecipes%2Fdocker-server)

2. 或手动部署：
   - 访问 [Railway](https://railway.app)
   - 创建新项目 → Deploy Docker Image
   - 镜像：`patrickhulce/lhci-server:latest`
   - 环境变量：
     \`\`\`
     PORT=9001
     LHCI_STORAGE__SQL_DATABASE_PATH=/data/db.sql
     \`\`\`
   - 添加卷：`/data`

3. 获取部署 URL（如：`https://your-app.railway.app`）

### 选项 B：本地测试

\`\`\`bash
# 启动本地 LHCI Server
docker-compose -f docker-compose.lhci.yml up -d

# 服务器将在 http://localhost:9001 运行
\`\`\`

## 第二步：创建项目

1. 访问你的 LHCI Server URL
2. 点击 "Create new project"
3. 输入项目名称：`ten-shoes`
4. 保存以下信息：
   - Project Token（查看项目用）
   - Build Token（上传报告用）

## 第三步：配置 GitHub Secrets

在 GitHub 仓库中：
1. 进入 Settings → Secrets and variables → Actions
2. 添加以下 secrets：
   - `LHCI_SERVER_URL`: 你的服务器 URL（如：`https://your-app.railway.app`）
   - `LHCI_BUILD_TOKEN`: 从 LHCI Server 获取的 Build Token
   - `LHCI_GITHUB_APP_TOKEN`: （可选）用于 PR 评论

## 第四步：测试配置

1. 推送代码到 main 分支或创建 PR
2. 查看 GitHub Actions 运行状态
3. 访问 LHCI Server 查看报告

## 功能说明

### 查看历史报告
- 访问：`https://your-lhci-server.com`
- 选择项目查看所有构建历史

### 性能比较
- 在项目页面选择两个构建
- 点击 "Compare" 查看详细对比

### PR 自动评论
如果配置了 `LHCI_GITHUB_APP_TOKEN`，LHCI 会在 PR 中自动添加性能对比评论。

## 故障排除

### 报告未上传
1. 检查 GitHub Actions 日志
2. 验证 secrets 是否正确设置
3. 确保服务器可访问

### 服务器连接失败
- 检查服务器 URL（不要有尾部斜杠）
- 确保服务器正在运行
- 检查防火墙设置

## 可选：不使用 LHCI Server

如果暂时不想部署服务器，系统会自动使用临时存储：
- 报告将上传到 Google 的临时存储
- 链接有效期为 7 天
- 无法查看历史趋势

## 更多信息

- [完整部署文档](./LIGHTHOUSE-CI-SERVER.md)
- [Lighthouse CI 官方文档](https://github.com/GoogleChrome/lighthouse-ci)
