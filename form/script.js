$(document).ready(() => {
    let recipie = [];
    let doneRecieps = JSON.parse(localStorage.getItem('doneRecieps')) || [];

    // Render done recipes from localStorage
    const renderDoneRecieps = () => {
        $('.DoneItems').empty(); // Clear existing items
        doneRecieps.forEach(item => {
            $('.DoneItems').append(`<li>${item} <img src="https://i.pinimg.com/736x/c9/0d/aa/c90daad8cb3b5a4f58ebf1594d8530fd.jpg"/></li>`);
        });
    };

    renderDoneRecieps();

    // Handle conditor selection and populate product names
    $('#conditorsNames').on('change', () => {
        const chosenConditor = $('#conditorsNames').val();
        if (chosenConditor && conditors[chosenConditor]) {
            const selected = conditors[chosenConditor];
            $('.productName').select2({
                placeholder: "בחר מוצר",
                data: selected.map(p => ({ id: p.id, text: p.product })),
                allowClear: true
            });
        }
    });

    // Populate Ingredients
    const ingredientsHtml = ingredientsDB.map(ing => `<option value="${ing.id}">${ing.name}</option>`).join('');
    const ingredientSelectHtml = `
        <select class="ingredient" style="width: 200px;">
            ${ingredientsHtml}
            <option value="אחר">אחר</option>
        </select>
    `;
    $('.box').html(`
        <label>חומר גלם:</label> 
        ${ingredientSelectHtml}
    `);

    $('.ingredient').select2({ placeholder: "בחר חומר גלם" });

    // Handle ingredient selection
    $('.box').on('change', '.ingredient', function () {
        if ($(this).val() === 'אחר') {
            // Replace the dropdown with an input field
            $(this).select2('destroy').replaceWith(`
                <input type='text' class='otherIngredient' placeholder="מרכיב שאינו ברשימה" style="width: 200px;">
            `);
        }
    });

    // Add Ingredient Button Click
    $('#addIngredient').on('click', () => {
        const productName = $('.productName').select2('data')[0]?.text;
        const amountOfProducts = $('.amountOfProducts').val();
        const ingredient = $('.otherIngredient').length > 0
            ? $('.otherIngredient').val()
            : $('.ingredient').select2('data')[0]?.text;
        const unit = $('#unitType').val();
        const quantity = $('#quantity').val();

        if (!productName || !amountOfProducts || !ingredient || !unit || !quantity) {
            alert('יש למלא את כל השדות!');
            return;
        }

        let total = {
            productName,
            amountOfProducts: Number(amountOfProducts),
            ingredients: { ingredient, unit, quantity: Number(quantity) }
        };

        recipie.push(total);

        $('.checked').append(`
            <li>חומר גלם: ${ingredient}, יחידה: ${unit}, כמות: ${quantity}</li>
        `);

        // Clear inputs and restore dropdown if needed
        $('.otherIngredient').remove();
        $('.box').html(`
            <label>חומר גלם:</label> 
            ${ingredientSelectHtml}
        `);
        $('.ingredient').select2({ placeholder: "בחר חומר גלם" });
        $('#quantity').val('');
    });


    $('#finish').on('click', () => {
        if (recipie.length === 0) {
            alert('אין מתכונים לסיים!');
            return;
        }


        const reciepeName = $('.productName').select2('data')[0]?.text;
        if (reciepeName) {
            doneRecieps.push(reciepeName);
            localStorage.setItem('doneRecieps', JSON.stringify(doneRecieps));

            // Append only the new recipe
            $('.DoneItems').append(`<li>${reciepeName} <img src="https://i.pinimg.com/736x/c9/0d/aa/c90daad8cb3b5a4f58ebf1594d8530fd.jpg"/></li>`);
        }
        recipie = [];
        $('.checked').empty();

        $.ajax({
            url: 'https://hook.eu2.make.com/pgzu9bge32pnhdcw38lcf982bcd9fwwc',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ recipes: recipie }),
            success: () => {
                $('.final').html(`<p>המתכון נשלח בהצלחה!</p>`);
                recipie = [];
                $('.checked').empty();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    });

});
