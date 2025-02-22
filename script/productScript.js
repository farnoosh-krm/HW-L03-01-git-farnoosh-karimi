
const API_URL = "https://fakestoreapi.com/products"
let products = []
let selectedCategory = null
let cart = JSON.parse(localStorage.getItem("cart")) || []


const fetchProduct = async () => {

    try {

        const cachedData = localStorage.getItem('products')

        if (cachedData) {
            products = JSON.parse(cachedData)
            displayProducts(products)
            categoryShow()
            setTimeout(loadFiltersFromLocalStorage, 100)
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
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title}</h4>
        <p>Price: ${product.price}</p>
        <button onclick="showsimilarProducts(\`${product.category}\`)" style="width:140px;left: 15px">Similar Products</button>
        <button id="buybtn" onclick="addToCart(${product.id})" style="width:70px; left: 165px; ">Buy</button>
        `
        productList.appendChild(productCard)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProduct()
    displayCart()
    saveFiltersToLocalStorage()
})



const showsimilarProducts = (category) => {

    selectedCategory = category
    const similarProducts = products.filter(product => product.category === category);
    displaySimilarProducts(similarProducts)
}


const displaySimilarProducts = (items) => {

    const similarProducts = document.getElementById("similarProducts")
    similarProducts.innerHTML = ""

    if (items.length === 0) {
        similarProducts.innerHTML = "<p>No Similar Products Found</p>"
        return
    }

    items.forEach(product => {

        const productCard = document.createElement("div")
        productCard.className = "product-card"
        productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title}</h4>
        <p>Price: ${product.price}</p>
        `
        similarProducts.appendChild(productCard)
    })
}


let debounceTimeout; const debounceSearch = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(searchProduct, 300)
}


const searchProduct = () => {
    const query = document.getElementById("search-input").value.toLowerCase()
    const filteredproducts = products.filter(product =>
        product.title.toLowerCase().includes(query)
    )
    displayProducts(filteredproducts)
}


const categoryShow = () => {

    const categories = [...new Set(products.map(product => product.category))]
    const categoryFilter = document.getElementById("selectCategory")
    categoryFilter.innerHTML = `<option>all categories</option>`

    categories.forEach((category) => {

        const option = document.createElement("option")
        option.value = category
        option.textContent = category
        categoryFilter.appendChild(option)

    })
}


const filterByCategory = () => {

    selectedCategory = document.getElementById("selectCategory").value
    const filteredProducts = selectedCategory ?
        products.filter((product) => product.category === selectedCategory)
        : products

    displayProducts(filteredProducts)
    saveFiltersToLocalStorage()
}


const filterByPrice = () => {
    const maxPrice = Number(document.getElementById("priceFilter").value) || Infinity
    const minPrice = Number(document.getElementById("minPrice").value) || 0

    if (isNaN(maxPrice) && isNaN(minPrice)) {
        return;
    }

    const filteredProducts = selectedCategory ?
        products.filter((product) => product.category === selectedCategory && product.price <= maxPrice && product.price >= minPrice)
        : products.filter((product) => product.price <= maxPrice && product.price >= minPrice)

    displayProducts(filteredProducts)
    saveFiltersToLocalStorage()
}

// WTF

const addToCart = (id) => {
    const product = products.find(p => p.id === id)
    if (!cart.some(item => item.id === id)) {
        cart.push(product)
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    displayCart()
}

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id)
    localStorage.setItem("cart", JSON.stringify(cart))
    displayCart()
}

const displayCart = () => {
    const cartList = document.getElementById("cart")
    cartList.innerHTML = ""
    if (cart.length === 0) {
        cartList.innerHTML = "<p>Cart is empty</p>"
        return;
    }
    cart.forEach(item => {
        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="50">
            <span>${item.title} - $${item.price}</span>
            <button onclick="removeFromCart(${item.id})" style="background-color: rgb(255, 0, 0);padding: 0px 8px; width:70px; position: static; bottom: 10px; ">Remove</button>
        `
        cartList.appendChild(cartItem)
    })
}







