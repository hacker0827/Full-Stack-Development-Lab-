const products = [
  {
    id: 1,
    name: "Tailored Linen Blazer",
    category: "Women",
    price: 3299,
    oldPrice: 4599,
    rating: 4.8,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    description: "Relaxed-fit blazer with clean lapels and a breathable summer-weight weave."
  },
  {
    id: 2,
    name: "Street Utility Jacket",
    category: "Men",
    price: 2899,
    oldPrice: 3799,
    rating: 4.6,
    badge: "New",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    description: "Modern utility layer with oversized pockets and a crisp urban silhouette."
  },
  {
    id: 3,
    name: "Sculpted Satin Dress",
    category: "Women",
    price: 4199,
    oldPrice: 5499,
    rating: 4.9,
    badge: "Editor's Pick",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    description: "Bias-cut evening dress designed for fluid movement and polished occasion wear."
  },
  {
    id: 4,
    name: "Minimal Leather Sneakers",
    category: "Footwear",
    price: 2599,
    oldPrice: 3199,
    rating: 4.7,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Low-top sneakers with tonal panels and cushioned comfort for daily rotation."
  },
  {
    id: 5,
    name: "Structured Tote Bag",
    category: "Accessories",
    price: 2199,
    oldPrice: 2899,
    rating: 4.5,
    badge: "New",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    description: "Smart carry-all tote with sharp edges, ample storage, and premium detailing."
  },
  {
    id: 6,
    name: "Co-ord Cargo Set",
    category: "Men",
    price: 3899,
    oldPrice: 4999,
    rating: 4.4,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
    description: "A coordinated set featuring a relaxed overshirt and tapered cargo trousers."
  },
  {
    id: 7,
    name: "Pleated Midi Skirt",
    category: "Women",
    price: 1999,
    oldPrice: 2699,
    rating: 4.6,
    badge: "Fresh Drop",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
    description: "Soft pleats and understated shine make this an easy day-to-evening essential."
  },
  {
    id: 8,
    name: "Contrast Strap Heels",
    category: "Footwear",
    price: 3099,
    oldPrice: 3999,
    rating: 4.7,
    badge: "Occasion",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
    description: "Strappy heels with a sculpted block heel and a clean contrast palette."
  },
  {
    id: 9,
    name: "Oversized Knit Polo",
    category: "Men",
    price: 2399,
    oldPrice: 3199,
    rating: 4.5,
    badge: "Weekend Edit",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    description: "Soft knit polo with dropped shoulders and a refined relaxed fit."
  },
  {
    id: 10,
    name: "Pleated Shoulder Bag",
    category: "Accessories",
    price: 1899,
    oldPrice: 2499,
    rating: 4.4,
    badge: "Daily Carry",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80",
    description: "Compact shoulder bag with pleated detail and a polished city-ready profile."
  },
  {
    id: 11,
    name: "Textured Resort Shirt",
    category: "Men",
    price: 1799,
    oldPrice: 2399,
    rating: 4.6,
    badge: "Summer",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "Open-collar shirt in a breezy textured fabric for laid-back styling."
  },
  {
    id: 12,
    name: "Canvas Platform Trainers",
    category: "Footwear",
    price: 2699,
    oldPrice: 3499,
    rating: 4.7,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    description: "Cushioned trainers with a bold platform sole and an easy everyday finish."
  }
];

const state = {
  category: "All",
  sortBy: "featured",
  query: "",
  wishlist: new Set(),
  cart: []
};

const productGrid = document.getElementById("productGrid");
const categoryFilters = document.getElementById("categoryFilters");
const productCount = document.getElementById("productCount");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");
const bagItems = document.getElementById("bagItems");
const wishlistItems = document.getElementById("wishlistItems");
const bagItemCount = document.getElementById("bagItemCount");
const bagSubtotal = document.getElementById("bagSubtotal");
const bagSidebarElement = document.getElementById("bagSidebar");

const bagSidebar = bootstrap.Offcanvas.getOrCreateInstance(bagSidebarElement);

