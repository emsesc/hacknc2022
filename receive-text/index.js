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
        for (i = 0; i < menu.Vegetarian.length; i++) {
            responseMessage += `\n${menu.Vegetarian[i]}`;
        }
    } else if (data.toLowerCase() == "gluten-free") {
        responseMessage = `Need some gluten-free options? We got you!`
        for (i = 0; i < menu["Gluten Free"].length; i++) {
            responseMessage += `\n${menu["Gluten Free"][i]}`;
        }
    } else if (data.toLowerCase() == "vegan") {
        responseMessage = `Need some vegan options? We got you!`
        for (i = 0; i < menu.Vegan.length; i++) {
            responseMessage += `\n${menu.Vegan[i]}`;
        }
    }

    context.log(responseMessage);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
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