const promts = document.getElementById('promts')
const promtsBtn = document.getElementById('promtsBtn')
const responseChat = document.getElementById('response-chat')
const promtsBtnReset = document.getElementById('promtsBtnReset')
const idiomas = document.getElementById('idiomas')
let response = ''

let idiomasCurrent = 'chino'

idiomas.addEventListener('change', (e) => {
  idiomasCurrent = e.target.value
})

promtsBtn.addEventListener('click', (e) => {
  response = ''
  if (promts.value.length > 0) {
    getResponse(promts.value)
  }
})

promtsBtnReset.addEventListener('click', (e) => { 
  promts.value = ''
})

responseChat.addEventListener('change', e => {
  const el = e.target
  el.style.height = '0px'
  const scrollHeight = el.scrollHeight
  el.style.height = `${scrollHeight}px`
})

promts.addEventListener('input', e => {
  const el = e.target
  el.style.height = '0px'
  const scrollHeight = el.scrollHeight
  el.style.height = `${scrollHeight}px`
})


function getResponse(menssage) {


  const url = `http://localhost:3000/chat?message=${menssage}&idiomas=${idiomasCurrent}`

  const eventSorce = new EventSource(url);

  eventSorce.onerror = (error) => {
    console.error(error)
    eventSorce.close()
  }

  eventSorce.onmessage = (event) => { 

    const { data } = event

    if (data === '[DONE]') {
      eventSorce.close()
      return
    }

    response += data.replaceAll("\"","")

    responseChat.textContent = response
    responseChat.style.height = '0px'
    const scrollHeight = responseChat.scrollHeight
    responseChat.style.height = `${scrollHeight}px`
  }
  
}