const categories = ["All", ...new Set(products.map((product) => product.category))];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getVisibleProducts() {
  const query = state.query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const matchesQuery = !query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  switch (state.sortBy) {
    case "lowToHigh":
      return filtered.sort((a, b) => a.price - b.price);
    case "highToLow":
      return filtered.sort((a, b) => b.price - a.price);
    case "rating":
      return filtered.sort((a, b) => b.rating - a.rating);
    default:
      return filtered.sort((a, b) => a.id - b.id);
  }
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function getCartCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
  return state.cart.reduce((total, item) => {
    const product = getProductById(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderCategoryFilters() {
  categoryFilters.innerHTML = categories.map((category) => `
    <button
      class="filter-btn ${state.category === category ? "active" : ""}"
      type="button"
      data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <h3>No styles match your search.</h3>
          <p>Try a different keyword or switch to another category.</p>
        </div>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => `
    <div class="col-md-6 col-xl-3">
      <article class="product-card h-100">
        <div class="product-image" style="background-image: url('${product.image}')">
          <div class="product-top-badges">
            <span class="tag">${product.badge}</span>
            <div class="price-tag">
              <strong>${formatPrice(product.price)}</strong>
              <span>Limited offer</span>
            </div>
          </div>
          <div class="product-overlay">
            <button class="wishlist-toggle ${state.wishlist.has(product.id) ? "active" : ""}" type="button" data-wishlist-id="${product.id}" aria-label="Toggle wishlist">
              <i class="bi ${state.wishlist.has(product.id) ? "bi-heart-fill" : "bi-heart"}"></i>
            </button>
          </div>
        </div>
        <div class="product-body d-flex flex-column h-100">
          <div class="product-topline">
            <span class="eyebrow mb-0">${product.category}</span>
            <span class="old-price">${formatPrice(product.oldPrice)}</span>
          </div>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="rating-line">
            <span><strong>${product.rating}</strong> / 5</span>
            <span>${product.badge}</span>
          </div>
          <div class="product-footer mt-auto">
            <span class="price">${formatPrice(product.price)}</span>
          </div>
          <div class="product-actions">
            <button class="wishlist-btn ${state.wishlist.has(product.id) ? "active" : ""}" type="button" data-wishlist-id="${product.id}">
              ${state.wishlist.has(product.id) ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button class="cart-btn" type="button" data-cart-id="${product.id}">Add to Bag</button>
            <button class="buy-btn" type="button" data-buy-id="${product.id}">Buy Now</button>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

function updateCounts() {
  cartCount.textContent = getCartCount();
  wishlistCount.textContent = state.wishlist.size;
}

function renderBag() {
  if (!state.cart.length) {
    bagItems.innerHTML = `
      <div class="sidebar-empty">
        <h6 class="mb-2">Your bag is empty.</h6>
        <p class="mb-0">Add a product and this sidebar will open automatically.</p>
      </div>
    `;
    bagItemCount.textContent = "0";
    bagSubtotal.textContent = formatPrice(0);
    return;
  }

  bagItems.innerHTML = state.cart.map((item) => {
    const product = getProductById(item.id);
    return `
      <article class="sidebar-item">
        <div class="sidebar-thumb" style="background-image: url('${product.image}')"></div>
        <div>
          <p class="eyebrow mb-1">${product.category}</p>
          <h6>${product.name}</h6>
          <p>${formatPrice(product.price)}</p>
          <div class="sidebar-actions">
            <span class="qty-badge">x${item.quantity}</span>
            <button class="link-btn" type="button" data-remove-cart="${product.id}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  bagItemCount.textContent = getCartCount();
  bagSubtotal.textContent = formatPrice(getCartSubtotal());
}

function renderWishlist() {
  const wishlistProducts = products.filter((product) => state.wishlist.has(product.id));

  if (!wishlistProducts.length) {
    wishlistItems.innerHTML = `
      <div class="sidebar-empty">
        <h6 class="mb-2">No saved products yet.</h6>
        <p class="mb-0">Tap the heart icon on any product to add it here.</p>
      </div>
    `;
    return;
  }

  wishlistItems.innerHTML = wishlistProducts.map((product) => `
    <article class="sidebar-item">
      <div class="sidebar-thumb" style="background-image: url('${product.image}')"></div>
      <div>
        <p class="eyebrow mb-1">${product.category}</p>
        <h6>${product.name}</h6>
        <p>${formatPrice(product.price)}</p>
        <div class="sidebar-actions">
          <button class="link-btn" type="button" data-add-from-wishlist="${product.id}">Move to Bag</button>
          <button class="link-btn" type="button" data-remove-wishlist="${product.id}">Remove</button>
        </div>
      </div>
    </article>
  `).join("");
}

function render() {
  renderCategoryFilters();
  renderProducts();
  renderBag();
  renderWishlist();
  updateCounts();
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) {
    return;
  }

  state.category = button.dataset.category;
  render();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sortBy = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const wishlistButton = event.target.closest("[data-wishlist-id]");
  const cartButton = event.target.closest("[data-cart-id]");
  const buyButton = event.target.closest("[data-buy-id]");

  if (wishlistButton) {
    const id = Number(wishlistButton.dataset.wishlistId);
    if (state.wishlist.has(id)) {
      state.wishlist.delete(id);
    } else {
      state.wishlist.add(id);
    }
    render();
    return;
  }

  if (cartButton) {
    const id = Number(cartButton.dataset.cartId);
    const existingItem = state.cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({ id, quantity: 1 });
    }

    render();
    bagSidebar.show();
    cartButton.textContent = "Added";
    cartButton.disabled = true;
    window.setTimeout(() => {
      cartButton.textContent = "Add to Bag";
      cartButton.disabled = false;
    }, 900);
  }

  if (buyButton) {
    const id = Number(buyButton.dataset.buyId);
    const existingItem = state.cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({ id, quantity: 1 });
    }

    render();
    bagSidebar.show();
  }
});

bagItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-cart]");
  if (!removeButton) {
    return;
  }

  const id = Number(removeButton.dataset.removeCart);
  state.cart = state.cart.filter((item) => item.id !== id);
  render();
});

wishlistItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-wishlist]");
  const addButton = event.target.closest("[data-add-from-wishlist]");

  if (removeButton) {
    const id = Number(removeButton.dataset.removeWishlist);
    state.wishlist.delete(id);
    render();
    return;
  }

  if (addButton) {
    const id = Number(addButton.dataset.addFromWishlist);
    const existingItem = state.cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({ id, quantity: 1 });
    }

    render();
    bagSidebar.show();
  }
});

document.getElementById("cartButton").addEventListener("click", () => {
  renderBag();
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email || !email.includes("@")) {
    newsletterMessage.textContent = "Enter a valid email address.";
    return;
  }

  newsletterMessage.textContent = "You're in. Member offers will land in your inbox soon.";
  newsletterForm.reset();
});

render();
