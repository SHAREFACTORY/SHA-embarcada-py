#Procura por uma lista de objetos recebidos em uma mensagem MQTT e armazena-os em uma tabela DynamoDB
#Neste caso o nome "lambida" foi escolhido para o nome da tabela utilizada para o DynamoDB em referência ao serviço Lambda da Amazon AWS ao qual este código está sendo executado
#O Código só é funcional por ter conexão ao AWS Iot-Core via Regra que escreve as mensagens neste console Lambda, seu uso externo ao Lambda é inútil.
#O código foi desenvolvido em Python na versão 3.8
#Autor: Yuri Grapeggia Rodrigues
#Data: 18/03/2024

import json
import boto3

def lambda_handler(event, context):
    client = boto3.client('dynamodb')
    
    # Verificar se o evento é um dicionário
    if isinstance(event, dict):
        # Processar os dados da mensagem
        for topic, data in event.items():
            # Verificar se os dados são um dicionário
            if isinstance(data, dict):
                # Extrair os valores necessários
                timestamp = data.get('timestamp', 0)
                value = data.get('value', 0)
                topic_name = data.get('topic', '')

                # Inserir os dados na tabela do DynamoDB
                response = client.put_item(
                    TableName='lambida',
                    Item={
                        'timestamp': {'S': str(timestamp)},
                        'value': {'N': str(value)},
                        'topic': {'S': topic_name}
                    }
                )
    
    return 0
