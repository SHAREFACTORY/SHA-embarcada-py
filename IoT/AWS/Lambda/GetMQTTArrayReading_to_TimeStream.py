#Procura por uma lista de objetos dentro de uma array recebidos em uma mensagem MQTT e armazena-os em uma tabela DynamoDB
#Neste caso o nome "lambida" foi escolhido para o nome da tabela utilizada para o DynamoDB em referência ao serviço Lambda da Amazon AWS ao qual este código está sendo executado
#O Código só é funcional por ter conexão ao AWS Iot-Core via Regra que escreve as mensagens neste console Lambda, seu uso externo ao Lambda é inútil.
#O código foi desenvolvido em Python na versão 3.8
#Autor: Yuri Grapeggia Rodrigues
#Data: 18/03/2024

import json
import boto3

def lambda_handler(event, context):
    client = boto3.client('timestream-write')
    
    # Check if event is a list
    if isinstance(event, list):
        # Iterate over objects in the list
        for data_obj in event:
            # Check if object is a dictionary
            if isinstance(data_obj, dict):
                # Iterate over data within the object
                for topic, data in data_obj.items():
                    # Check if data is a dictionary
                    if isinstance(data, dict):
                        # Extract required values
                        timestamp = data.get('timestamp', 0)
                        value = data.get('value', 0)

                        # Convert timestamp to milliseconds
                        timestamp_ms = int(timestamp * 1000)

                        # Prepare Timestream record
                        record = {
                            'Dimensions': [
                                {
                                    'Name': 'topic',  # Keep "topic" as a dimension for clarity
                                    'Value': topic
                                }
                                # Add other dimensions as needed
                            ],
                            'MeasureName': topic,  # Use topic directly as measure name
                            'MeasureValue': str(value),
                            'Time': str(timestamp_ms)  # Use milliseconds timestamp
                        }

                        # Write the record to Timestream
                        response = client.write_records(
                            DatabaseName='prototipoDB',
                            TableName='lambida',
                            Records=[record]
                        )

    return 0
