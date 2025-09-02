# Railway 部署步骤

## 自动部署（推荐）

点击下面的按钮一键部署：

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/Zhl2x9?referralCode=claude)

## 手动部署步骤

1. **登录 Railway**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from Docker Image"

3. **配置 Docker 镜像**
   - Image: `patrickhulce/lhci-server:latest`
   - 点击 "Deploy"

4. **配置环境变量**
   在 Variables 选项卡添加：
   \`\`\`
   PORT=9001
   LHCI_STORAGE__SQL_DATABASE_PATH=/data/db.sql
   \`\`\`

5. **添加持久化存储**
   - 在 Settings → Volumes
   - Mount path: `/data`
   - 点击 "Add Volume"

6. **生成域名**
   - 在 Settings → Networking
   - 点击 "Generate Domain"
   - 记录生成的 URL（如：https://your-app.up.railway.app）

## 创建 LHCI 项目

1. 访问你的 Railway 应用 URL
2. 点击 "Create new project"
3. 项目名称：`ten-shoes`
4. 创建后记录：
   - Build Token（用于上传报告）
   - Admin Token（可选，用于管理）

## 配置 GitHub Secrets

需要在 GitHub 仓库中添加以下 Secrets：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加：
   - Name: `LHCI_SERVER_URL`
   - Value: `https://your-app.up.railway.app`（你的 Railway URL）
4. 再次点击 "New repository secret"
5. 添加：
   - Name: `LHCI_BUILD_TOKEN`
   - Value: （从 LHCI Server 获取的 Build Token）

## 验证配置

1. 推送代码或创建 PR
2. 查看 GitHub Actions 运行日志
3. 访问 LHCI Server 查看报告是否上传成功

## 常见问题

**Q: Railway 需要付费吗？**
A: Railway 提供每月 $5 的免费额度，对于 LHCI Server 足够使用。

**Q: 如何查看 Railway 应用日志？**
A: 在 Railway 项目页面点击 "Logs" 选项卡。

**Q: 如何备份数据？**
A: Railway 的持久化卷会自动备份，也可以通过 Settings → Volumes 手动下载。
