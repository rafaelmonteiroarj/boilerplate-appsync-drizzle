#!/bin/bash

# Adiciona novo campo ao DynamoDB e atualiza todos os itens com o valor default
# Outra forma de atualizar o registro

# Defina as variáveis
TABLE_NAME="tela-vermelha-pet-users"        # Nome da sua tabela DynamoDB
NOVO_CAMPO="grantAccessGenia"        # Nome do campo a ser adicionado

VALOR_DEFAULT="{\"coe\": false, \"trends\": true}" # Valor default para o novo campo
    
# Use a AWS CLI para fazer uma varredura na tabela e obter os itens
aws dynamodb scan \
  --table-name $TABLE_NAME \
  --projection-expression "id" \
  --output json \
  | jq -r '.Items[] | .id.S' \
  | while read ITEM_ID; do
    # Para cada item, faça um update adicionando o novo campo com o valor default
    # echo "Atualizando item com ID: $ITEM_ID"
    
    aws dynamodb update-item \
      --table-name $TABLE_NAME \
      --key "{\"id\": {\"S\": \"$ITEM_ID\"}}" \
      --update-expression "SET #novoCampo = :valorDefault" \
      --expression-attribute-names '{"#novoCampo": "'$NOVO_CAMPO'"}' \
      --expression-attribute-values "{\":valorDefault\": {\"S\": \"$VALOR_DEFAULT\"}}" \
      --return-values ALL_NEW
    #  --expression-attribute-values '{":valorDefault": {"S": "'$VALOR_DEFAULT'"}}' \
     
    echo "Item $ITEM_ID atualizado com sucesso!"
done
