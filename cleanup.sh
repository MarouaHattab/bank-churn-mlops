#!/bin/bash

# Configuration
RESOURCE_GROUP="rg-mlops-bank-churn"

echo "=========================================="
echo "   NETTOYAGE DES RESSOURCES AZURE"
echo "=========================================="
echo "Attention : cette opération est irréversible."
echo "Elle supprimera votre ACR, Container App, Application Insights, etc."
echo ""

read -p "Voulez-vous vraiment supprimer toutes les ressources dans '$RESOURCE_GROUP' ? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Opération annulée."
    exit 0
fi

echo -e "\n📦 Ressources à supprimer dans $RESOURCE_GROUP :"
az resource list --resource-group "$RESOURCE_GROUP" --output table

echo -e "\n🚀 Suppression en cours..."
# --no-wait permet au script de finir immédiatement pendant qu'Azure travaille en arrière-plan
az group delete --name "$RESOURCE_GROUP" --yes --no-wait

echo -e "\n✅ Commande de suppression lancée avec succès !"
echo "⚠️  Le nettoyage complet prendra environ 5 à 10 minutes."
echo "Vous pouvez suivre l'avancement sur : https://portal.azure.com"

# Commande pour vérifier l'état des groupes de ressources
echo -e "\nÉtat actuel des groupes de ressources :"
az group list --output table
