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
  /* socket.on("hello", (data) => {
    console.log(data);
  }); */

  socket.on('streamData', (data) => {
    console.log('Datos recibidos del servidor de streaming:', data);

    responseCode += data.replaceAll("\"", "")

    const resultado = separarTextoCodigo(responseCode);

    if (resultado.codigo) {
      console.log('Código encontrado:');
      resultado.codigo.forEach((codigo) => {
        console.log(`Lenguaje: ${codigo.lenguaje}`);
        console.log(`Código: ${codigo.codigo}`);
        console.log('---');
      });
    }
    
    console.log('Texto encontrado:');
    console.log(resultado.texto);
    
    responseChatCode.value = responseCode
    responseChatCode.style.height = '0px'
    const scrollHeight = responseChatCode.scrollHeight
    responseChatCode.style.height = `${scrollHeight}px`
  });


  /* fetch('http://localhost:3000/chat/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(menssage)
  }) */

  /* const url = `http://localhost:3000/chat/code?body=${JSON.stringify(menssage)}`

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
  } */

}


function separarTextoCodigo(texto) {
  // Buscar el código dentro del texto
  const regex = /```([^`\n]*)\n([\s\S]*?)\n```/gm;
  const codigo = [];
  let match;
  
  while ((match = regex.exec(texto)) !== null) {
    const lenguaje = match[1].trim();
    const codigoSinSalto = match[2].replace(/\n$/, '');
    const explicacion = texto.substring(0, match.index) + texto.substring(regex.lastIndex);
    codigo.push({ lenguaje, codigo: codigoSinSalto, explicacion });
  }

  // Si no se encontró código, devolver solo el texto
  if (codigo.length === 0) {
    return { texto };
  }

  // Si se encontró código, devolverlo junto con el texto que lo rodea
  return { codigo, texto: codigo[0].explicacion };
}