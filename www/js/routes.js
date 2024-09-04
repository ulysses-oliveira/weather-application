//INICIALIZAÇÃO DO F7 QUANDO DISPOSITIVO ESTÁ PRONTO
document.addEventListener('deviceready', onDeviceReady, false);
var app = new Framework7({
  // App root element
  el: '#app',
  // App Name
  name: 'Weather Location',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  dialog: {
    buttonOk: 'Sim',
    buttonCancel: 'Cancelar',
  },
  // Add default routes
  routes: [
    {
      path: '/index/',
      url: 'index.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
    // Adicionar chamada para obter a localização
    checkLocationEnabled();
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
    {
      path: '/educational/',
      url: 'educational.html',
      animate: false,
	  on: {
		pageBeforeIn: function (event, page) {
		// fazer algo antes da página ser exibida
		},
		pageAfterIn: function (event, page) {
		// fazer algo depois da página ser exibida
		},
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
		},
		pageBeforeRemove: function (event, page) {
		// fazer algo antes da página ser removida do DOM
		},
	  }
    },
  ],
  // ... other parameters
});

//Para testes direto no navegador
//var mainView = app.views.create('.view-main', { url: '/index/' });

//EVENTO PARA SABER O ITEM DO MENU ATUAL
app.on('routeChange', function (route) {
  var currentRoute = route.url;
  console.log(currentRoute);
  document.querySelectorAll('.tab-link').forEach(function (el) {
    el.classList.remove('active');
  });
  var targetEl = document.querySelector('.tab-link[href="' + currentRoute + '"]');
  if (targetEl) {
    targetEl.classList.add('active');
  }
});


function onDeviceReady() {  
  //Quando estiver rodando no celular
  var mainView = app.views.create('.view-main', { url: '/index/' });

  checkLocationEnabled()

  //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID 	
  document.addEventListener("backbutton", function (e) {

    if (mainView.router.currentRoute.path === '/index/') {
      e.preventDefault();
      app.dialog.confirm('Deseja sair do aplicativo?', function () {
        navigator.app.exitApp();
      });
    } else {
      e.preventDefault();
      mainView.router.back({ force: true });
    }
  }, false);

}

const APIKEY = "79673b5a82295ddedb3cd336ad6b0c92"
async function searchCity(city) {
    const datas = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&lang=pt_br&units=metric`)
    .then(response => response.json())
    //const datas = await response.json()

    weatherInformation(datas)
}

async function searchLocation(lat, lon) {
    const datas = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&lang=pt_br&units=metric`)
    .then(response => response.json())

    weatherInformation(datas)
}

function getCityName(event) {
  if (event) event.preventDefault()
    const city = document.querySelector('.input-cidade').value
    searchCity(city)
}

function weatherInformation(datas) {
    document.querySelector('.cidade').innerHTML = "Tempo em " + datas.name
    document.querySelector('.temperatura').innerHTML = Math.round(datas.main.temp) + " °C"
    document.querySelector('.texto-previsao').innerHTML = datas.weather[0].description
    document.querySelector('.umidade').innerHTML = "Umidade: " + datas.main.humidity + "%"
    document.querySelector('.img-previsao').src = `https://openweathermap.org/img/wn/${datas.weather[0].icon}.png`
}

// Função para obter a localização atual do dispositivo
function checkLocationEnabled() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          function (position) {
            const { latitude, longitude } = position.coords;
            // Lógica para usar latitude e longitude
            searchLocation(latitude, longitude)
          },
          function (error) {
              // Localização não ativada ou erro
              if (error.code === error.PERMISSION_DENIED) {
                  console.log("Permissão de localização negada.");
              } else if (error.code === error.POSITION_UNAVAILABLE) {
                  console.log("Localização indisponível.");
              } else if (error.code === error.TIMEOUT) {
                  console.log("Tempo de solicitação expirado.");
              } else if (error.code === error.UNKNOWN_ERROR) {
                  console.log("Erro desconhecido.");
              }
              // Solicitar ao usuário para ativar o localizador
              promptToEnableLocation();
          }
      );
  } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
  }
}

function promptToEnableLocation() {
  alert("Para usar este recurso, você precisa ativar o serviço de localização. Vá para as configurações do dispositivo e ative o GPS.");
}
