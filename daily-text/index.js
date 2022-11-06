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
            if(menu["All Menu Items"].some(item => item.foodName === customers[i].favorite[x])){

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
        let response = await axios(chaseUrl)
        const html = response.data;
        const $ = cheerio.load(html);

        var vegetarian = [];
        var vegan = [];
        var gf = [];

        const waffleList = $('#menu-station-data-539fd53b59e3bb12d203f45a912eeaf2-b4f1ec9f4b5c8207f8fc29522efe783d > ul > li');
        console.log(waffleList.length);
        const waffleBar = [];
        waffleList.each(function () {
            const foodName = $(this).find('a').text();

            // adding to vegetarian if vegetarian
            const indexOfVeg = $(this).html().indexOf("vegetarian");
            const isVeg = indexOfVeg > -1;
            if(isVeg) {
                vegetarian.push(foodName);
            }

            // adding to vegan if vegan
            const indexOfVegan = $(this).html().indexOf("vegan");
            const isVegan = indexOfVegan > -1;
            if(isVegan) {
                vegan.push(foodName);
            }

            // adding to gf if made_without_gluten
            const indexOfMWG = $(this).html().indexOf("made_without_gluten");
            const isGf = indexOfMWG > -1;
            if(isGf) {
                gf.push(foodName);
            }

            waffleBar.push({
                foodName,
            });
        });
        console.log(waffleBar);

        const specialtyList = $('#menu-station-data-7eabe3a1649ffa2b3ff8c02ebfd5659f-b4f1ec9f4b5c8207f8fc29522efe783d > ul > li');
        console.log(specialtyList.length);
        const spBakery = [];
        specialtyList.each(function () {
            const foodName = $(this).find('a').text();

            // adding to vegetarian if vegetarian
            const indexOfVeg = $(this).html().indexOf("vegetarian");
            const isVeg = indexOfVeg > -1;
            if(isVeg) {
                vegetarian.push(foodName);
            }

            // adding to vegan if vegan
            const indexOfVegan = $(this).html().indexOf("vegan");
            const isVegan = indexOfVegan > -1;
            if(isVegan) {
                vegan.push(foodName);
            }

            // adding to gf if made_without_gluten
            const indexOfMWG = $(this).html().indexOf("made_without_gluten");
            const isGf = indexOfMWG > -1;
            if(isGf) {
                gf.push(foodName);
            }

            spBakery.push({
                foodName,
            });
        });
        console.log(spBakery);
        
        const bakeryList = $('#menu-station-data-c4ca4238a0b923820dcc509a6f75849b-b4f1ec9f4b5c8207f8fc29522efe783d > ul > li');
        console.log(bakeryList.length);
        const bakery = [];
        bakeryList.each(function () {
            const foodName = $(this).find('a').text();

            // adding to vegetarian if vegetarian
            const indexOfVeg = $(this).html().indexOf("vegetarian");
            const isVeg = indexOfVeg > -1;
            if(isVeg) {
                vegetarian.push(foodName);
            }

            // adding to vegan if vegan
            const indexOfVegan = $(this).html().indexOf("vegan");
            const isVegan = indexOfVegan > -1;
            if(isVegan) {
                vegan.push(foodName);
            }

            // adding to gf if made_without_gluten
            const indexOfMWG = $(this).html().indexOf("made_without_gluten");
            const isGf = indexOfMWG > -1;
            if(isGf) {
                gf.push(foodName);
            }

            bakery.push({
                foodName,
            });
        });
        console.log(bakery);

        const kitchenList = $('#menu-station-data-eccbc87e4b5ce2fe28308fd9f2a7baf3-b4f1ec9f4b5c8207f8fc29522efe783d > ul > li');
        console.log(kitchenList.length);
        const kitchen = [];
        kitchenList.each(function () {
            const foodName = $(this).find('a').text();

            // adding to vegetarian if vegetarian
            const indexOfVeg = $(this).html().indexOf("vegetarian");
            const isVeg = indexOfVeg > -1;
            if(isVeg) {
                vegetarian.push(foodName);
            }

            // adding to vegan if vegan
            const indexOfVegan = $(this).html().indexOf("vegan");
            const isVegan = indexOfVegan > -1;
            if(isVegan) {
                vegan.push(foodName);
            }

            // adding to gf if made_without_gluten
            const indexOfMWG = $(this).html().indexOf("made_without_gluten");
            const isGf = indexOfMWG > -1;
            if(isGf) {
                gf.push(foodName);
            }
            
            kitchen.push({
                foodName,
            });
        });
        console.log(kitchen);

        const saladList = $('#menu-station-data-b53b3a3d6ab90ce0268229151c9bde11-b4f1ec9f4b5c8207f8fc29522efe783d > ul > li');
        console.log(saladList.length);
        const saladBar = [];
        saladList.each(function() {
            const foodName = $(this).find('a').text();

            // adding to vegetarian if vegetarian
            const indexOfVeg = $(this).html().indexOf("vegetarian");
            const isVeg = indexOfVeg > -1;
            if(isVeg) {
                vegetarian.push(foodName);
            }
            
            // adding to vegan if vegan
            const indexOfVegan = $(this).html().indexOf("vegan");
            const isVegan = indexOfVegan > -1;
            if(isVegan) {
                vegan.push(foodName);
            }

            // adding to gf if made_without_gluten
            const indexOfMWG = $(this).html().indexOf("made_without_gluten");
            const isGf = indexOfMWG > -1;
            if(isGf) {
                gf.push(foodName);
            }
            
            saladBar.push({
                foodName,
            });
        });
        console.log(saladBar);

        console.log("Vegetarian: ", vegetarian);
        console.log("Vegan: ", vegan);
        console.log("Gluten Free: ", gf);

        const allItems = waffleBar.concat((spBakery.concat(bakery.concat(kitchen.concat(saladBar)))));
        console.log("All Items: ", allItems);
        
        const continentalBreakfast = {'Vegetarian' : vegetarian, 'Vegan' : vegan, "Gluten Free" : gf, "All Menu Items" : allItems};
        console.log(continentalBreakfast);

        return continentalBreakfast;

}