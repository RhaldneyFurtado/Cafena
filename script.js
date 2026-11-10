/*INTERATIVIDADE DO SITE (PESQUISA, CARRINHO E BOTÕES) */

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
    let encontrado = false;

    produtos.forEach((box) => {
      let nomeCafé = box.querySelector(".product-name");
      let nome = nomeCafé ? nomeCafé.innerText.toLowerCase() : "";

      if (termoBusca === "" || nome.includes(termoBusca)) {
        box.style.display = "block";

        /* Destaca visualmente o produto encontrado */
        if (termoBusca !== "" && nome.includes(termoBusca)) {
          encontrado = true;
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

/* Funcionalidade do ícone do carrinho (abre/fecha o painel) */
if (cartBtn) {
  cartBtn.onclick = (event) => {
    event.preventDefault();
    cartContainer.classList.toggle("active");
    if (searchForm) searchForm.classList.remove("active");
    if (navbar) navbar.classList.remove("active");
  };
}

/* Botão de fechar o painel do carrinho */
if (cartCloseBtn) {
  cartCloseBtn.onclick = () => {
    cartContainer.classList.remove("active");
  };
}

/* Funcionalidade de adicionar ao carrinho */
let botoesComprar = document.querySelectorAll(".add-to-cart-btn");

botoesComprar.forEach((botao) => {
  botao.onclick = (event) => {
    event.preventDefault();

    let cardProduto = botao.closest(".box");
    let nomeCafé = cardProduto.querySelector(".product-name").innerText;
    let precoCafé = cardProduto.querySelector(".product-price").innerText;
    let imagemCafé = cardProduto.querySelector("img").src;

    /* Verifica se o produto já existe no carrinho para incrementar a quantidade */
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

    /* Salva no localStorage e atualiza a interface */
    salvarCarrinho();
    atualizarCarrinhoUI();

    /* Feedback visual no botão */
    botao.innerText = "Adicionado ✓";
    botao.style.background = "#4caf50";

    setTimeout(() => {
      botao.innerText = "Adicionar ao Carrinho";
      botao.style.background = "";
    }, 1200);
  };
});

/* Salva o carrinho no localStorage do navegador */
function salvarCarrinho() {
  localStorage.setItem("cafena-cart", JSON.stringify(carrinho));
}

/* Atualizando a interface do carrinho */
function atualizarCarrinhoUI() {
  if (!cartItemsList) return;

  cartItemsList.innerHTML = "";
  let totalGeral = 0;
  let totalItens = 0;

  /* Exibe mensagem quando o carrinho está vazio */
  if (carrinho.length === 0) {
    cartItemsList.innerHTML = `<p class="cart-empty">Seu carrinho está vazio</p>`;
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

  /* Atualiza o valor total e o contador de itens */
  if (cartTotalPrice) {
    cartTotalPrice.innerText = totalGeral.toFixed(2).replace(".", ",");
  }
  if (cartCount) {
    cartCount.innerText = totalItens;
  }
}

/* Removendo um item do carrinho */
function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinhoUI();
}

/* Botão finalizar compra */
let checkoutBtn = document.querySelector("#checkout-btn");
if (checkoutBtn) {
  checkoutBtn.onclick = (event) => {
    event.preventDefault();

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    /* Monta um resumo do pedido para o usuário */
    let total = cartTotalPrice ? cartTotalPrice.innerText : "0,00";
    let resumo = carrinho
      .map((item) => `• ${item.nome} (${item.quantidade || 1}x)`)
      .join("\n");

    alert(
      `Pedido realizado com sucesso!\n\n${resumo}\n\nTotal: R$ ${total}\n\nObrigado por comprar na Cafena!`
    );

    /* Limpa o carrinho após a finalização */
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinhoUI();
    cartContainer.classList.remove("active");
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

/* Funcionalidade do botão hamburger (menu mobile) */
if (menuBtn && navbar) {
  menuBtn.onclick = (event) => {
    event.preventDefault();
    navbar.classList.toggle("active");
    cartContainer.classList.remove("active"); /* Fecha o carrinho se estiver aberto */
    if (searchForm) searchForm.classList.remove("active");
  };

  /* Fecha o menu ao clicar em qualquer link da navegação */
  document.querySelectorAll(".navbar a").forEach((link) => {
    link.onclick = () => {
      navbar.classList.remove("active");
    };
  });
}

/* Inicializa a interface do carrinho ao carregar a página */
atualizarCarrinhoUI();
