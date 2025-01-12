$(document).ready(async() => {

    let recipie = [];
    let html = ''

    if (Array.isArray(ingredientsDB) && ingredientsDB.length > 0) {
        ingredientsDB.map(ing => {
            if (ing.id && ing.name) {
                html += `<option value="${ing.id}">${ing.name}</option>`;  // Use 'value' instead of 'id'
            }
        });
    } else {
        console.error('ingredientsDB is not available or empty');
        return;
    }

    // Append the select element
    $('.box').html('<select id="mySelect">' + html + '</select>');

    // Initialize Select2 after the select element is added to the DOM
    $('#mySelect').select2({
        placeholder: "Select a fruit",
        allowClear: true
    });

    const response = await fetch('/matkonim.csv');
    const rows = await response.text()
    const data = rows.trim().split("\n").map(row => row.split(","));
    const ingredientsData = []
    data.map(item => {
        const name = item[0]
        const manot = item[1]
        const ingredintName = item[2]
        const unit = item[3]
        const quantity = item[4]
        const obj = {
            name, 
            manot,
            ingredintName,
            unit,
            quantity,
        }
        ingredientsData.push(obj)
    })

    const recipes = []

    ingredientsData.forEach(item => {
        const recipeName = item.name.trim();
        const key = `${recipeName}`;

        if (!recipes[key]) {
            recipes[key] = {
                name: recipeName,
                manot: item.manot,
                ingredients: []
            };
        }

        recipes[key].ingredients.push({
            ingredintName: item.ingredintName.trim(),
            unit: item.unit.trim(),
            quantity: parseFloat(item.quantity.trim())
        });
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


    console.log({recipes})
});
