const chaseUrl = "https://dining.unc.edu/locations/chase/";
const axios = require("axios");
const cheerio = require("cheerio");
const querystring = require('qs');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);
    
    const data = queryObject.Body;
    context.log(queryObject)
    context.log(data)
    let responseMessage = ""
    let menu = await getMenu();
    context.log(menu.Vegetarian)

    if (data.toLowerCase() == "vegetarian") {
        responseMessage = `Need some vegetarian options? We got you!`
        for (i = 0; i < menu.Vegetarian.length; i ++) {
            responseMessage += `\n${menu.Vegetarian[i].foodName}`;
        }
    } else if (data.toLowerCase() == "gluten-free") {
        responseMessage = `Need some gluten-free options? We got you!`
        for (i = 0; i < menu["Gluten Free"].length; i ++) {
            responseMessage += `\n${menu["Gluten Free"][i].foodName}`;
        }
    } else if (data.toLowerCase() == "vegan") {
        responseMessage = `Need some vegan options? We got you!`
        for (i = 0; i < menu.Vegan.length; i ++) {
            responseMessage += `\n${menu.Vegan[i].foodName}`;
        }
    }

    context.log(responseMessage);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
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