const apiURL = 'https://mocki.io/v1/107aa1d2-e1b4-4ece-ae93-420ca5564301';
const productList = document.getElementById('product-list');
const pagination = document.getElementById('pagination');
const searchBar = document.getElementById('search-bar');
const priceFilter = document.getElementById('price-filter');
const categoryFilter = document.getElementById('category-filter');
const availabilityFilter = document.getElementById('availability-filter');

let currentPage = 1;
let totalPages = 1;
let products = [];

// Fetch product data
async function fetchProducts() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    products = data.products;
    totalPages = data.pagination.total_pages;
    renderProducts(products);
    renderPagination();
  } catch (error) {
    productList.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
}

// Render products
function renderProducts(products) {
    const productList = document.querySelector('#product-list');
    productList.innerHTML = ''; // Clear previous products
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <h2>${product.name}</h2>
        <p>$${product.price}</p>
        <p>${product.availability ? 'In Stock' : 'Out of Stock'}</p>
        <p>${product.description}</p>
      `;
      productList.appendChild(productCard);
    });
  }
  

// Render pagination
function renderPagination() {
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => changePage(i));
    if (i === currentPage) {
      pageButton.classList.add('disabled');
    }
    pagination.appendChild(pageButton);
  }
}

// Change page
function changePage(page) {
  currentPage = page;
  // Filter and render new data based on page
  renderProducts(products);
  renderPagination();
}

// Search functionality
searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
  renderProducts(filteredProducts);
});

// Filter functionality
function filterProducts() {
  let filtered = products;

  // Filter by price
  const priceRange = priceFilter.value;
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-');
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
  }

  // Filter by category
  const category = categoryFilter.value;
  if (category !== 'all') {
    filtered = filtered.filter(product => product.category === category);
  }

  // Filter by availability
  const availability = availabilityFilter.value;
  if (availability !== 'all') {
    const isAvailable = availability === 'available';
    filtered = filtered.filter(product => product.availability === isAvailable);
  }

  renderProducts(filtered);
}

priceFilter.addEventListener('change', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
availabilityFilter.addEventListener('change', filterProducts);

// Initialize
fetchProducts();
