$(document).ready(async() => {

    let recipie = [];
    let html = ''

    ingredientsDB.map(ing => {
        html+='<option id="'+ing.id+'">'+ing.name+'</option>';
    })
    $('.box').html('<select>'+html+'</select>')

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

    console.log({recipes})
});
