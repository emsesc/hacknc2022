const CosmosClient = require("@azure/cosmos").CosmosClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const phoneNum = req.body.number;
    const dietary = req.body.dietary;
    const favorites = req.body.favorites;
    const name = req.body.name;

    console.log(req.body)
    
    await createDocument({name: name, number: phoneNum, restrictions: dietary, favorite: favorites});


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: `Stored document ${phoneNum}`
    };
}

function getCosmosDBConfig() {
    const config = {
        endpoint: process.env["COSMOSDB_ENDPOINT"],
        key: process.env["COSMOSDB_KEY"],
        databaseId: "data",
        containerId: "customer",
        partitionKey: { kind: "Hash", paths: ["/id"] }
    };

    return config
}

async function createDbAndContainer(client, databaseId, containerId, partitionKey) {
    await client.databases.createIfNotExists({ id: databaseId });

    await client.database(databaseId)
        .containers.createIfNotExists(
            { id: containerId, key: partitionKey },
            { offerThroughput: 400 }
        );
}

async function createDocument(newItem) {

    const cosmosDBConfig = getCosmosDBConfig();
    const cosmosDbEndpoint = cosmosDBConfig.endpoint;
    const cosmosDbKey = cosmosDBConfig.key;

    const client = new CosmosClient({ endpoint: cosmosDbEndpoint, key: cosmosDbKey });
    const database = client.database(cosmosDBConfig.databaseId);
    const container = database.container(cosmosDBConfig.containerId);
    await createDbAndContainer(client, cosmosDBConfig.databaseId, cosmosDBConfig.containerId, cosmosDBConfig.partitionKey);

    await container.items.create(newItem);
}