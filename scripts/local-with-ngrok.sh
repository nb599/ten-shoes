#!/bin/bash

# 本地 LHCI Server + ngrok 公网访问

echo "🚀 启动本地 LHCI Server + ngrok..."

# 检查 ngrok 是否安装
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok 未安装"
    echo "安装方法："
    echo "brew install ngrok"
    echo "或访问 https://ngrok.com/download"
    exit 1
fi

# 启动 Docker 服务
echo "📦 启动 LHCI Server..."
docker-compose -f docker-compose.lhci.yml up -d

# 等待服务启动
sleep 10

# 启动 ngrok 隧道
echo "🌐 创建公网隧道..."
ngrok http 9001 --log=stdout &
NGROK_PID=$!

# 等待 ngrok 启动
sleep 5

# 获取公网 URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

echo ""
echo "✅ 部署完成！"
echo "🌐 公网访问地址: $NGROK_URL"
echo "🏠 本地访问地址: http://localhost:9001"
echo ""
echo "📝 GitHub Secrets 配置："
echo "LHCI_SERVER_URL=$NGROK_URL"
echo ""
echo "🛑 停止服务："
echo "kill $NGROK_PID && docker-compose -f docker-compose.lhci.yml down"

# 保持运行
wait $NGROK_PID
