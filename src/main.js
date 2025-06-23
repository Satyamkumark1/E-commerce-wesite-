let shop = document.getElementById("shop");

/**
 * ! Basket to hold all the selected items
 * ? Retrieves data from localStorage, or initializes as empty array
 */

let basket = JSON.parse(localStorage.getItem("data")) || [];

/**
 * ! Generates the shop with product cards
 * ! Each card includes image, title, price, description, and quantity controls
 */

let generateShop = () => {
  if (!shopItemsData || shopItemsData.length === 0) {
    shop.innerHTML = '<div class="text-center"><h2>No products available at the moment. Please check back later!</h2></div>';
    return;
  }
  shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, desc, img, price } = x;
      let search = basket.find((y) => y.id === id) || [];
      return `
    <div id=product-id-${id} class="item" tabindex="0" aria-label="${name}, $${price}">
      <img width="220" src=${img} alt="${name}">
      <div class="details">
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="price-quantity">
          <h2>$ ${price} </h2>
          <div class="buttons">
            <i onclick="decrement('${id}')" class="bi bi-dash-lg" aria-label="Decrease quantity"></i>
            <div id='${id}' class="quantity">${search.item === undefined ? 0 : search.item}</div>
            <i onclick="increment('${id}')" class="bi bi-plus-lg" aria-label="Increase quantity"></i>
          </div>
        </div>
      </div>
    </div>
    `;
    })
    .join("");
};

generateShop();

/**
 * ! Increases the selected product's quantity by 1
 */

let increment = (id) => {
  let search = basket.find((x) => x.id === id);
  if (search === undefined) {
    basket.push({ id: id, item: 1 });
  } else {
    search.item += 1;
  }
  update(id);
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! Decreases the selected product's quantity by 1
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
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! Updates the quantity display for a product card
 */

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search && search.item ? search.item : 0;
  calculation();
};

/**
 * ! Calculates and updates the total number of items in the cart icon
 */

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();
