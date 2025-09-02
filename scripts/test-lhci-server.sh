#!/bin/bash

# Lighthouse CI Server 本地测试脚本

echo "🚀 启动本地 LHCI Server..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 启动 LHCI Server
docker-compose -f docker-compose.lhci.yml up -d

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 5

# 检查服务器状态
if curl -s http://localhost:9001 > /dev/null; then
    echo "✅ LHCI Server 已启动在 http://localhost:9001"
else
    echo "❌ LHCI Server 启动失败"
    docker-compose -f docker-compose.lhci.yml logs
    exit 1
fi

echo ""
echo "📝 设置步骤："
echo "1. 访问 http://localhost:9001"
echo "2. 创建新项目 'ten-shoes'"
echo "3. 复制 Build Token"
echo ""
echo "🧪 测试命令："
echo "export LHCI_SERVER_URL=http://localhost:9001"
echo "export LHCI_BUILD_TOKEN=<your-build-token>"
echo "npm run build && npx lhci autorun --config=lighthouserc.desktop.js"
echo ""
echo "🛑 停止服务器："
echo "docker-compose -f docker-compose.lhci.yml down"