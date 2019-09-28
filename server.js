const express = require('express');
const aws = require('aws-sdk');
const stringUtils = require('./StringUtils');

const fs = require('fs');
const app = express();
let rawdata = fs.readFileSync('database.json');
let jsonData = JSON.parse(rawdata);


//configure AWS 
let awsConfig = ({
    "region": 'us-east-2',
    "endpoint" : "http://dynamodb.us-east-2.amazonaws.com", 
    "accessKeyId" : "",
    "secretAccessKey" : "" 
});
aws.config.update(awsConfig);
const docClient = new aws.DynamoDB.DocumentClient();

app.get('/', function(req, res) {
    res.render('index.ejs')
});


// fuzzy search 
app.get('/fuzzy-search', function(req, res) {
    ingredientName = req.query.key
    var param = {
        TableName : "test",
        Key: {
            "key" : ingredientName.toHashKey()
        }
    }
      docClient.get(param, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            res.send(data)
        }
    });
});



// insert all item from the database.json file to dynomo DB
app.post('/add-ingredients', function(req, res) { 
    count = 0
    for (x in jsonData) {
        count = count + 1
        var param = {
            TableName: 'test',
            Item: {
                'key': x,
                'text' : jsonData[x]["text"],
                'tags' : jsonData[x]["tags"]
            }
        }
                    
        docClient.put(param, function(err, data) {
            if (err) {
                res.send(err+"error")
            } else{
                res.send(data)
            }
        });
    }
    res.send(count + "Items added in the cloud DB")

});

// insert all item from the database.json file to dynomo DB
app.put('/add-ingredients', function(req, res) { 
        var param = {
            TableName: 'test',
            Item: {
                'key': x,
                'text' : jsonData[x]["text"],
                'tags' : jsonData[x]["tags"]
            }
        }
                    
        docClient.put(param, function(err, data) {
            if (err) {
                res.send(err+"error")
            } else{
                res.send("Item added to the Database")
            }
        });

    

});



// get an item details from the database
app.get('/ingredient', function(req, res) {
    ingredientName = req.query.key
    var param = {
        TableName : "test",
        Key: {
            "key" : ingredientName
        }
    }
    
    docClient.get(param, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            res.send(data)
        }
    });
});





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));