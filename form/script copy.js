$(document).ready(() => {
    // Dummy data for missing variables
    let productNames = ["Product1", "Product2"];
    let materials = ["Material1", "Material2"];
    let ingredientsDB = [
        { id: 1, name: "Ingredient1" },
        { id: 2, name: "Ingredient2" },
    ];

    let recipie = [];
    let html = '';
    let matHtml = '';
    let productNameHtml = '';

    // Populate product options
    productNames.forEach(product => {
        productNameHtml += `<option value="${product}">${product}</option>`;
    });
    $('.productName').html(productNameHtml);

    // Populate material options
    materials.forEach(mat => {
        matHtml += `<option value="${mat}">${mat}</option>`;
    });
    $('.material').html(matHtml);

    // Populate ingredient options
    ingredientsDB.forEach(ing => {
        html += `<option value="${ing.id}">${ing.name}</option>`;
    });
    $('.box').html(`<select class="ingredient">${html}</select>`);

    // Add Ingredient Button Click
    $('#addIngredient').on('click', () => {
        const productName = $('.productName').val();
        const amountOfProducts = $('.amountOfProducts').val();
        const ingredient = $('.ingredient').val();
        const unit = $('.unit').val();
        const equity = $('.equity').val();

        if (!productName || !amountOfProducts || !ingredient || !unit || !equity) {
            alert('Please fill out all fields!');
            return;
        }

        let total = {
            productName: productName,
            amountOfProducts: Number(amountOfProducts),
            ingredients: {
                ingredient: ingredient,
                unit: unit,
                equity: Number(equity),
            },
        };

        recipie.push(total);

        // Clear input fields
        $('.ingredient').val('');
        $('.unit').val('');
        $('.equity').val('');
        $('.ingredient').focus();

        // Append new ingredient to the list
        $('.checked').append(`
            <li>
                חומר גלם: ${ingredient}, יחידה: ${unit}, כמות: ${equity}
            </li>
        `);
    });

    // Finish Button Click
    $('#finish').on('click', () => {
        if (recipie.length === 0) {
            alert('No recipes to finish!');
            return;
        }

        recipie.forEach((recipe) => {
            let ingredientsHtml = '';
            for (const [key, value] of Object.entries(recipe.ingredients)) {
                ingredientsHtml += `<li>${key}: ${value}</li>`;
            }

            let recipeHtml = `
            <div class="recipe">
                <h3>${recipe.productName} - כמות: ${recipe.amountOfProducts}</h3>
                <ul>${ingredientsHtml}</ul>
            </div>
            `;
            $('.final').append(recipeHtml);
        });

        // Send the entire `recipie` array to the webhook
        $.ajax({
            url: 'https://hook.eu2.make.com/pgzu9bge32pnhdcw38lcf982bcd9fwwc',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                recipes: recipie,
            }),
            success: function (data) {
                console.log({ recipie });
                $('.box').append('<p>המתכון נשלח בהצלחה!</p>');
            },
            error: function (error) {
                console.error("Error submitting recipe:", error);
            },
        });

        // Clear the recipe array after sending data
        recipie = [];
    });
});
