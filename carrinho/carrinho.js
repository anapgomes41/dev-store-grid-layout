document.addEventListener('DOMContentLoaded', () => {

    const carrinhoProdutosContainer = document.querySelector('.carrinho-de-compras__produtos');
    const subtotalProdutos = document.getElementById('subtotal-produtos');
    const valorFrete = document.getElementById('valor-frete');
    const valorTotalCarrinho = document.getElementById('valor-total-carrinho');
    const numProdutosSpan = document.getElementById('num-produtos');

    // Função para salvar o carrinho no localStorage
    const salvarCarrinho = (carrinho) => {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarTotais(carrinho);
    };
    
    // Função para renderizar os produtos na tela
    const renderizarCarrinho = () => {
        // Pega o carrinho do localStorage
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Limpa o conteúdo atual para não duplicar
        carrinhoProdutosContainer.innerHTML = '<h3 class="carrinho-de-compras__produtos_titulo">Detalhes da compra</h3>';

        if (carrinho.length === 0) {
            carrinhoProdutosContainer.innerHTML += '<p style="text-align: center; margin-top: 20px;">Seu carrinho está vazio.</p>';
            numProdutosSpan.textContent = `0 Produtos`;
            subtotalProdutos.textContent = `R$ 0,00`;
            valorTotalCarrinho.textContent = `R$ 0,00`;
            return;
        }

        carrinho.forEach((produto, index) => {
            const itemHTML = `
                <div class="item-carrinho" data-index="${index}">
                    <img src="${produto.imagemSrc}" alt="${produto.nome}" class="item-carrinho__imagem">
                    <div class="item-carrinho__detalhes">
                        <h4 class="item-carrinho__nome">${produto.nome}</h4>
                        <p class="item-carrinho__descricao">Tamanho: ${produto.tamanho.toUpperCase()}</p>
                        <p class="item-carrinho__preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="item-carrinho__opcoes">
                        <div class="item-carrinho__opcoes_quantidade">
                            <span>Quantidade:</span>
                            <div class="quantidade-controle">
                                <button class="btn-diminuir-item">-</button>
                                <input type="number" class="quantidade-item" value="${produto.quantidade}" min="1">
                                <button class="btn-aumentar-item">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="item-carrinho__excluir">Excluir</button>
                </div>
            `;
            carrinhoProdutosContainer.innerHTML += itemHTML;
        });

        atualizarTotais(carrinho);
    };

    // Função para atualizar os totais do carrinho
    const atualizarTotais = (carrinho) => {
        let subtotal = 0;
        let quantidadeTotal = 0;

        carrinho.forEach(item => {
            subtotal += item.preco * item.quantidade;
            quantidadeTotal += item.quantidade;
        });

        // O valor do frete pode ser um valor fixo ou calculado
        const frete = 8.00; // Valor fixo de exemplo
        const total = subtotal + frete;

        numProdutosSpan.textContent = `${quantidadeTotal} Produto${quantidadeTotal > 1 ? 's' : ''}`;
        subtotalProdutos.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        valorFrete.textContent = frete.toFixed(2).replace('.', ',');
        valorTotalCarrinho.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    // Adiciona ouvintes de eventos para os botões de quantidade e de exclusão
    carrinhoProdutosContainer.addEventListener('click', (e) => {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const itemElement = e.target.closest('.item-carrinho');
        if (!itemElement) return;

        const index = parseInt(itemElement.dataset.index);

        if (e.target.classList.contains('btn-aumentar-item')) {
            carrinho[index].quantidade++;
        } else if (e.target.classList.contains('btn-diminuir-item')) {
            if (carrinho[index].quantidade > 1) {
                carrinho[index].quantidade--;
            }
        } else if (e.target.classList.contains('item-carrinho__excluir')) {
            carrinho.splice(index, 1);
        } else {
            return;
        }

        salvarCarrinho(carrinho);
        renderizarCarrinho(); // Renderiza novamente para refletir as mudanças
    });

    // Ouve a mudança manual no input de quantidade
    carrinhoProdutosContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantidade-item')) {
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            const itemElement = e.target.closest('.item-carrinho');
            const index = parseInt(itemElement.dataset.index);
            const novaQuantidade = parseInt(e.target.value);
            
            if (novaQuantidade < 1 || isNaN(novaQuantidade)) {
                e.target.value = 1;
                carrinho[index].quantidade = 1;
            } else {
                carrinho[index].quantidade = novaQuantidade;
            }

            salvarCarrinho(carrinho);
            renderizarCarrinho();
        }
    });

    // Chama a função renderizarCarrinho para carregar os itens ao abrir a página
    renderizarCarrinho();

    // Outros botões
    document.querySelector('.btn-comprar').addEventListener('click', () => {
        // Redireciona para a página principal (ajuste o caminho se necessário)
        window.location.href = '../index.html';
    });

    document.querySelector('.btn-pagamento').addEventListener('click', () => {
        alert('Redirecionando para o pagamento...');
    });
});