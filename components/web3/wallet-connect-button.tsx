"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3-context"
import { Wallet, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

interface WalletConnectButtonProps {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function WalletConnectButton({ variant = "outline", size = "lg", className = "" }: WalletConnectButtonProps) {
  const { account, isConnected, isCorrectChain, isConnecting, connectWallet, switchToMonadTestnet, error } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && account) {
    if (!isCorrectChain) {
      return (
        <div className="space-y-2">
          <Button
            onClick={switchToMonadTestnet}
            variant="destructive"
            size={size}
            className={`font-display neon-border border-destructive bg-destructive/20 hover:bg-destructive/30 text-destructive hover:text-destructive-foreground transition-all duration-300 ${className}`}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Switch to Monad Testnet
          </Button>
          {error && (
            <Card className="p-3 bg-destructive/10 border-destructive/50 text-destructive text-sm">
              <p>{error}</p>
            </Card>
          )}
        </div>
      )
    }

    return (
      <Button
        variant="outline"
        size={size}
        className={`font-display neon-border border-secondary text-secondary hover:bg-secondary/20 transition-all duration-300 bg-transparent ${className}`}
        disabled
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        {formatAddress(account)}
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={connectWallet}
        variant={variant}
        size={size}
        disabled={isConnecting}
        className={`font-display neon-border border-secondary text-secondary hover:bg-secondary/20 transition-all duration-300 bg-transparent ${className}`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </>
        )}
      </Button>
      {error && (
        <Card className="p-3 bg-destructive/10 border-destructive/50 text-destructive text-sm max-w-sm">
          <p>{error}</p>
        </Card>
      )}
    </div>
  )
}
