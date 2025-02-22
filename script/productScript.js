
const API_URL = "https://fakestoreapi.com/products"
let products = []
let selectedCategory = null

const fetchProduct = async () => {

    try {

        const cachedData = localStorage.getItem('products')

        if (cachedData) {
            products = JSON.parse(cachedData)
            displayProducts(products)
        }

        const response = await fetch(API_URL);
        const newProducts = await response.json();
        localStorage.setItem("products", JSON.stringify(newProducts))
        products = newProducts
        displayProducts(products)
    }

    catch (error) {
        console.log(error)
    }


}


const displayProducts = (items) => {

    const productList = document.getElementById("productList")
    productList.innerHTML = ""

    if (items.length === 0) {
        productList.innerHTML = " <p>No Products Found</p>"
        return
    }

    items.forEach(product => {
        const productCard = document.createElement("div")
        productCard.className = "product-card"
        productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}"><h4>${product.title}</h4>
        <p>Price: ${product.price}</p>
        <button onclick="showsimilarProducts(\`${product.category}\`)">Similar Products</button>
        `
        productList.appendChild(productCard)
    })
}

document.addEventListener("DOMContentLoaded", fetchProduct)
