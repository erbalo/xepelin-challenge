#!/usr/bin/env bash

aws dynamodb create-table \
    --region=us-east-1 \
    --endpoint-url http://localhost:8000 \
    --table-name invoices \
    --attribute-definitions \
        AttributeName=id,AttributeType=N \
        AttributeName=issuer_id,AttributeType=N \
        AttributeName=receiver_id,AttributeType=N \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 \
    --global-secondary-indexes "IndexName=issuer-idx, \
        KeySchema=[{AttributeName=issuer_id,KeyType=HASH}], \
        Projection={ProjectionType=ALL}, \
        ProvisionedThroughput={ReadCapacityUnits=10,WriteCapacityUnits=10}" \
        "IndexName=receiver-idx, \
        KeySchema=[{AttributeName=receiver_id,KeyType=HASH}], \
        Projection={ProjectionType=ALL}, \
        ProvisionedThroughput={ReadCapacityUnits=10,WriteCapacityUnits=10}" \
    --no-cli-pager
