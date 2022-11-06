const CosmosClient = require("@azure/cosmos").CosmosClient;
const chaseUrl = "https://dining.unc.edu/locations/chase/";
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    let customers = await retrieveDocuments();
    context.log(customers)
    let menu = await getMenu();

    for (var i = 0; i < customers.length; i++) {
        context.log(customers[i])
        var fS = ""
        context.log(menu["All Menu Items"])
        for (var x = 0; x < customers[i].favorite.length; x++) {
            if (menu["All Menu Items"].includes(customers[i].favorite[x])) {

                fS += `${customers[i].favorite[x]}\n`
            }
        }

        context.log(fS)

        client.messages
            .create({
                body: ` \n☀️ Good morning, ${customers[i].name}!\n🚨 Great news! Your favorite foods are in the dining hall:\n${fS}\nText back with "vegetarian", "gluten-free", or "vegan" for a filtered menu.`,
                from: '+15094368747',
                to: `+${customers[i].number}`
            })
            .then(message => console.log(message.sid));
    }

    context.log('JavaScript timer trigger function ran!', timeStamp);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: customers
    };
};

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

async function retrieveDocuments() {

    const cosmosDBConfig = getCosmosDBConfig();
    const cosmosDbEndpoint = cosmosDBConfig.endpoint;
    const cosmosDbKey = cosmosDBConfig.key;

    const client = new CosmosClient({ endpoint: cosmosDbEndpoint, key: cosmosDbKey });
    const database = client.database(cosmosDBConfig.databaseId);
    const container = database.container(cosmosDBConfig.containerId);
    await createDbAndContainer(client, cosmosDBConfig.databaseId, cosmosDBConfig.containerId, cosmosDBConfig.partitionKey);

    const querySpec = {
        query: "SELECT * from c"
    };

    // read all items in the Items container before creating a new one
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

    return items
}

async function getMenu() {
    let response = await axios(chaseUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    // Dinner
    var menu = $('#menu-tabs > div');
    console.log(menu.length);

    var dinnerItems = [];
    var dinnerVegetarian = [];
    var dinnerVegan = [];
    var dinnerGf = [];

    let uniqueDinnerItems = [];
    let uniqueVegetarianItems = [];
    let uniqueVeganItems = [];
    let uniqueGfItems = [];
    menu.each(function () {
        var child = $('div');
        console.log(child.length);
        var menu_station = $('div > ul > li');
        console.log(menu_station.length);
        menu_station.each(function () {
            const item = $(this).find('a').text();
            if (item.length > 0) {
                dinnerItems.push(item);
            }

            // vegetarian
            const indexOfVeg = $(this).html().indexOf("vegetarian");
            const isVeg = indexOfVeg > -1;
            if (isVeg) {
                dinnerVegetarian.push(item);
            }


            // adding to vegan if vegan
            const indexOfVegan = $(this).html().indexOf("vegan");
            const isVegan = indexOfVegan > -1;
            if (isVegan) {
                dinnerVegan.push(item);
            }

            // adding to gf if made_without_gluten
            const indexOfMWG = $(this).html().indexOf("made_without_gluten");
            const isGf = indexOfMWG > -1;
            if (isGf) {
                dinnerGf.push(item);
            }
        })
        uniqueDinnerVegetarian = [...new Set(dinnerVegetarian)];
        uniqueDinnerVegan = [...new Set(dinnerVegan)];
        uniqueDinnerGf = [...new Set(dinnerGf)];
        uniqueDinnerItems = [...new Set(dinnerItems)];
        uniqueDinnerVegetarian.splice(uniqueDinnerVegetarian.indexOf("100% Cranberry Juice"), uniqueDinnerVegetarian.indexOf("Gatorade Orange"));
        uniqueDinnerVegetarian.splice(uniqueDinnerVegetarian.indexOf("Pancake Syrup "), uniqueDinnerVegetarian.indexOf('Peanut Butter'));
        uniqueDinnerVegetarian.splice(uniqueDinnerVegetarian.indexOf("Manicotti "));

        uniqueDinnerVegan.splice(uniqueDinnerVegan.indexOf("100% Cranberry Juice"), uniqueDinnerVegan.indexOf("Gatorade Orange"));
        uniqueDinnerVegan.splice(uniqueDinnerVegan.indexOf("Pancake Syrup "), uniqueDinnerVegan.indexOf('Peanut Butter'));
        uniqueDinnerVegan.splice(uniqueDinnerVegan.indexOf("Manicotti "));

        uniqueDinnerGf.splice(uniqueDinnerGf.indexOf("100% Cranberry Juice"), uniqueDinnerGf.indexOf("Gatorade Fruit Punch"));
        uniqueDinnerGf.splice(uniqueDinnerGf.indexOf("Pancake Syrup "), uniqueDinnerGf.indexOf('Peanut Butter'));
        uniqueDinnerGf.splice(uniqueDinnerGf.indexOf("Manicotti "));
        uniqueDinnerGf.splice(uniqueDinnerGf.indexOf("Alfredo Sauce"));

        uniqueDinnerItems.splice(uniqueDinnerItems.indexOf("100% Cranberry Juice"), uniqueDinnerItems.indexOf("Gatorade Orange"));
        // console.log("Vegetarian: ", uniqueDinnerVegetarian);
        // console.log("Vegan: ", uniqueDinnerVegan);
        // console.log("Gluten Free: ", uniqueDinnerGf);
        // console.log("Dinner Items: ", uniqueDinnerItems);
    });

    const dinner = { 'Vegetarian': uniqueDinnerVegetarian, 'Vegan': uniqueDinnerVegan, 'Gluten Free': uniqueDinnerGf, 'All Menu Items': uniqueDinnerItems };
    console.log(dinner);

    return dinner;
}