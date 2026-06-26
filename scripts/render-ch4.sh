#!/usr/bin/env bash
# 批次輸出 Ch4 所有 composition 為 ProRes 422 HQ（.mov），供 DaVinci Resolve 剪輯／錄音。
set -uo pipefail

OUT_DIR="out/ch4"
mkdir -p "$OUT_DIR"

# 從 Root.tsx 取出全部 Ch4 composition ID（依出現順序）
IDS=$(grep -oE 'id="Ch4[^"]*"' src/Root.tsx | sed -E 's/id="([^"]*)"/\1/')

TOTAL=$(echo "$IDS" | wc -l | tr -d ' ')
echo "== 將輸出 $TOTAL 個 composition 到 $OUT_DIR （ProRes 422 HQ）=="

i=0
FAILED=()
for id in $IDS; do
  i=$((i + 1))
  echo ""
  echo "---- [$i/$TOTAL] $id ----"
  if npx remotion render "$id" "$OUT_DIR/$id.mov" \
       --codec=prores --prores-profile=hq; then
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
