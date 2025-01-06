// API URL for fetching product data
const apiUrl = 'https://mocki.io/v1/82663872-79f1-4d64-a17c-8d20e67db864';
let products = [];
let cart = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;

// Fetch product data from API
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        products = data.products;
        filteredProducts = [...products]; 
        displayProducts(filteredProducts, currentPage); 
        createPagination(filteredProducts);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

// Display products for the current page
function displayProducts(productArray, page) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear current products
    // If no products match the filter, display a message
    if (productArray.length === 0) {
        productList.innerHTML = '<p>No products available for the selected filters.</p>';
        return;
    }

    // Calculate the range of products to display based on the current page
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToDisplay = productArray.slice(start, end);

    // Create and append a card for each product to display
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            <button class="view-product-btn" onclick="viewProduct(${product.id})">View Product</button>
        `;
        productList.appendChild(productCard);
    });
}

// Create pagination buttons to navigate between pages
function createPagination(productArray) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Clear existing pagination

    const totalPages = Math.ceil(productArray.length / productsPerPage);

    // Generate a button for each page
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => goToPage(i);
        paginationDiv.appendChild(pageButton);
    }
}

// Navigate to a specific page and update the product display and pagination
function goToPage(page) {
    currentPage = page;
    displayProducts(filteredProducts, currentPage);
    createPagination(filteredProducts);
}

// Open product detail in popup
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>Availability: ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            ${cart.some(item => item.id === productId) ? 'Product already in cart' : 'Add to Cart'}
        </button>
        <button class='buy-product-btn' onclick="buyProduct(${product.id})">Buy Product</button>
    `;
    document.getElementById('product-popup').classList.remove('hidden');
}

// Close the popup
function closePopup() {
    document.getElementById('product-popup').classList.add('hidden');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(product => product.id === productId);
    if (!cart.some(item => item.id === productId)) {
        cart.push(product);
        document.getElementById('cart-count').textContent = cart.length;
        alert('Product added to cart!');
    } else {
        alert('Product is already in cart!');
    }
}

// Buy product
function buyProduct(productId) {
    alert("Thank you for buying the product!");
    closePopup();
}

// Toggle Cart Modal
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.length ? cart.map(item => `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>$${item.price}</p>
        </div>
    `).join('') : 'Your cart is empty';
    cartModal.classList.toggle('hidden');
}

// Event listener for search input to display suggestions
const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const suggestionsList = document.getElementById('suggestions-list');

searchInput.addEventListener('input', function() {
  const query = searchInput.value.toLowerCase();
  
  if (query) {
    const filteredSuggestions = products.filter(product => {
      return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    });

    if (filteredSuggestions.length > 0) {
      suggestionsContainer.style.display = 'block';
      suggestionsList.innerHTML = filteredSuggestions.map(product => {
        return `<li data-id="${product.id}">${product.name} (${product.category})</li>`;
      }).join('');
    } else {
      suggestionsContainer.style.display = 'none';
    }
  } else {
    suggestionsContainer.style.display = 'none';
  }
});

// Event listener to close suggestions if clicked outside the input field
document.addEventListener('click', function(event) {
  if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
    suggestionsContainer.style.display = 'none';
  }
});

// Handle selection of a product from the suggestions list
suggestionsList.addEventListener('click', function(event) {
  const productId = event.target.getAttribute('data-id');
  if (productId) {
    const selectedProduct = products.find(product => product.id == productId);
    searchInput.value = selectedProduct.name;
    suggestionsContainer.style.display = 'none';
    filteredProducts = [selectedProduct];
    
    // Display the selected product
    displayProducts(filteredProducts, 1);
    createPagination(filteredProducts);
  }
});

// Event listener to display suggestions when the search input is focused
searchInput.addEventListener('focus', function() {
  if (searchInput.value) {
    suggestionsContainer.style.display = 'block';
  }
});

// Search products when clicking the search button
function searchProducts() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  // Filter products based on search query
  filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
  ); 
  // Display filtered products
  displayProducts(filteredProducts, 1);
  // Update pagination
  createPagination(filteredProducts);
}

// Filter products based on all criteria
function applyFilters() {
    filteredProducts = products;
    // Apply category filter
    const category = document.getElementById('category-filter').value;
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    // Apply price filter
    const priceRange = document.getElementById('price-range').value;
    if (priceRange !== 'all') {
        const [min, max] = priceRange === '500+' ? [500, Infinity] : priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => product.price >= min && product.price <= max);
    }
    // Apply availability filter
    const availabilityFilter = document.getElementById('availability-filter').value;
    if (availabilityFilter !== 'all') {
        const isAvailable = availabilityFilter === 'in-stock';
        filteredProducts = filteredProducts.filter(product => product.availability === isAvailable);
    }
    currentPage = 1; // Reset to first page on filter
    displayProducts(filteredProducts, currentPage);
    createPagination(filteredProducts);
}

// Sort products by price after applying filters
function sortByPrice(order) {
    const sortedProducts = [...filteredProducts];
    sortedProducts.sort((a, b) => order === 'low-to-high' ? a.price - b.price : b.price - a.price);
    displayProducts(sortedProducts, currentPage); // Display the sorted products
    createPagination(sortedProducts); // Update pagination for sorted results
}

// Update filter methods to call `applyFilters`
function filterByPrice() {
    applyFilters();
}
function filterByCategory() {
    applyFilters();
}
function filterByAvailability() {
    applyFilters();
}
// Initialize the page
fetchProducts();