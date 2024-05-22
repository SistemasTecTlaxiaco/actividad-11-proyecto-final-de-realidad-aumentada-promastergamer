const showInfo = () => {
  const microButton = document.querySelector("#microfono-button");

  microButton.setAttribute("visible", true);
 
}

// Variable global para controlar el estado de la animación
let animationPaused = true;

document.addEventListener('DOMContentLoaded', function() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  var voces = ['Hola', 'Inicia explicación', 'Pausa explicación', 'Reinicia explicación'];

  var grammar = '#JSGF V1.0; grammar voces; public <voces> = ' + voces.join(' | ') + ' ;';

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'es-MX';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var diagnostic = document.querySelector('#text'); 
  var vozHTML = '';
  voces.forEach(function (v, i, a) {
    console.log(v, i);
  });

  function micro(){
      recognition.start();
      console.log('Estoy listo para escuchar.');
  }
  document.getElementById('microfono-button').onclick = micro;

    // Pausar la animación cuando se carga la escena
  const avatar = document.getElementById('avatar');
  avatar.removeAttribute('animation-mixer');

  recognition.onresult = function (event) {
      var voz = event.results[0][0].transcript;         
      diagnostic.setAttribute("value", "Dijiste: " + voz);
      bg = voz;
      var bg = document.querySelector('#text');

      //VISUALIZO EN CONSOLA
      console.log(bg);
      console.log('Voz reconocida: ',voz);

      // Variable para almacenar el utterance actual
      let currentUtterance;

      

      // Interacciones iniciales
      if (voz === 'Hola.') {
          console.log("Hola, estas saludando!");
          let utterance = new SpeechSynthesisUtterance('Hola amigo, que bueno verte de nuevo...');
        diagnostic.setAttribute("value", "Dijiste: " + voz + ".");
        utterance.lang = 'es-MX'
        currentUtterance = utterance;
        speechSynthesis.speak(utterance);
        avatar.setAttribute('animation-mixer', '');
          if (currentUtterance) {
            currentUtterance.onend = function(event) {
              // Pausar la animación del modelo 3D cuando el texto ha terminado de leerse
              avatar.removeAttribute('animation-mixer');
            };
          }
      }

      if (voz === 'Inicia explicación.' || voz === 'Inicia, explicación.' || voz === 'Inicia la explicación.'|| voz === 'Iniciar.') {
        console.log("Iniciando la explicación!");
        let utterance = new SpeechSynthesisUtterance('Kiki lo miró, colocó una sonrisa en su rostro, pero ya no se sentía tan bien. "¿Qué quieres decir Simha?" preguntó. "Traeme uno ahora mismo. Quiero probarlo" dijo Simha, mirando la fruta a lo lejos.');
        diagnostic.setAttribute("value", "Dijiste: " + voz + ".");
        utterance.lang = 'es-MX'
            // Verificamos si hay un utterance actual pausado
        if (speechSynthesis.paused) {
          // Si hay un utterance actual, lo reanudamos
          speechSynthesis.resume();
          
        } else {
          // Si no hay un utterance actual, iniciamos uno nuevo
          currentUtterance = utterance;
          speechSynthesis.speak(utterance);

          if (currentUtterance) {
            currentUtterance.onend = function(event) {
              // Pausar la animación del modelo 3D cuando el texto ha terminado de leerse
              avatar.removeAttribute('animation-mixer');
            };
          }
          
        }
        // Iniciamos la animación del modelo 3D
        avatar.setAttribute('animation-mixer', '');
      }

      if (voz === 'Pausa explicación.' || voz === 'Pausa, explicación.' || voz === 'Pausa la explicación.'|| voz === 'Pausar.') {
        console.log("Pausando la explicación!");
        
          // Si hay un utterance actual, lo pausamos
          speechSynthesis.pause();
          // Pausamos la animación del modelo 3D
          avatar.removeAttribute('animation-mixer');
        
      }

      if (voz === 'Reinicia explicación.' || voz === 'Reinicia, explicación.' || voz === 'Reinicia la explicación.'|| voz === 'Reiniciar.') {
        console.log("Reiniciando la explicación!");
        // Cancelar la síntesis de voz
        speechSynthesis.cancel();
        // Detenemos la animación del modelo 3D
        let avatar = document.getElementById('avatar');
        avatar.removeAttribute('animation-mixer');
      }

      console.log('Confidence: ' + event.results[0][0].confidence);
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onnomatch = function (event) {
      diagnostic.setAttribute("value", "No puedo escucharte claramente, por favor repiteme.");
  };

  recognition.onerror = function (event) {
      diagnostic.setAttribute("value", 'Ocurrio un error al escucharte: ' + event.error);
  };

  // Evento que se dispara cuando la síntesis de voz ha terminado de leer el texto
  speechSynthesis.addEventListener('end', function() {
    // Pausar la animación del modelo 3D cuando el texto ha terminado de leerse
    avatar.removeAttribute('animation-mixer');
  });
});


 

const showAvatar = (onDone) => {
  const avatar = document.querySelector("#avatar");
  avatar.setAttribute("position", "0 -0.20 0.3"); // Establecer posición estática
  onDone(); // Llamar a la función de finalización
}

AFRAME.registerComponent('mytarget', {
  /*init: function () {
    this.el.addEventListener('targetFound', event => {
      console.log("target found");
      showAvatar(() => {
        setTimeout(() => {
          showPortfolio(() => {
            setTimeout(() => {
              showInfo();
            }, 300);
          });
        }, 300);
      });
    });
    this.el.addEventListener('targetLost', event => {
      console.log("target found");
    });
    //this.el.emit('targetFound');
  }*/

  init: function () {
    const sceneEl = document.querySelector('a-scene');

    sceneEl.addEventListener('loaded', () => {
      console.log("Scene loaded");
      // Realizar acciones necesarias después de que se haya cargado la escena, incluida la realidad aumentada
      showAvatar(() => {
        setTimeout(() => {
          
        }, 300);
      });
      // Por ejemplo, eliminar la dependencia de la imagen
      sceneEl.removeAttribute('mindar-image');
    });
  }
});
