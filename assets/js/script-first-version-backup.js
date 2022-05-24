let linkk = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url='
let btnCriarNovoLink = document.querySelectorAll('.criarNovoLink')
let formCadastro     = document.querySelector('#cadastroLink')
let templatePasta    = document.querySelector('template#pasta')
let templateLink     = document.querySelector('template#link')
let clonePasta       = templatePasta.content.cloneNode(true)
let cloneLink        = templateLink.content.cloneNode(true)
let divDosLinks      = null
let currentItem      = null
let divPartida       = null
let divEntrou        = null
let sortableOptions  = {
    group: "shared",
    delay: 0,
    forceFallback: false,
    animation: 190,
    ghostClass: "blue-background-class",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-chosen",
    // handle: ".links",
    // draggable: ".links",  // Specifies which items inside the element should be draggable

    onEnd: function () {
        document.querySelector('.lixeira').classList.remove('lixeira-hover', 'excluir')
        salvarLocal()
    },

}
document.querySelector("#cadastroLink").addEventListener('click', e => {
   if(e.target.id === 'cadastroLink') e.target.classList.remove('show')
})
// BOTÃO DE ADICIONAR NOVA COLEÇÃO + EVENTO DE CRIAR COLEÇÃO

// renderiza o botao de adicionar mais coleções
let divCreateNewFolder = document.createElement('span')
divCreateNewFolder.setAttribute('id', 'createNewFolder')
divCreateNewFolder.setAttribute('class', 'material-symbols-outlined')
divCreateNewFolder.textContent = 'add'
divCreateNewFolder.addEventListener('click', e => criarNovaColecao())
document.querySelector('.container').append(divCreateNewFolder)

const criarNovaColecao = () => {
    for(let i = 0; i< 1;i++ ){
        let clonePasta = templatePasta.content.cloneNode(true)
        for (const element of clonePasta.children) {
            divCreateNewFolder.insertAdjacentElement('beforebegin', element)
            element.querySelector('input').focus()
            let areLinks = element.querySelector('.links')
            Sortable.create(areLinks, sortableOptions);
        }
    }
   
    botaoAddLink()
    
}

let divMessage = document.createElement('div')
divMessage.setAttribute('id', 'messages')

const message = (text) => {
    if(document.querySelector('#message')) document.querySelector('#message').remove()
    divMessage.innerHTML = text
    document.querySelector('body').append(divMessage)
}
// TODOS OS EVENTOS DE CLICK
document.addEventListener('click', e => {
    // let botaoOptions = document.querySelectorAll('.column .head span.delete')
    document.querySelectorAll('.column .head .options').forEach(element => element.classList.remove('show'))
    document.querySelectorAll('.head span').forEach(element => element.classList.remove('marcado'))

    if (e.target.classList.contains('delete')) {
        e.target.classList.add('marcado')
        e.target.parentElement.querySelector('.options').classList.toggle('show')

        
        let larguraDaPagina =  document.body.clientWidth
        let PosicaoXdoClique = e.x
        let PosicaoYdoClique = e.y
        let tamanhoDaDivOptions = 123
        let diferenca = (larguraDaPagina - (PosicaoXdoClique+tamanhoDaDivOptions))
        
        if(diferenca < 5) {
            e.target.parentElement.querySelector('.options').style.left = (larguraDaPagina - tamanhoDaDivOptions - 5) + 'px'
        }else {
            e.target.parentElement.querySelector('.options').style.left = PosicaoXdoClique + 5 + 'px'
        }
        e.target.parentElement.querySelector('.options').style.top = PosicaoYdoClique + 5 + 'px'
        return
    }
    if (e.target.classList.contains('excluir')) {
        let remo = e.target.parentElement.parentElement.parentElement.parentElement
        return remover(remo)
    }
    if(e.target.classList.contains('criarNovoLink')){
        let divLinks = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.links')
        divDosLinks = divLinks
        return abrirFormularioCadastro()
    }
  
})
// FIM EVENTOS CLICK


function dragDrop() {
    console.log('drag dropped');
}
function dragOver(e) {
    e.preventDefault()
    divEntrou = this
    console.log('drag over');
    if (this.classList.contains('lixeira')) return this.classList.add('excluir')
}
function dragEnter() {
    console.log('drag entered');
    if (!this.classList.contains('lixeira')) divPartida = this
    document.querySelector('.lixeira').classList.add('lixeira-hover')
}
function dragLeave() {
    console.log('drag left');
    if (divEntrou.classList.contains('lixeira')) {
        divPartida.append(currentItem)
    }
    if (this.classList.contains('lixeira')) return this.classList.remove('excluir')
}
function dragStart() {
    console.log('drag started');
    currentItem = this
    //  setTimeout(() => this.className = 'invisible', 0)
}
function dragEnd() {
    divPartida = null
}


