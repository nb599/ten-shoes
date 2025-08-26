# 天书 (Ten Shoes) - GitHub 风格个人技术博客

功能
- 邮箱/密码注册与登录（自建 JWT Cookie Session）
- Google OAuth 登录
- 主流钱包插件登录（MetaMask、OKX Wallet 等）
- 文章页面（2 篇前端 AI 技术文章，Markdown 渲染）
- 登录用户可对文章进行评论和回复
- GitHub 风格导航与样式

项目名称：天书 (Ten Shoes)
专注前端与 AI 的工程化落地与最佳实践

环境变量
- DATABASE_URL: Neon Postgres 连接串
- AUTH_SECRET: 用于签发与校验 JWT 的密钥（至少 32 字节）
- GOOGLE_CLIENT_ID: Google OAuth 客户端 ID（可选）
- GOOGLE_CLIENT_SECRET: Google OAuth 客户端密钥（可选）
- GOOGLE_REDIRECT_URI: Google OAuth 回调地址（可选，默认自动生成）

初始化
1. 配置环境变量后，执行 SQL 脚本创建表，或运行 seed.ts 创建表并种子一个账号。
2. 部署到 Vercel 并在项目设置中添加环境变量与重部署。
3. 在 /admin 执行数据库初始化以添加 OAuth 字段。

钱包登录支持
- MetaMask
- OKX Wallet
- 其他支持 EIP-1193 标准的钱包插件

OAuth 配置
Google:
1. 在 Google Cloud Console 创建项目并启用 Google+ API
2. 创建 OAuth 2.0 客户端 ID
3. 添加授权重定向 URI: https://your-domain.com/auth/google/callback

## 🚀 Lighthouse CI 集成

本项目已集成完整的 Lighthouse CI 系统，包括：

- ✅ 自动化性能测试（移动端 + 桌面端）
- 📊 详细的性能报告
- 📈 Core Web Vitals 监控
- 💬 GitHub Actions 集成
- 🔗 构件下载支持

### 查看报告

推送代码后，可通过以下方式查看报告：

1. **GitHub Actions**: 进入 Actions 标签查看运行结果
2. **下载构件**: 下载 `lighthouse-results-mobile` 和 `lighthouse-results-desktop` 构件
3. **Job Summary**: 查看 GitHub Actions 的 Summary 页面

### 测试页面

- 🏠 首页
- 📄 AI 前端技术文章
- 📄 Agent UI 设计模式文章
- 🔐 登录页
- 📝 注册页

### 性能阈值

| 指标 | 移动端 | 桌面端 |
|------|--------|--------|
| 性能分数 | ≥70 | ≥80 |
| 可访问性 | ≥90 | ≥95 |
| 最佳实践 | ≥80 | ≥90 |
| SEO | ≥90 | ≥95 |

### 本地测试

\`\`\`bash
# 移动端测试
npm run lhci

# 桌面端测试
npm run lhci:desktop

# 快速测试
npm run lighthouse:test
\`\`\`

---

*最后更新: 2025-01-26*
