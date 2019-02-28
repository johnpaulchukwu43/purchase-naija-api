/*
 Created by Johnpaul Chukwu @ $
*/

// Get Unique Brands from Json Data
export const getBrands = (products) => {
    var uniqueBrands = [];
    products.map((product, index) =>
        product.brands.map((tag) =>
        {
            if(uniqueBrands.indexOf(tag) === -1){
                uniqueBrands.push(tag);
            }
        })
    )
    //console.log(uniqueBrands)
    return uniqueBrands;
}

// Get Unique Colors from Json Data
export const getColors = (products) => {
    var uniqueColors = [];
    products.map((product, index) =>
        product.colors.map((color) =>
        {
            if(uniqueColors.indexOf(color) === -1){
                uniqueColors.push(color);
            }
        })
    )
    //console.log(uniqueBrands)
    return uniqueColors;
}

// Get Minimum and Maximum Prices from Json Data
export const getMinMaxPrice = (products) => {
    let min = 100, max = 1000;

    products.map((product, index) => {
        let v = product.price;
        min = (v < min) ? v : min;
        max = (v > max) ? v : max;
    })

    return {'min':min, 'max':max};
}

export const getVisibleproducts = (data, { brand, color, value, sortBy, startPrice, endPrice }) => {
    return data.filter(product => {

        // const brandMatch = product.brands.some(tag => brand.includes(tag))

        let colorMatch;
        if(color) {
            colorMatch = product.colors.includes(color)
        }else{
            colorMatch = true;
        }
        const startPriceMatch = typeof value.min !== 'number' || value.min <= product.price;
        const endPriceMatch = typeof value.max !== 'number' || product.price <= value.max;

        return  colorMatch && startPriceMatch && endPriceMatch;
    }).sort((product1, product2) => {
        if (sortBy === 'HighToLow') {
            return product2.price < product1.price ? -1 : 1;
        } else if (sortBy === 'LowToHigh') {
            return product2.price > product1.price ? -1 : 1;
        } else if (sortBy === 'Newest') {
            return product2.id < product1.id ? -1 : 1;
        } else if (sortBy === 'AscOrder') {
            return product1.name.localeCompare(product2.name);
        } else if (sortBy === 'DescOrder') {
            return product2.name.localeCompare(product1.name);
        }
    });
}
