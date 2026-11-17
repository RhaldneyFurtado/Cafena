/* INTERATIVIDADE DO SITE (PESQUISA, CARRINHO E BOTÕES) */

/* Selecionando os elementos principais no DOM */
let searchBtn = document.querySelector("#search-btn");
let cartBtn = document.querySelector("#cart-btn");
let cartContainer = document.querySelector(".cart-items-container");
let cartItemsList = document.querySelector("#cart-items-list");
let cartTotalPrice = document.querySelector("#cart-total-price");
let cartCount = document.querySelector("#cart-count");
let searchForm = document.querySelector(".search-form");
let searchInput = document.querySelector("#search-box");
let menuBtn = document.querySelector("#menu-btn");
let navbar = document.querySelector(".navbar");
let cartCloseBtn = document.querySelector(".cart-close");

/* Array para armazenar os produtos do carrinho (com persistência no localStorage) */
let carrinho = JSON.parse(localStorage.getItem("cafena-cart")) || [];

/* FUNCIONALIDADE DA BUSCA */

/* Funcionalidade do botão de pesquisa (abre/fecha o formulário) */
if (searchBtn && searchForm) {
  searchBtn.onclick = (event) => {
    event.preventDefault();
    searchForm.classList.toggle("active");
    cartContainer.classList.remove("active");
    if (navbar) navbar.classList.remove("active");

    /* Foca automaticamente no campo de busca quando aberto */
    if (searchForm.classList.contains("active") && searchInput) {
      searchInput.focus();
    }
  };
}

/* Filtra os produtos do menu em tempo real conforme o usuário digita */
if (searchInput) {
  searchInput.addEventListener("keyup", (event) => {
    let termoBusca = searchInput.value.toLowerCase().trim();
    let produtos = document.querySelectorAll(".menu .box");

    produtos.forEach((box) => {
      let nomeCafé = box.querySelector(".product-name");
      let nome = nomeCafé ? nomeCafé.innerText.toLowerCase() : "";

      if (termoBusca === "" || nome.includes(termoBusca)) {
        box.style.display = "block";

        if (termoBusca !== "" && nome.includes(termoBusca)) {
          box.style.border = "0.2rem solid var(--main-color)";
        } else {
          box.style.border = "";
        }
      } else {
        box.style.display = "none";
      }
    });

    /* Ao pressionar Enter, rola até o primeiro resultado encontrado */
    if (event.key === "Enter" && termoBusca !== "") {
      let primeiro = Array.from(produtos).find(
        (box) => box.style.display !== "none"
      );

      if (primeiro) {
        primeiro.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        alert("Desculpe, não encontramos nenhum café com esse nome no nosso menu.");
      }
    }
  });
}

/* FUNCIONALIDADE DO CARRINHO */

if (cartBtn) {
  cartBtn.onclick = (event) => {
    event.preventDefault();
    cartContainer.classList.toggle("active");
    if (searchForm) searchForm.classList.remove("active");
    if (navbar) navbar.classList.remove("active");
  };
}

if (cartCloseBtn) {
  cartCloseBtn.onclick = () => {
    cartContainer.classList.remove("active");
  };
}

/* Adicionar ao carrinho */
let botoesComprar = document.querySelectorAll(".add-to-cart-btn");

botoesComprar.forEach((botao) => {
  botao.onclick = (event) => {
    event.preventDefault();

    let cardProduto = botao.closest(".box");
    let nomeCafé = cardProduto.querySelector(".product-name").innerText;
    let precoCafé = cardProduto.querySelector(".product-price").innerText;
    let imagemCafé = cardProduto.querySelector("img").src;

    let itemExistente = carrinho.find((item) => item.nome === nomeCafé);

    if (itemExistente) {
      itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
      carrinho.push({
        nome: nomeCafé,
        preco: precoCafé,
        imagem: imagemCafé,
        quantidade: 1,
      });
    }

    salvarCarrinho();
    atualizarCarrinhoUI();

    botao.innerText = "Adicionado ✓";
    botao.style.background = "#4caf50";

    setTimeout(() => {
      botao.innerText = "Adicionar ao Carrinho";
      botao.style.background = "";
    }, 1200);
  };
});

function salvarCarrinho() {
  localStorage.setItem("cafena-cart", JSON.stringify(carrinho));
}

function atualizarCarrinhoUI() {
  if (!cartItemsList) return;

  cartItemsList.innerHTML = "";
  let totalGeral = 0;
  let totalItens = 0;

  if (carrinho.length === 0) {
    cartItemsList.innerHTML = `<p class="cart-empty" style="text-align:center; color:#aaa; margin-top:2rem;">Seu carrinho está vazio</p>`;
  } else {
    carrinho.forEach((item, index) => {
      let precoNumerico = parseFloat(item.preco.replace(",", "."));
      let quantidade = item.quantidade || 1;
      totalGeral += precoNumerico * quantidade;
      totalItens += quantidade;

      cartItemsList.innerHTML += `
        <div class="cart-item">
          <span class="remove-btn" onclick="removerItem(${index})">&times;</span>
          <img src="${item.imagem}" alt="${item.nome}">
          <div class="content">
            <h3>${item.nome}</h3>
            <div class="price">R$ ${item.preco}${quantidade > 1 ? ` × ${quantidade}` : ""}</div>
          </div>
        </div>
      `;
    });
  }

  if (cartTotalPrice) {
    cartTotalPrice.innerText = totalGeral.toFixed(2).replace(".", ",");
  }
  if (cartCount) {
    cartCount.innerText = totalItens;
  }
}

function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinhoUI();
}

let checkoutBtn = document.querySelector("#checkout-btn");
if (checkoutBtn) {
  checkoutBtn.onclick = (event) => {
    event.preventDefault();

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let total = cartTotalPrice ? cartTotalPrice.innerText : "0,00";
    let resumo = carrinho
      .map((item) => `• ${item.nome} (${item.quantidade || 1}x)`)
      .join("\n");

    alert(
      `Pedido realizado com sucesso!\n\n${resumo}\n\nTotal: R$ ${total}\n\nObrigado por comprar na Cafena!`
    );

    carrinho = [];
    salvarCarrinho();
    atualizarCarrinhoUI();
    cartContainer.classList.remove("active");
  };
}

/* Botão Saiba Mais */
let saberMaisBtn = document.querySelector("#saber-mais-btn");
let moreText = document.querySelector("#more-text");

if (saberMaisBtn && moreText) {
  saberMaisBtn.onclick = (event) => {
    event.preventDefault();
    moreText.classList.toggle("show");
    saberMaisBtn.innerText = moreText.classList.contains("show")
      ? "Mostrar Menos"
      : "Saiba Mais";
  };
}

/* FUNCIONALIDADE DO MENU HAMBÚRGUER (MOBILE) */
if (menuBtn && navbar) {
  menuBtn.onclick = (event) => {
    event.preventDefault();
    navbar.classList.toggle("active");
    cartContainer.classList.remove("active");
    if (searchForm) searchForm.classList.remove("active");
  };

  document.querySelectorAll(".navbar a").forEach((link) => {
    link.onclick = () => {
      navbar.classList.remove("active");
    };
  });
}

/* Fecha elementos ao rolar a página */
window.onscroll = () => {
  if (navbar) navbar.classList.remove("active");
  if (searchForm) searchForm.classList.remove("active");
};

atualizarCarrinhoUI();
