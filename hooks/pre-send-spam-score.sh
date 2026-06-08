#!/bin/bash
# pre-send-spam-score.sh
# Score básico anti-spam para asuntos y cuerpos de email
# Uso: bash hooks/pre-send-spam-score.sh <ruta-al-borrador-de-email>

set -euo pipefail

EMAIL_FILE="${1:-}"
SCORE=0
WARNINGS=()

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

if [ -z "$EMAIL_FILE" ] || [ ! -f "$EMAIL_FILE" ]; then
  echo "Uso: bash hooks/pre-send-spam-score.sh <ruta-al-borrador>"
  exit 1
fi

echo "=== Spam Score Check: $EMAIL_FILE ==="
echo ""

CONTENT=$(cat "$EMAIL_FILE")

# Palabras de alto riesgo en filtros de spam
SPAM_WORDS=(
  "GRATIS" "GRATUITO AHORA" "OFERTA LIMITADA" "ACTÚA YA" "URGENTE"
  "GANA DINERO" "INGRESOS EXTRA" "TRABAJO DESDE CASA"
  "100% GRATIS" "SIN RIESGO" "GARANTIZADO"
  "HAGA CLIC AQUÍ" "CLICK AQUÍ"
  "!!!!" "$$" "€€€"
)

for word in "${SPAM_WORDS[@]}"; do
  if echo "$CONTENT" | grep -qi "$word"; then
    SCORE=$((SCORE + 2))
    WARNINGS+=("Palabra de riesgo alto detectada: '$word'")
  fi
done

# Asunto en MAYÚSCULAS
SUBJECT_LINE=$(echo "$CONTENT" | grep -i "^ASUNTO:" | head -1 || true)
if [ -n "$SUBJECT_LINE" ]; then
  UPPER_COUNT=$(echo "$SUBJECT_LINE" | grep -o '[A-ZÁÉÍÓÚÑ]' | wc -l || true)
  TOTAL_COUNT=$(echo "$SUBJECT_LINE" | grep -o '[a-zA-ZáéíóúñÁÉÍÓÚÑ]' | wc -l || true)
  if [ "$TOTAL_COUNT" -gt 5 ] && [ "$UPPER_COUNT" -gt $((TOTAL_COUNT / 2)) ]; then
    SCORE=$((SCORE + 3))
    WARNINGS+=("El asunto tiene demasiadas mayúsculas")
  fi
fi

# Exceso de signos de exclamación
EXCLAMATION_COUNT=$(echo "$CONTENT" | grep -o '!' | wc -l || true)
if [ "$EXCLAMATION_COUNT" -gt 3 ]; then
  SCORE=$((SCORE + 1))
  WARNINGS+=("Demasiados signos de exclamación: $EXCLAMATION_COUNT")
fi

# Exceso de emojis (aproximación)
EMOJI_APPROX=$(echo "$CONTENT" | grep -oP '[\x{1F300}-\x{1F9FF}]' 2>/dev/null | wc -l || echo 0)
if [ "$EMOJI_APPROX" -gt 5 ]; then
  SCORE=$((SCORE + 1))
  WARNINGS+=("Posible exceso de emojis: $EMOJI_APPROX detectados")
fi

echo "Avisos detectados: ${#WARNINGS[@]}"
for w in "${WARNINGS[@]}"; do
  echo -e "  ${YELLOW}→ $w${NC}"
done

echo ""
echo "Score de riesgo de spam: $SCORE / 10"

if [ "$SCORE" -ge 6 ]; then
  echo -e "${RED}ALTO RIESGO — Revisar el email antes de enviar. Probable filtro de spam.${NC}"
  exit 1
elif [ "$SCORE" -ge 3 ]; then
  echo -e "${YELLOW}RIESGO MEDIO — Revisar los avisos antes de enviar.${NC}"
  exit 0
else
  echo -e "${GREEN}RIESGO BAJO — El email parece limpio.${NC}"
  exit 0
fi
