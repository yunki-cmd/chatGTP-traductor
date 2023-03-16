const promtsCode = document.getElementById('promts-code')
const promtsBtnCode = document.getElementById('promtsBtnCode')
const responseChatCode = document.getElementById('response-chat-code')
const promtsBtnResetCode = document.getElementById('promtsBtnResetCode')


let responseCode = ''

promtsBtnCode.addEventListener('click', (e) => {
  responseCode = ''

  if (promtsCode.value.length > 0) {
    getResponseCode([
      { "role": "user", "content": promtsCode.value }
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


  const socket = io.connect('http://localhost:3000');
  socket.on('connect', () => {
    console.log('Conectado al servidor de sockets');
  });

  socket.emit("chat/code", menssage);

  socket.on('streamData', (data) => {
    console.log('Datos recibidos del servidor de streaming:', data);

    if (data === '[DONE]') {
      console.log("socket disconectado")
      socket.disconnect()
      return
    }

    let datarepalce = data.replaceAll("\"", "").replaceAll("'", "\"")

    responseCode += datarepalce
    responseCode = responseCode.replace(/\\n+/, "")



    console.log(responseCode)


    /* const resultado = separarTextoCodigo(responseCode);

    if (resultado.codigo) {
      console.log('Código encontrado:');
      resultado.codigo.forEach((codigo) => {
        console.log(`Lenguaje: ${codigo.lenguaje}`);
        console.log(`Código: ${codigo.codigo}`);
        console.log('---');
      });
    }

    console.log('Texto encontrado:');
    console.log(resultado.texto); */

    responseChatCode.innerHTML = markdown.toHTML(responseCode)
    responseChatCode.style.height = '0px'
    const scrollHeight = responseChatCode.scrollHeight
    responseChatCode.style.height = `${scrollHeight}px`
  });

}