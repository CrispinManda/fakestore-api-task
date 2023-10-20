// Define a Product class to represent products
class Product {
    constructor(id, title, price, description, category, image, rating) {
      this.id = id;
      this.title = title;
      this.price = price;
      this.description = description;
      this.category = category;
      this.image = image;
      this.rating = rating;
    }
  }
  
  // Define a CartItem class to represent items in the cart
  class CartItem {
    constructor(product, quantity) {
      this.product = product;
      this.quantity = quantity;
    }
  
    // Calculate the subtotal for the item
    getSubtotal() {
      return this.product.price * this.quantity;
    }
  }
  
  // Define a ShoppingCart class to manage the shopping cart
  class ShoppingCart {
    constructor() {
      this.items = []; // Array to store CartItem objects
    }
  
    // Add a product to the cart
    addToCart(product, quantity) {
      const existingItem = this.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push(new CartItem(product, quantity));
      }
    }
  
    // Remove a product from the cart
    removeFromCart(product) {
      const index = this.items.findIndex((item) => item.product.id === product.id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  
    // Calculate the total price of items in the cart
    calculateTotalPrice() {
      return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }
  
    // Clear the cart
    clearCart() {
      this.items = [];
    }
  }
  
  // Define a ProductList class to display products
  class ProductList {
    constructor(products, categories) {
      this.products = products;
      this.categories = categories;
    }
  
    // Display a list of products
    displayProducts() {
      const productContainer = document.getElementById('product-list');
      productContainer.innerHTML = '';
  
      this.products.forEach((product) => {
        // Create product card HTML elements and append them to the productContainer
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-3';
  
        // Build the product card using Bootstrap classes and product information
        productCard.innerHTML = `
          <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">$${product.price.toFixed(2)}</p>
              <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
          </div>
        `;
  
        productContainer.appendChild(productCard);
      });
    }
  
    // Display a list of categories
    displayCategories() {
      const categoryList = document.getElementById('category-list');
      categoryList.innerHTML = '';
  
      // Add an "All" category option
      const allCategoryOption = document.createElement('li');
      allCategoryOption.className = 'list-group-item';
      allCategoryOption.innerText = 'All';
      allCategoryOption.onclick = () => this.filterProductsByCategory('all');
      categoryList.appendChild(allCategoryOption);
  
      // Add individual category options
      this.categories.forEach((category) => {
        const categoryOption = document.createElement('li');
        categoryOption.className = 'list-group-item';
        categoryOption.innerText = category;
        categoryOption.onclick = () => this.filterProductsByCategory(category);
        categoryList.appendChild(categoryOption);
      });
    }
  
    // Filter and display products based on the selected category
    filterProductsByCategory(category) {
      const filteredProducts = category === 'all'
        ? this.products
        : this.products.filter((product) => product.category === category);
  
      this.displayProducts(filteredProducts);
    }
  }
  
  // Create instances of the classes and fetch products from the API
  const shoppingCart = new ShoppingCart();
  const productList = new ProductList([], []);
  
  // Fetch products from the API
  fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
      // Initialize the ProductList with fetched products and categories
      productList.products = data.map((product) => new Product(
        product.id,
        product.title,
        product.price,
        product.description,
        product.category,
        product.image,
        product.rating
      ));
      productList.categories = [...new Set(data.map((product) => product.category))];
  
      // Display products and categories
      productList.displayProducts();
      productList.displayCategories();
    })
    .catch((error) => console.error('Error fetching products:', error));
  
  // Function to add a product to the cart
  function addToCart(productId) {
    const product = productList.products.find((p) => p.id === productId);
    if (product) {
      shoppingCart.addToCart(product, 1);
      updateCartDisplay();
    }
  }
  
  // Function to update the cart display
  function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    cartItemsContainer.innerHTML = '';
    cartSummary.innerHTML = '';
  
    shoppingCart.items.forEach((cartItem) => {
      // Create cart item HTML elements and append them to cartItemsContainer
      const cartItemElement = document.createElement('li');
      cartItemElement.className = 'list-group-item d-flex justify-content-between align-items-center';
      cartItemElement.innerHTML = `
        ${cartItem.product.title}
        <span>$${cartItem.getSubtotal().toFixed(2)}</span>
      `;
  
      // Add a button to remove the item from the cart
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn-danger btn-sm';
      removeButton.innerText = 'Remove';
      removeButton.onclick = () => removeFromCart(cartItem.product.id);
  
      cartItemElement.appendChild(removeButton);
      cartItemsContainer.appendChild(cartItemElement);
    });
  
    // Display the total price in the cart summary
    const total = shoppingCart.calculateTotalPrice();
    cartSummary.innerHTML = `Total: $${total.toFixed(2)}`;
  }
  
  // Function to remove a product from the cart
  function removeFromCart(productId) {
    const product = productList.products.find((p) => p.id === productId);
    if (product) {
      shoppingCart.removeFromCart(product);
      updateCartDisplay();
    }
  }
  
  // Function to clear the cart
  function clearCart() {
    shoppingCart.clearCart();
    updateCartDisplay();
  }
  