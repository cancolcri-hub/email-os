#!/bin/bash
# pre-send-gdpr.sh
# Verifica requisitos GDPR/LOPDGDD antes de enviar cualquier email de marketing
# Uso: bash hooks/pre-send-gdpr.sh <ruta-al-borrador-de-email>

set -euo pipefail

EMAIL_FILE="${1:-}"
CONFIG_FILE="client-config/client-config.example.yaml"
ERRORS=0
WARNINGS=0

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "=== Pre-send GDPR Check ==="
echo ""

# 1. Verificar que existe client-config.yaml del cliente activo
if [ ! -f "client-config.yaml" ]; then
  echo -e "${RED}[BLOQUEADO]${NC} No se encontró client-config.yaml en el directorio del cliente."
  echo "  → Asegúrate de estar en el directorio correcto: clientes/<nombre-cliente>/"
  ERRORS=$((ERRORS + 1))
fi

# 2. Verificar DPA firmado
if [ -f "client-config.yaml" ]; then
  DPA_SIGNED=$(grep -E "^\s*dpa_signed:" client-config.yaml | grep -c "true" || true)
  if [ "$DPA_SIGNED" -eq 0 ]; then
    echo -e "${RED}[BLOQUEADO]${NC} DPA no firmado (legal.dpa_signed: false en client-config.yaml)."
    echo "  → Firmar el contrato de encargado del tratamiento antes de enviar cualquier email."
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}[OK]${NC} DPA firmado."
  fi
fi

# 3. Si se pasó un archivo de email, verificar contenido
if [ -n "$EMAIL_FILE" ] && [ -f "$EMAIL_FILE" ]; then
  echo ""
  echo "Analizando borrador: $EMAIL_FILE"
  echo ""

  # Verificar enlace de baja
  if ! grep -qiE "(dar(me)? de baja|unsubscribe|baja de la lista|cancelar suscripción)" "$EMAIL_FILE"; then
    echo -e "${RED}[ERROR]${NC} No se detecta enlace de baja en el email."
    echo "  → Todo email de marketing debe incluir opción de baja visible (LSSI art. 22)."
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}[OK]${NC} Enlace de baja detectado."
  fi

  # Verificar datos del responsable
  if ! grep -qiE "(responsable|responsible_name|C\/|Calle|dirección)" "$EMAIL_FILE"; then
    echo -e "${YELLOW}[AVISO]${NC} No se detectan datos del responsable del tratamiento en el pie."
    echo "  → El pie debe incluir nombre y dirección del cliente (responsable), no de Digital Project."
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}[OK]${NC} Datos del responsable detectados."
  fi

  # Verificar ausencia de métricas inventadas
  if grep -qiE "([0-9]+%.*vendas|vendas.*[0-9]+%|triplicar|duplicar.*ventas|resultado.*garantizado)" "$EMAIL_FILE"; then
    echo -e "${YELLOW}[AVISO]${NC} Posibles métricas o promesas exageradas detectadas."
    echo "  → Revisar y eliminar cualquier afirmación sin evidencia real."
    WARNINGS=$((WARNINGS + 1))
  fi

fi

echo ""
echo "=== Resultado ==="
if [ "$ERRORS" -gt 0 ]; then
  echo -e "${RED}BLOQUEADO — $ERRORS error(es) crítico(s). No enviar hasta resolverlos.${NC}"
  exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo -e "${YELLOW}REVISAR — $WARNINGS aviso(s). El envío no está bloqueado pero revisar antes de continuar.${NC}"
  exit 0
else
  echo -e "${GREEN}OK — Verificación GDPR superada.${NC}"
  exit 0
fi
