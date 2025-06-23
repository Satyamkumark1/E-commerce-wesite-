let ShoppingCart = document.getElementById("shopping-cart");
let label = document.getElementById("label");

/**
 * ! Basket to hold all the selected items
 * ? Retrieves data from localStorage, or initializes as empty array
 */
let basket = JSON.parse(localStorage.getItem("data")) || [];

/**
 * ! Updates the cart icon with the total number of items
 */
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

/**
 * ! Generates the Cart Page with product cards
 * ! Each card includes image, title, price, quantity controls, and total price
 * ? When basket is empty, shows 'Cart is Empty' message
 */
let generateCartItems = () => {
  if (basket.length !== 0) {
    ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((x) => x.id === id) || [];
        let { img, price, name } = search;
        return `
      <div class="cart-item" tabindex="0" aria-label="${name}, $${price} each, quantity ${item}">
        <img width="100" src=${img} alt="${name}" />
        <div class="details">
          <div class="title-price-x">
            <h4 class="title-price">
              <p>${name}</p>
              <p class="cart-item-price">$ ${price}</p>
            </h4>
            <i onclick="removeItem('${id}')" class="bi bi-x-lg" aria-label="Remove item"></i>
          </div>
          <div class="cart-buttons">
            <div class="buttons">
              <i onclick="decrement('${id}')" class="bi bi-dash-lg" aria-label="Decrease quantity"></i>
              <div id='${id}' class="quantity">${item}</div>
              <i onclick="increment('${id}')" class="bi bi-plus-lg" aria-label="Increase quantity"></i>
            </div>
          </div>
          <h3>$ ${item * price}</h3>
        </div>
      </div>
      `;
      })
      .join("");
    label.innerHTML = "";
  } else {
    ShoppingCart.innerHTML = "";
    label.innerHTML = `
    <h2>Your cart is empty!</h2>
    <p>Looks like you haven't added anything yet.</p>
    <a href="index.html">
      <button class="HomeBtn">Back to Home</button>
    </a>
    `;
  }
};

generateCartItems();

/**
 * ! Increases the selected product's quantity by 1 in the cart
 */
let increment = (id) => {
  let search = basket.find((x) => x.id === id);
  if (search === undefined) {
    basket.push({ id: id, item: 1 });
  } else {
    search.item += 1;
  }
  generateCartItems();
  update(id);
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! Decreases the selected product's quantity by 1 in the cart
 */
let decrement = (id) => {
  let search = basket.find((x) => x.id === id);
  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! Updates the quantity display for a product card in the cart
 */
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search && search.item ? search.item : 0;
  calculation();
  TotalAmount();
};

/**
 * ! Removes a product from the cart using the X button
 */
let removeItem = (id) => {
  basket = basket.filter((x) => x.id !== id);
  calculation();
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! Calculates and displays the total bill for all items in the cart
 */
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { id, item } = x;
        let filterData = shopItemsData.find((x) => x.id === id);
        return filterData.price * item;
      })
      .reduce((x, y) => x + y, 0);
    return (label.innerHTML = `
    <h2>Total Bill : $ ${amount}</h2>
    <button class="checkout">Checkout</button>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `);
  } else return;
};

TotalAmount();

/**
 * ! Clears the cart and removes everything from localStorage
 */
let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};
