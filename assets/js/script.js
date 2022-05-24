import { Collection, pastaCriar } from './Collection.js'

const inputUrl = document.querySelector('#cadastroLink #url')
const inputNomeSite = document.querySelector('#cadastroLink #nome')
const inputSubmit = document.querySelector('#createNewFolder')
let dataCollectionLocal = JSON.parse(localStorage.getItem('data'))
let dataConfigLocall = JSON.parse(localStorage.getItem('config'))

if(dataConfigLocall){
    document.querySelector('#inputColor input').value = dataConfigLocall.color
    document.querySelector(':root').style.setProperty('--colorPrimary', dataConfigLocall.color)
}else{
    document.querySelector('#inputColor input').value = '#00b400'
    document.querySelector(':root').style.setProperty('--colorPrimary', '#00b400')
}

const message = (text) => {
    let divMessage = document.createElement('div')
    divMessage.setAttribute('id', 'messages')
    if (document.querySelector('#message')) document.querySelector('#message').remove()
    divMessage.innerHTML = text
    document.querySelector('body').append(divMessage)
}

inputSubmit.addEventListener('click', () => {
    let newCollection = new Collection()
    newCollection.input.focus()
})

document.querySelector("#cadastroLink").addEventListener('click', e => {
    if (e.target.id === 'cadastroLink') e.target.classList.remove('show')
})

document.querySelector('#cadastroLink form').addEventListener('submit', e => {
    e.preventDefault()
    if (!isValidUrl(inputUrl.value)) return message('<span class="material-symbols-outlined">error</span>Insira uma URL válida!')
    pastaCriar.adicionarLinks([{ nome: inputNomeSite.value, link: inputUrl.value }])
    document.querySelector('#cadastroLink').classList.remove('show')
    e.target.reset()
    Collection.salvarLocal()
}) 
document.querySelector("#inputColor").addEventListener('input', (e) => {
    document.querySelector(':root').style.setProperty('--colorPrimary', e.target.value)
    localStorage.setItem('config', JSON.stringify({color: e.target.value}))
   
})

if (dataCollectionLocal) for (let i in dataCollectionLocal) new Collection(i, dataCollectionLocal[i])
if (!dataCollectionLocal || Object.keys(dataCollectionLocal).length < 1) new Collection()

function isValidUrl(_string) {
    const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return matchPattern.test(_string);
}
export { message }

// for(let i =0; i < 100; i++ ){
//     new Collection()
// }

