# Lighthouse CI Server 部署指南

## 概述

Lighthouse CI Server 提供了历史报告存储和性能比较功能，可以追踪每次提交对网站性能的影响。

## 部署选项

### 选项 1: 使用免费云服务（推荐）

#### Railway (推荐)
1. 访问 [Railway](https://railway.app)
2. 使用 GitHub 登录
3. 创建新项目，选择 "Deploy a Docker Image"
4. 使用镜像：`patrickhulce/lhci-server:latest`
5. 设置环境变量：
   \`\`\`
   PORT=9001
   LHCI_STORAGE__SQL_DATABASE_PATH=/data/db.sql
   \`\`\`
6. 添加持久化卷：挂载 `/data` 目录
7. 获取部署 URL（如：`https://your-app.railway.app`）

#### Render
1. 访问 [Render](https://render.com)
2. 创建新的 Web Service
3. 使用 Docker 镜像：`patrickhulce/lhci-server:latest`
4. 设置环境变量和持久化磁盘

### 选项 2: 使用 VPS 自托管

\`\`\`bash
# 在服务器上运行
docker-compose -f docker-compose.lhci.yml up -d

# 配置 Nginx 反向代理
server {
    server_name lhci.yourdomain.com;
    location / {
        proxy_pass http://localhost:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

## 配置步骤

### 1. 创建 LHCI 项目

部署完成后，访问服务器 URL：
1. 点击 "Create new project"
2. 输入项目名称（如：ten-shoes）
3. 保存生成的项目 token 和 build token

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加：
- `LHCI_SERVER_URL`: 你的 LHCI 服务器 URL
- `LHCI_BUILD_TOKEN`: 从 LHCI 服务器获取的 build token

### 3. 更新配置文件

更新 `lighthouserc.desktop.js` 和 `lighthouserc.js`：

\`\`\`javascript
module.exports = {
  ci: {
    collect: {
      // ... 现有配置
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      token: process.env.LHCI_BUILD_TOKEN,
    },
    // ... 其他配置
  },
}
\`\`\`

### 4. 更新 GitHub Actions

在 `.github/workflows/lighthouse-simple.yml` 中添加环境变量：

\`\`\`yaml
- name: Run Lighthouse CI
  run: |
    npx lhci autorun --config=lighthouserc.desktop.js
  env:
    LHCI_SERVER_URL: ${{ secrets.LHCI_SERVER_URL }}
    LHCI_BUILD_TOKEN: ${{ secrets.LHCI_BUILD_TOKEN }}
    # ... 其他环境变量
\`\`\`

## 使用历史报告

1. **查看报告**: 访问 `https://your-lhci-server.com`
2. **比较提交**: 在项目页面选择两个构建进行比较
3. **性能趋势**: 查看性能指标随时间的变化图表
4. **PR 集成**: LHCI 会自动在 PR 中添加性能比较评论

## 高级功能

### 基准分支设置

在 lighthouserc 中配置基准分支：

\`\`\`javascript
ci: {
  assert: {
    preset: 'lighthouse:recommended',
    assertions: {
      'categories:performance': ['error', {minScore: 0.9}],
    },
  },
  upload: {
    target: 'lhci',
    serverBaseUrl: process.env.LHCI_SERVER_URL,
    token: process.env.LHCI_BUILD_TOKEN,
    basicAuth: {
      username: process.env.LHCI_USERNAME,
      password: process.env.LHCI_PASSWORD,
    },
  },
}
\`\`\`

### 自定义报告页面

可以创建自定义仪表板来展示关键指标：

\`\`\`javascript
// 使用 LHCI API 获取历史数据
const response = await fetch(`${LHCI_SERVER_URL}/v1/projects/${projectId}/builds`);
const builds = await response.json();
\`\`\`

## 故障排除

1. **连接错误**: 检查服务器 URL 和防火墙设置
2. **权限错误**: 确保 build token 正确
3. **存储问题**: 确保持久化卷正确配置

## 参考资源

- [Lighthouse CI 官方文档](https://github.com/GoogleChrome/lighthouse-ci)
- [Lighthouse CI Server API](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)
