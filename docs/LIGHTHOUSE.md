# Lighthouse CI 集成指南

## 概述

天书博客已集成 Lighthouse CI，用于自动化性能、可访问性、SEO 和最佳实践的监控。

## 配置说明

### 测试页面
- 🏠 首页 (`/`)
- 📄 AI 前端技术文章 (`/blog/ai-features-in-frontend`)
- 📄 Agent UI 设计模式文章 (`/blog/agent-ui-patterns`)
- 🔐 登录页 (`/login`)
- 📝 注册页 (`/register`)

### 测试环境
- **移动端**: 模拟 3G 网络，移动设备
- **桌面端**: 快速网络，桌面设备
- **运行次数**: 每个页面 3 次，取中位数

## 性能预算

### 移动端阈值
| 分类 | 最低分数 | 级别 |
|------|----------|------|
| 性能 | 70 | Warning |
| 可访问性 | 90 | Error |
| 最佳实践 | 80 | Warning |
| SEO | 90 | Error |

### 桌面端阈值
| 分类 | 最低分数 | 级别 |
|------|----------|------|
| 性能 | 80 | Warning |
| 可访问性 | 95 | Error |
| 最佳实践 | 90 | Warning |
| SEO | 95 | Error |

### Core Web Vitals

#### 移动端
- **FCP (First Contentful Paint)**: ≤ 2000ms
- **LCP (Largest Contentful Paint)**: ≤ 2500ms  
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **TBT (Total Blocking Time)**: ≤ 300ms

#### 桌面端
- **FCP**: ≤ 1200ms
- **LCP**: ≤ 1500ms
- **CLS**: ≤ 0.05  
- **TBT**: ≤ 150ms

## 本地运行

### 移动端测试
\`\`\`bash
npm run lhci
\`\`\`

### 桌面端测试  
\`\`\`bash
npm run lhci:desktop
\`\`\`

### 构建后测试
\`\`\`bash
npm run build
npm start
# 在另一个终端运行
npm run lhci
\`\`\`

## CI/CD 集成

Lighthouse CI 在以下情况自动运行：
- 推送到 `main` 或 `develop` 分支
- 提交 Pull Request 到 `main` 分支

### GitHub Actions 工作流
1. **lighthouse-mobile**: 移动端性能测试
2. **lighthouse-desktop**: 桌面端性能测试  
3. **performance-budget-check**: 性能预算检查和报告生成

### 环境变量
- `LHCI_GITHUB_APP_TOKEN`: Lighthouse CI GitHub App Token (可选)
- `AUTH_SECRET`: JWT 签名密钥
- `DATABASE_URL`: 数据库连接字符串 (可选)

## 结果查看

### GitHub Actions
- 在 Actions 页面查看详细日志
- 下载构件查看完整的 Lighthouse 报告
- 查看 Job Summary 获取性能概览

### 本地结果
结果保存在 `.lighthouseci/` 目录：
- HTML 报告: `.lighthouseci/lhr-*.html`  
- JSON 数据: `.lighthouseci/lhr-*.json`

## 优化建议

### 性能优化
- 使用 Next.js Image 组件优化图片
- 启用 gzip/brotli 压缩
- 实施代码分割和懒加载
- 优化字体加载策略

### 可访问性优化
- 为所有图片添加 alt 属性
- 确保足够的颜色对比度
- 为表单元素添加正确的标签
- 实施键盘导航支持

### SEO 优化
- 添加 meta 描述和标题
- 实施结构化数据
- 优化 URL 结构
- 添加 robots.txt 和 sitemap

## 故障排除

### 常见问题
1. **服务器启动超时**: 增加 `startServerReadyTimeout`
2. **预算超标**: 检查资源大小和数量
3. **可访问性失败**: 检查颜色对比度和 ARIA 属性

### 调试技巧
\`\`\`bash
# 详细输出
npx lhci autorun --verbose

# 单独运行收集步骤
npx lhci collect --numberOfRuns=1

# 查看配置
npx lhci healthcheck
