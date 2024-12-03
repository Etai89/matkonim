$(document).ready(() => {

    let recipie = [];
    let html = ''

    ingredientsDB.map(ing => {
        html+='<option id="'+ing.id+'">'+ing.name+'</option>';
    })
    $('.box').html('<select>'+html+'</select>')

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
                equity: Number(equity)
            }
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

    $('#finish').on('click', () => {
        // Ensure recipie array is not empty
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
                recipes: recipie // Sending the entire array
            }),
            success: function (data) {
                console.log({recipie})
                $('.box').append('המתכון נשלח בהצלחה!');
            },
            error: function (error) {
                console.error("Error submitting recipe:", error);
            }
        });

        // Clear the recipe array after appending to DOM and sending data
        // recipie = [];


    });


});
