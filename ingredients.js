
export const sunday = () => {
    const smarimParve = {
        ביצים: 1710,
        מלח: 103,
        גרנטה: 70,
        סוכר: 970,
        קמח: 7030,
        שמן: 1282.5,
        שמרים: 475,
    };
    
    const smarimHalavi = {
        ביצים: 1750,
        מלח: 0,
        חמאה: 1000,
        גרנטה: 0,
        סוכר: 1500,
        קמח: 450,
        קקאו: 125,
        שוקולד_מריר: 1050,
        שמן: 900,
        שמרים: 0,
    };
    
    const sumIngredients = () => {
        const result = {};
    
        // Combine keys from both objects to ensure all keys are included.
        const allKeys = new Set([...Object.keys(smarimParve), ...Object.keys(smarimHalavi)]);
    
        for (const key of allKeys) {
            const valueParve = smarimParve[key] || 0;
            const valueHalavi = smarimHalavi[key] || 0;
            result[key] = valueParve + valueHalavi;
        }
    
        console.log(result);
    
        // Generate the HTML output dynamically
        const htmlContent = Object.entries(result)
            .map(([key, value]) => {
                let displayValue = value;
    
                // Format the output based on the ingredient type
                if (key === "ביצים") displayValue = `${value / 50} יחידות`;
                else if (["סוכר", "קמח", "שמן"].includes(key)) displayValue = `${value / 1000} קילו`;
                else displayValue = `${value} גרם`;
    
                return `<li>${key}: ${displayValue}</li>`;
            })
            .join("");
    
        $('.shmarim').append(`
            <h2>שמרים חלבי, שמרים פרווה</h2>
            ${htmlContent}
        `);
    };
    
    sumIngredients();
    
}
