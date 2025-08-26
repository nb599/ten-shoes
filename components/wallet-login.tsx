"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
    okxwallet?: any
  }
}

type WalletType = "metamask" | "okx" | "other"

export function WalletLogin() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const connectWallet = async (walletType: WalletType) => {
    setIsConnecting(true)
    setConnectingWallet(walletType)
    setError("")

    try {
      let ethereum: any

      // 选择钱包提供者
      switch (walletType) {
        case "metamask":
          if (!window.ethereum) {
            throw new Error("请安装 MetaMask 钱包插件")
          }
          ethereum = window.ethereum
          break
        case "okx":
          if (!window.okxwallet && !window.ethereum) {
            throw new Error("请安装 OKX Wallet 钱包插件")
          }
          ethereum = window.okxwallet || window.ethereum
          break
        default:
          if (!window.ethereum) {
            throw new Error("请安装钱包插件")
          }
          ethereum = window.ethereum
      }

      // 请求连接钱包
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("未找到钱包账户")
      }

      const address = accounts[0]
      const message = `登录 天书 (Ten Shoes)\n\n地址: ${address}\n时间: ${new Date().toISOString().split("T")[0]}\n随机数: ${Math.random().toString(36).substring(7)}`

      // 请求签名
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, address],
      })

      // 发送到服务器验证
      const response = await fetch("/auth/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          signature,
          message,
          walletType: walletType === "metamask" ? "MetaMask" : walletType === "okx" ? "OKX Wallet" : "Web3 Wallet",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "登录失败")
      }

      // 登录成功，刷新页面
      router.refresh()
      window.location.href = "/"
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      if (err.code === 4001) {
        setError("用户取消了连接请求")
      } else if (err.code === -32002) {
        setError("钱包连接请求已在处理中，请检查钱包插件")
      } else {
        setError(err.message || "连接钱包失败")
      }
    } finally {
      setIsConnecting(false)
      setConnectingWallet(null)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => connectWallet("metamask")}
        disabled={isConnecting}
      >
        {isConnecting && connectingWallet === "metamask" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <div className="mr-2 h-4 w-4">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.05 8.54l-3.24-7.68a.75.75 0 00-1.38 0L14.19 8.54a.75.75 0 00.69 1.05h6.48a.75.75 0 00.69-1.05z" />
              <path d="M8.81 8.54L5.57.86a.75.75 0 00-1.38 0L.95 8.54a.75.75 0 00.69 1.05h6.48a.75.75 0 00.69-1.05z" />
              <path d="M15.75 12.75h-7.5a.75.75 0 00-.75.75v7.5c0 .41.34.75.75.75h7.5c.41 0 .75-.34.75-.75v-7.5c0-.41-.34-.75-.75-.75z" />
            </svg>
          </div>
        )}
        {isConnecting && connectingWallet === "metamask" ? "连接中..." : "使用 MetaMask 登录"}
      </Button>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => connectWallet("okx")}
        disabled={isConnecting}
      >
        {isConnecting && connectingWallet === "okx" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <div className="mr-2 h-4 w-4 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">OKX</span>
          </div>
        )}
        {isConnecting && connectingWallet === "okx" ? "连接中..." : "使用 OKX Wallet 登录"}
      </Button>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => connectWallet("other")}
        disabled={isConnecting}
      >
        {isConnecting && connectingWallet === "other" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <div className="mr-2 h-4 w-4">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        )}
        {isConnecting && connectingWallet === "other" ? "连接中..." : "使用其他钱包登录"}
      </Button>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}
    </div>
  )
}
