function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(sku, element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.className = className;
    e.classList.add(sku);
  } else {
    e.className = className;
  }
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id:sku, title:name, thumbnail:image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement(sku, 'span', 'item__sku', sku));
  section.appendChild(createCustomElement(sku, 'span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement(sku, 'button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

  // coloque seu código aqui
  event.target.remove();
  saveCartItems();
  sumSubtotal();
}

function createCartItemElement({ id:sku, title:name, price:salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.classList.add(sku);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sumSubtotal = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const totalPrice = document .querySelector('.total-price');
  let subTotal = 0;
  let valor = false;
  let string = '';
  cartItem.forEach((element) => {
    let elementString = element.outerHTML;
    for (let index = 0; index < elementString.length; index += 1) {
      if (elementString[index] === '$' || valor === true) {
        if (elementString[index] === '<') {
          break;
        }
        valor = true;
        string += elementString[index];
      }
    }
    string = string.replace('$', '');
    subTotal += parseFloat(string);
    string ='';
    valor = false
  });
  subTotal = Math.round(subTotal * 100) / 100;
  totalPrice.innerText = `${subTotal}`;
}

window.onload = () => {
  const addChildrenSectionItems = async () => {
    const items = document.querySelector('.items');
    const results = await fetchProducts();
    results.forEach(element => {
      items.appendChild(createProductItemElement(element));
    });
    funcCartItems();
  };
  
  const funcCartItems = async () => {
    const cartItems = document.querySelector('.cart__items');
    const itemButton = document.querySelectorAll('.item__add');
    itemButton.forEach((element) => {
      element.addEventListener('click', async (event) => {
        const itemObject = await fetchItem(event.target.classList[1]);
        cartItems.appendChild(createCartItemElement(itemObject));
        saveCartItems();
        sumSubtotal();
      });
    });
    getSavedCartItems();
    sumSubtotal();
    removeProductFromCart();
  };

  const removeProductFromCart = () => {
    const cartsItemsLi = document.querySelectorAll('.cart__item');
    cartsItemsLi.forEach((element) => {
      element.addEventListener('click', cartItemClickListener);
    });
  }
  addChildrenSectionItems();
};