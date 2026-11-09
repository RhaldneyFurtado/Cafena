/* ==========================================
   INTERATIVIDADE DO SITE (PESQUISA, CARRINHO E BOTÕES)
   ========================================== */

/* Selecionando os elementos principais no DOM */
let searchBtn = document.querySelector("#search-btn");
let cartBtn = document.querySelector("#cart-btn");
let cartContainer = document.querySelector(".cart-items-container");
let cartItemsList = document.querySelector("#cart-items-list");
let cartTotalPrice = document.querySelector("#cart-total-price");
let cartCount = document.querySelector("#cart-count");

/* Array para armazenar os produtos do carrinho */
let carrinho = [];

/* Funcionalidade do botão de pesquisa */
if (searchBtn) {
  searchBtn.onclick = (event) => {
    event.preventDefault();
    cartContainer.classList.remove("active");

    let termoBusca = prompt("Digite o nome do café que você está procurando:");

    if (termoBusca) {
      termoBusca = termoBusca.toLowerCase().trim();
      let produtos = document.querySelectorAll(".menu .box");
      let encontrado = false;

      produtos.forEach((box) => {
        let nomeCafé = box
          .querySelector(".product-name")
          .innerText.toLowerCase();

        if (nomeCafé.includes(termoBusca)) {
          encontrado = true;
          box.scrollIntoView({ behavior: "smooth", block: "center" });

          box.style.border = "0.2rem solid var(--main-color)";
          setTimeout(() => {
            box.style.border = "var(--border)";
          }, 3000);
        }
      });

      if (!encontrado) {
        alert(
          "Desculpe, não encontramos nenhum café com esse nome no nosso menu.",
        );
      }
    }
  };
}

/* Funcionalidade do ícone do carrinho */
if (cartBtn) {
  cartBtn.onclick = (event) => {
    event.preventDefault();
    cartContainer.classList.toggle("active");
  };
}

/* Funcionalidade de adicionar ao carrinho */
let botoesComprar = document.querySelectorAll(".add-to-cart-btn");

botoesComprar.forEach((botao) => {
  botao.onclick = (event) => {
    event.preventDefault();

    let cardProduto = botao.parentElement;
    let nomeCafé = cardProduto.querySelector(".product-name").innerText;
    let precoCafé = cardProduto.querySelector(".product-price").innerText;
    let imagemCafé = cardProduto.querySelector("img").src;

    carrinho.push({ nome: nomeCafé, preco: precoCafé, imagem: imagemCafé });

    /* Atualiza apenas o contador e a lista interna, sem abrir o painel */
    atualizarCarrinhoUI();
  };
});

/* Atualizando a interface do carrinho */
function atualizarCarrinhoUI() {
  cartItemsList.innerHTML = "";
  let totalGeral = 0;

  carrinho.forEach((item, index) => {
    let precoNumerico = parseFloat(item.preco.replace(",", "."));
    totalGeral += precoNumerico;

    cartItemsList.innerHTML += `
            <div class="cart-item">
                <span class="remove-btn" onclick="removerItem(${index})">&times;</span>
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="content">
                    <h3>${item.nome}</h3>
                    <div class="price">R$ ${item.preco}</div>
                </div>
            </div>
        `;
  });

  cartTotalPrice.innerText = totalGeral.toFixed(2).replace(".", ",");
  cartCount.innerText = carrinho.length;
}

/* Removendo um item do carrinho */
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinhoUI();
}

/* Botão finalizar compra */
let checkoutBtn = document.querySelector("#checkout-btn");
if (checkoutBtn) {
  checkoutBtn.onclick = (event) => {
    event.preventDefault();
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
    } else {
      alert("Obrigado pela compra! Pedido finalizado com sucesso.");
      carrinho = [];
      atualizarCarrinhoUI();
      cartContainer.classList.remove("active");
    }
  };
}

/* Funcionalidade do botão Saiba Mais */
let saberMaisBtn = document.querySelector("#saber-mais-btn");
let moreText = document.querySelector("#more-text");

if (saberMaisBtn && moreText) {
  saberMaisBtn.onclick = (event) => {
    event.preventDefault();
    moreText.classList.toggle("show");

    if (moreText.classList.contains("show")) {
      saberMaisBtn.innerText = "Mostrar Menos";
    } else {
      saberMaisBtn.innerText = "Saiba Mais";
    }
  };
}
