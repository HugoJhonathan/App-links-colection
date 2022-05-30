import { message } from './script.js'

const templatePasta = document.querySelector('template#pasta')
const templateLink  = document.querySelector('template#link')
const lixeira       = document.querySelector('.column.lixeira')

let dragItem   = null // var de cotrole do item que está sendo arrastado
let pastaCriar = null // var de controlo da collection onde será adicionada novo link
let divPartida = null // var de controle para saber a div onde iniciou o drag
let divEntrou  = null // var de controle para ver a ultima div onde foi deixado o elemento drag

class Collection {
    constructor(nome, links) {
        this.nome          = nome
        this.links         = links
        this.cloneTemplate = templatePasta.content.cloneNode(true).children[0]
        this.cloneLink     = templateLink.content.cloneNode(true).children[0]
        this.btnOptions    = this.cloneTemplate.querySelector('span.delete')
        this.btnExcluir    = this.cloneTemplate.querySelector('li.excluir')
        this.options       = this.cloneTemplate.querySelector('.options')
        this.input         = this.cloneTemplate.querySelector('.head input')
        this.btnNovoLink   = this.cloneTemplate.querySelector('.criarNovoLink')
        this.formulario    = document.querySelector('#cadastroLink')
        this.init()
    }
    init = () =>{
        this.criarElemento()  
    }
    events = () => {
        this.input.style.width = this.input.value.length*8.18 + 20 + 'px'
       
        this.input.addEventListener('change', e => Collection.salvarLocal())
        this.input.addEventListener('change', e => Collection.salvarLocal())
        this.btnNovoLink.addEventListener('click', e => this.actionFormulario())
        this.btnOptions.addEventListener('click', e => {
            this.btnOptions.classList.toggle('marcado')
            this.options.classList.toggle('show')
        })
        this.btnExcluir.addEventListener('click', e => {
            this.cloneTemplate.remove()
            Collection.salvarLocal()
        })
        Collection.salvarLocal()
    }
    criarElemento = () => {
        this.input.value = this.nome ? this.nome : Collection.emojiAleatori()
        document.querySelector('#createNewFolder').insertAdjacentElement('beforebegin', this.cloneTemplate)
        this.adicionarLinks(this.links)
        this.cloneTemplate.addEventListener('dragover', this.dragOver)
        this.cloneTemplate.addEventListener('dragenter', this.dragEnter)
        this.cloneTemplate.addEventListener('dragleave', this.dragLeave)
        this.cloneTemplate.addEventListener('drop', this.Dropp)

        lixeira.addEventListener('dragover', this.dragOver)
        lixeira.addEventListener('dragenter', this.dragEnter)
        lixeira.addEventListener('dragleave', this.dragLeave)
        lixeira.addEventListener('drop', this.Dropp)

        this.events()
    }
    adicionarLinks = arrayLinks => {
        if (!arrayLinks) return
        arrayLinks.forEach(link => {
            let divLink = Collection.criarNovoLink(link.nome, link.link)
            divLink.addEventListener('dragstart', this.dragStart)
            divLink.addEventListener('dragend', this.dragEnd)
            this.cloneTemplate.querySelector('.links').append(divLink)
        })
    }
    actionFormulario = () => {
        this.formulario.classList.add('show')
        this.btnExcluir.classList.toggle('marcado')
        this.options.classList.toggle('show')
        this.btnOptions.classList.toggle('marcado')
        pastaCriar = this
          
        navigator.clipboard
            .readText()
            .then(cliptext => {
                document.querySelector('#url').value = cliptext
                document.querySelector('#nome').value = 'eae'
                console.log( document.querySelector('#url'))
                document.querySelector('#nome').focus()
            })
            .catch(err => message('Dê permissão para acessar sua area de tranferência!'))
    }

    static criarNovoLink = (nome, url) => {
        let a = document.createElement('a')
        a.setAttribute('class', 'list-group-item')
        a.setAttribute('draggable', 'true')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank"')
        let li = document.createElement('li')
        let linkk = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,90,URL&url='
        li.setAttribute('style', `background-image:url(${linkk}${url})`)
        let span = document.createElement('span')
        let b = document.createElement('b')
        b.innerHTML = nome
        span.append(b)
        a.append(li, span)
        return a
    }
    static salvarLocal = () => {
        let data = {}
        let itens = document.querySelectorAll('.column:not(.lixeira)')
        itens.forEach(box => {
            let h1 = box.querySelector('.head input').value ? box.querySelector('.head input').value : ''
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
        return data
    }
    static emojiAleatori = () => {
        let arrayEmojis = ['🙂','😃','😅','😎','🥳','🤪','😏','😴','😵','😱','🥱','🤏','💪']
        let numRandom=Math.floor(Math.random() * arrayEmojis.length)
        let qtdDePastas = Collection.salvarLocal() ? Number(Object.keys(Collection.salvarLocal()).length+1) : 1
        return `${arrayEmojis[numRandom]} collection # ${qtdDePastas}`
    }

      dragStart(event) {
        dragItem = this
        event.dataTransfer.setDragImage(dragItem.firstChild, 28, 28)
        this.classList.add('dragging')
        event.stopPropagation();
    }
      dragEnd() {
        this.classList.remove('dragging')
        dragItem = null
        document.querySelector('.lixeira').classList.remove('lixeira-hover', 'excluir')
        divPartida = null
    }
      Dropp(e) {
        e.preventDefault()
        Collection.salvarLocal()
        this.classList.remove('dragOver') 
        document.querySelectorAll('.not-drag').forEach(el => {
            el.classList.remove('not-drag')
        })   
        
    }
    static getDragAfterElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.list-group-item:not(.dragging)')]
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            // const offsetX = x - box.left - box.width / 2
            const offsetY = y - box.top + 0 - box.height / 2

            if (offsetY < 0 &&(offsetY > closest.offsetY)){
                 return { offsetY: offsetY, element: child }
            }
            else {
                return closest
            }
        }, { offsetY: Number.NEGATIVE_INFINITY }).element
    }

    dragOver(e) {
        divEntrou = this
        if(!this.classList.contains('lixeira')){
            this.querySelector('.head').classList.add('not-drag')
            this.querySelector('.links').classList.add('not-drag')
        }
        e.preventDefault()
        e.dataTransfer.effectAllowed  = 'move'
        let afterElement = Collection.getDragAfterElement(this, e.clientX, e.clientY)
        if (afterElement === null && !this.classList.contains('lixeira')) {
            this.querySelector('.links').append(dragItem)
        } else{
            this.querySelector('.links').insertBefore(dragItem, afterElement)
        }

        if(!this.classList.contains('dragOver')) this.classList.add('dragOver')
        if (this.classList.contains('lixeira')) return this.classList.add('excluir')
    }
    dragEnter(e) {
        e.preventDefault()
        if (!this.classList.contains('lixeira')) divPartida = this
        document.querySelector('.lixeira').classList.add('lixeira-hover')
    }
    dragLeave(e) {
        e.preventDefault()
        divEntrou.classList.remove('dragOver')  
        if (divEntrou.classList.contains('lixeira')) {
            document.querySelectorAll('.not-drag').forEach(el => {
                el.classList.remove('not-drag')
            })   
            divPartida.querySelector('.links').append(dragItem)
        }
        if (this.classList.contains('lixeira')) return this.classList.remove('excluir')
    }
}

export { Collection, pastaCriar }