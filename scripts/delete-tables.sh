#!/usr/bin/env bash

aws dynamodb delete-table \
    --table-name invoices \
    --endpoint-url http://localhost:8000 \
    --region=us-east-1 \
    --no-cli-pager

aws dynamodb delete-table \
    --table-name invoice-workers \
    --endpoint-url http://localhost:8000 \
    --region=us-east-1 \
    --no-cli-pager
