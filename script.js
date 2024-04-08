const addToCartBtn = document.querySelectorAll(".add-to-cart-btn");
const cartButton = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModal = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const inputAddress = document.getElementById("address");
const modalWarning = document.getElementById("address-warning");
const spanItem = document.getElementById("date-span");

const cart = [];

//Restaurante aberto?
function checkOpened() {
  const data = new Date();
  const hour = data.getHours();
  return hour >= 18 && hour <= 22;
}

const isOpen = checkOpened();

if (!isOpen) {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}

//Abrir modal carrinho.
cartButton.addEventListener("click", () => {
  cartModal.style.display = "flex";
  updateCartModal();
});

//Fechar o modal quando clicar fora.
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//Fechar o modal quando clicar fechar.
closeModal.addEventListener("click", () => {
  cartModal.style.display = "none";
});

//Adicionar ao carrinho.
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
    return;
  }
  cart.push({ name: name, price: price, quantity: 1 });
}

//Click nos botões dos itens adiciona ao carrinho.
addToCartBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const name = e.target.closest(".add-to-cart-btn").getAttribute("data-name");
    const price = parseFloat(
      e.target.closest(".add-to-cart-btn").getAttribute("data-price")
    );
    addToCart(name, price);
    updateCartModal();
  });
});

//Atualiza Carrinho
function updateCartModal() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold ">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-cart-item" data-name="${item.name}">
                Remover
            </button>
            
        </div>
    `;
    cartItems.appendChild(cartItemElement);

    total += item.quantity * item.price;
  });
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.textContent = cart.length;
}

//Remover item do carrinho
function removeItem(name) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem.quantity > 1) {
    existingItem.quantity--;
    return;
  }
  cart.pop(existingItem);
}

//Clicar no botão remover.
cartItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-cart-item")) {
    removeItem(e.target.getAttribute("data-name"));
    updateCartModal();
  }
});

//Monitorar o endereço
inputAddress.addEventListener("input", (e) => {
  if (isOpen) {
    modalWarning.classList.add("hidden");
    inputAddress.classList.remove("border-red-500");
  }
});

//Finalizar carrinho
checkoutBtn.addEventListener("click", () => {
  if (cart.length < 1) {
    return;
  }
  if (!isOpen) {
    modalWarning.classList.remove("hidden");
    modalWarning.textContent = "Restaurante fechado.";
    return;
  }
  if (!inputAddress.value) {
    modalWarning.classList.remove("hidden");
    inputAddress.classList.add("border-red-500");
  }
  //Envia pro Zap
  const checkoutItems = cart
    .map((item) => {
      return `  ${item.name}
    Quantidade: ${item.quantity}
    Preço: R$ ${item.price}
      `;
    })
    .join("");

  const message =
    `
  ${encodeURIComponent(checkoutItems)}` +
    "/n" +
    `   Endereço: ${inputAddress.value}
    *Total: ${cartTotal.textContent}*`;
  const phone = "62991184403";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();
});
