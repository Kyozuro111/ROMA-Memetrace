"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import type { ContractSecurity, LiquidityLock, Chain } from "@/lib/crypto-api"
import { scanContractSecurity, checkLiquidityLock } from "@/lib/crypto-api"

interface SecurityScanProps {
  tokenAddress: string
  chain: Chain
}

export function SecurityScan({ tokenAddress, chain }: SecurityScanProps) {
  const [security, setSecurity] = useState<ContractSecurity | null>(null)
  const [liquidity, setLiquidity] = useState<LiquidityLock | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([scanContractSecurity(tokenAddress, chain), checkLiquidityLock(tokenAddress, chain)])
      .then(([sec, liq]) => {
        setSecurity(sec)
        setLiquidity(liq)
      })
      .finally(() => setLoading(false))
  }, [tokenAddress, chain])

  if (loading) {
    return (
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
          </div>
        </div>
      </Card>
    )
  }

  if (!security || !liquidity) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 50) return "text-warning"
    return "text-destructive"
  }

  return (
    <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm glow-purple">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Analysis
          </h3>
          <div className={`text-2xl font-bold ${getScoreColor(security.securityScore)}`}>
            {security.securityScore}/100
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              {security.isHoneypot ? (
                <XCircle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
              <span>Honeypot Check</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {security.ownershipRenounced ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <XCircle className="w-4 h-4 text-warning" />
              )}
              <span>Ownership</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {!security.canMint ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <XCircle className="w-4 h-4 text-warning" />
              )}
              <span>Mint Function</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {!security.hasHiddenFees ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <span>Hidden Fees</span>
            </div>
          </div>

          {security.risks.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Security Risks
              </p>
              {security.risks.map((risk, i) => (
                <div key={i} className="text-xs text-muted-foreground pl-5">
                  • {risk}
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Liquidity Lock</span>
              <div className="flex items-center gap-2">
                <Badge variant={liquidity.isLocked ? "default" : "destructive"}>
                  {liquidity.isLocked ? "Locked" : "Not Locked"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {liquidity.confidence}
                </Badge>
              </div>
            </div>
            {liquidity.isLocked && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Locked Amount</span>
                  <span className="font-mono">${liquidity.lockedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Percentage</span>
                  <span className="font-mono">{liquidity.lockedPercentage.toFixed(1)}%</span>
                </div>
                {liquidity.unlockDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unlock Date</span>
                    <span className="font-mono">{new Date(liquidity.unlockDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-1">Data source: {liquidity.dataSource}</div>
              </div>
            )}
            {!liquidity.isLocked && (
              <div className="text-xs text-muted-foreground">
                Unable to verify lock status. Data source: {liquidity.dataSource}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
