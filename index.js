//Comment belowline after code deployed as lambda function
require('dotenv').config();

let AWS = require('aws-sdk');
let region = process.env.REGION;
/**
use this code only to run lambda in the local
To use this code make AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as env variables
*/
if(process.env.RUN_LOCAL){
    const { AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY } = process.env;
    AWS.config.update({
        accessKeyId : AWS_ACCESS_KEY_ID,
        secretAccessKey : AWS_SECRET_ACCESS_KEY,
        region : region
    });
}

let client = new AWS.SecretsManager({
    region:region 
});
let environment = process.env.ENV;
let response;
let getSecretKeyValue = async (event) => {
    let secretName = (environment === 'production') ? "production-secret-key" : "development-secret-key" ;
    client.getSecretValue({SecretId: secretName}, (err, data) => {
        if (err) {
            console.log(err);   
        } else {
            console.log(typeof data);
            if("SecretString" in data){
                response = {
                    statusCode: 200,
                    body: data.SecretString
                };
            }
        }
        console.log(response);
        return response;
    });
}

getSecretKeyValue();
exports.handler = getSecretKeyValue;
