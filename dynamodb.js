'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const config = {region: 'us-east-1', accessKeyId: 'placeholder', secretAccessKey: 'placeholder'}
AWS.config.update(config)

const options = {
    region: 'config.region',
    endpoint: 'http://localhost:8004',
 };

const client = new AWS.DynamoDB.DocumentClient(options);

module.exports = client;