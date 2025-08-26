#!/bin/bash

# 天书博客 - Lighthouse CI 本地测试脚本

set -e

echo "🚀 天书博客 - Lighthouse CI 本地测试"
echo "=================================="

# 检查依赖
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js 和 npm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 构建应用
echo "🔨 构建应用..."
npm run build

# 设置环境变量
export AUTH_SECRET="${AUTH_SECRET:-lighthouse-ci-test-secret-key-32-chars}"
export DATABASE_URL="${DATABASE_URL:-}"

echo "📱 运行移动端测试..."
npm run lhci &
MOBILE_PID=$!

echo "🖥️ 运行桌面端测试..."
npm run lhci:desktop &
DESKTOP_PID=$!

# 等待测试完成
wait $MOBILE_PID
wait $DESKTOP_PID

echo "✅ 测试完成！"
echo ""
echo "📊 查看报告:"
echo "- 移动端: .lighthouseci/lhr-*.html"
echo "- 桌面端: .lighthouseci/lhr-*.html"
echo ""
echo "🌐 启动本地服务器查看报告:"
echo "npm run lighthouse:serve"
