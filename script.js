const apiUrl = 'https://mocki.io/v1/107aa1d2-e1b4-4ece-ae93-420ca5564301';
let products = [];
let currentPage = 1;
let totalPages = 1;
const perPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('search').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('price-filter').addEventListener('change', filterProducts);
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
});

async function loadProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        products = data.products;
        totalPages = data.pagination.total_pages;
        displayProducts();
    } catch (error) {
        document.getElementById('error-message').textContent = 'Failed to load products. Please try again later.';
    }
}

function displayProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear previous products
    const filteredProducts = filterProducts();
    const startIndex = (currentPage - 1) * perPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product');
        productCard.innerHTML = `
            <img data-src="${product.image}" alt="${product.name}" class="lazy-image" />
            <div class="product-details">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <p>${product.availability ? 'In Stock' : 'Out of Stock'}</p>
            </div>
        `;
        container.appendChild(productCard);
    });

    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;

    lazyLoadImages();
}

function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value.split('-');

    return products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm) &&
            (category === '' || product.category === category) &&
            (priceRange.length < 2 || (product.price >= priceRange[0] && product.price <= (priceRange[1] || Infinity)))
        );
    });
}

function changePage(direction) {
    currentPage += direction;
    displayProducts();
}

function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy-image');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, options);

    images.forEach(image => observer.observe(image));
}
