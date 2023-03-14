const promtsCode = document.getElementById('promts-code')
const promtsBtnCode = document.getElementById('promtsBtnCode')
const responseChatCode = document.getElementById('response-chat-code')
const promtsBtnResetCode = document.getElementById('promtsBtnResetCode')

let responseCode = ''


promtsBtnCode.addEventListener('click', (e) => {
  responseCode = ''

  if (promts.value.length > 0) {
    getResponseCode([
      { "role": "user", "content": promts.value }
    ])
  }

})

promtsBtnResetCode.addEventListener('click', (e) => {
  promtsCode.value = ''
})

responseChatCode.addEventListener('change', e => {
  const el = e.target
  el.style.height = '0px'
  const scrollHeight = el.scrollHeight
  el.style.height = `${scrollHeight}px`
})

promtsCode.addEventListener('input', e => {
  const el = e.target
  el.style.height = '0px'
  const scrollHeight = el.scrollHeight
  el.style.height = `${scrollHeight}px`
})


function getResponseCode(menssage) {


  /* fetch('http://localhost:3000/chat/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(menssage)
  }) */

  const url = `http://localhost:3000/chat/code?body=${JSON.stringify(menssage)}`

  const eventSorceCode = new EventSource(url);

  eventSorceCode.onerror = (error) => {
    console.error(error)
    eventSorceCode.close()
  }

  eventSorceCode.onmessage = (event) => {

    const { data } = event

    if (data === '[DONE]') {
      eventSorceCode.close()
      return
    }

    responseCode += data.replaceAll("\"", "")

    responseChatCode.textContent = responseCode
    responseChatCode.style.height = '0px'
    const scrollHeight = responseChatCode.scrollHeight
    responseChatCode.style.height = `${scrollHeight}px`
  }

}