let botaoAddLink = () => {
   
   

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('dragstart', dragStart)
        item.addEventListener('dragend', dragEnd)
    });
    document.querySelectorAll('.links').forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragenter', dragEnter);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', dragDrop);
    });

    document.querySelectorAll('.head input').forEach(input => input.addEventListener('change', () => salvarLocal()))

}




// DELETA O ITEM Da div das coleções, e atualiza o localStorage
const remover = (item) => {
    // if(!window.confirm('Deseja remover mesmo esta pasta?')) return
    item.remove()
    salvarLocal()
}

// fecha todos os botoes de Opções, caso abertos, e mostrar a div do Formulario
const abrirFormularioCadastro = () => {
    formCadastro.classList.add('show')
    document.querySelectorAll('.options').forEach(element => element.classList.remove('show'))
}
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    let nome = document.querySelector('#nome').value
    let url = document.querySelector('#url').value
    let ELem = criarNovoLink(nome, url)
    divDosLinks.appendChild(ELem)
    fecharFormularioCadastro()
    document.querySelector('form').reset()
    salvarLocal()
    botaoAddLink()

  

})

// Cria a Div que contém o link, imagem e span com nome do site adicionado!
const criarNovoLink = (nome, url) => {
    let a = document.createElement('a')
    a.setAttribute('class', 'list-group-item')
    a.setAttribute('draggable', 'true')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank"')
    let li = document.createElement('li')
   
    li.setAttribute('style', `background-image:url(${linkk}${url})`)
    let span = document.createElement('span')
    let b = document.createElement('b')
    b.innerHTML = nome
    span.append(b)
    a.append(li, span)
    console.log(a)
    return a
}


const fecharFormularioCadastro = () => {
    formCadastro.classList.remove('show')
}


// SALVAR ELEMENTOS DAS COLEÇÕES E ITENS PARA O LOCAL STORAGE
// é feito um ForeaCH em cada coleção (div column), pegando seu h1 como chave do objeto, e os elementos filhos
// dessa coleção são salvos como propriedade desse objeto, também como objeto {}
const salvarLocal = () => {
    let data = {}
    let itens = document.querySelectorAll('.column')
   
    itens.forEach(box => {
        // Nome da Chave
        let h1 = box.querySelector('.head input').value ? box.querySelector('.head input').value : 'Nameless'
        let links = box.querySelectorAll('.list-group-item')
        let itens = []
        if (links.length < 1) return data[h1] = [] // se não tiver nenhum link na coleção
        links.forEach((link, index) => {
            if (index == 0) itens = []
            itens.push({ link: link.href, nome: link.querySelector('span b').innerHTML })
            data[h1] = itens
        })

    })
    localStorage.setItem('data', JSON.stringify(data))
    message('<span class="material-symbols-outlined">sync</span>all syncronized!')
}


let dadosSalvosObj = (JSON.parse(localStorage.getItem('data')))
// RENDERIZA AS PASTAS OBTIDAS DO LOCALSTORAGE
// loop nos objetos para mostrar uma pasta, depois, loop dentro de cada objeto para msotrar os itens
if(dadosSalvosObj){
    for (item in dadosSalvosObj) {
    
        let clonePasta = templatePasta.content.cloneNode(true)
        let cloneLink = templateLink.content.cloneNode(true)
        
        clonePasta.querySelector('input').value = item
    
        if (dadosSalvosObj[item].length < 1) {          
            divCreateNewFolder.insertAdjacentElement('beforebegin', clonePasta.children[0])
        } else {
            dadosSalvosObj[item].forEach(link => {
                cloneLink.querySelector('a').href = link.link
                cloneLink.querySelector('span b').innerHTML = link.nome
                cloneLink.querySelector('li').style.backgroundImage = 'url(' + linkk + link.link + ')'
                clonePasta.querySelector('#links').append(cloneLink.cloneNode(true))
            })
            
            divCreateNewFolder.insertAdjacentElement('beforebegin', clonePasta.children[0])
            
        }
    }
    botaoAddLink()
}



if(!dadosSalvosObj || Object.keys(dadosSalvosObj).length < 1){
    console.warn('Primeiro acesso!')
    criarNovaColecao()
}
console.log(Object.keys(dadosSalvosObj).length)

// botaoAddLink()

document.querySelectorAll('.links').forEach((column) => Sortable.create(column, sortableOptions))
