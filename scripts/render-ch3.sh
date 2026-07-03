#!/usr/bin/env bash
# 批次輸出 Ch3 所有 composition 為 .mov，供 DaVinci Resolve 剪輯／錄音。
#   一般場景：ProRes 422 HQ。
#   透明 overlay（id 含 "Overlay"）：ProRes 4444＋png＋yuva444p10le，保留 alpha 透明通道，
#   否則透明區在輸出時會被壓成黑底。
set -uo pipefail

OUT_DIR="out/ch3"
mkdir -p "$OUT_DIR"

# 從 Root.tsx 取出全部 Ch3 composition ID（依出現順序）
IDS=$(grep -oE 'id="Ch3[^"]*"' src/Root.tsx | sed -E 's/id="([^"]*)"/\1/')

TOTAL=$(echo "$IDS" | wc -l | tr -d ' ')
echo "== 將輸出 $TOTAL 個 composition 到 $OUT_DIR （ProRes 422 HQ）=="

i=0
FAILED=()
for id in $IDS; do
  i=$((i + 1))
  echo ""
  echo "---- [$i/$TOTAL] $id ----"
  if [[ "$id" == *Overlay* ]]; then
    # 透明 overlay：需 4444＋png＋yuva444p10le 才能保留 alpha
    ARGS=(--codec=prores --prores-profile=4444 --image-format=png --pixel-format=yuva444p10le)
    echo "（透明 overlay → ProRes 4444＋alpha）"
  else
    ARGS=(--codec=prores --prores-profile=hq)
  fi
  if npx remotion render "$id" "$OUT_DIR/$id.mov" "${ARGS[@]}"; then
    echo "✓ $id 完成"
  else
    echo "✗ $id 失敗"
    FAILED+=("$id")
  fi
done

echo ""
echo "================ 輸出結束 ================"
ls -lh "$OUT_DIR"
if [ ${#FAILED[@]} -gt 0 ]; then
  echo "失敗清單：${FAILED[*]}"
  exit 1
fi
echo "全部 $TOTAL 個成功 🎉"
