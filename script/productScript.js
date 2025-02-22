
const API_URL = "https://fakestoreapi.com/products"
let products = []
let selectedCategory = null

const fetchProduct = async () => {

    try {
        
        const cachedData = localStorage.getItem('products')

        if (cachedData) {
            products.JSON.parse(cachedData)
            displayProducts(products)
        }

        const response = await fetch(API_URL);
        const newProducts = await response.json();
        localStorage.setItem("products", JSON.stringify(newProducts));
        products = newProducts;
        displayProducts(products)
    }

    catch (error) {
        console.log(error)
    }

    
}