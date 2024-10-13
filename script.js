document.addEventListener("DOMContentLoaded", function () {
  const mounsterGrid = document.getElementById("mounster-grid");
  const successAlert = document.getElementById("success-alert");
  const dangerAlert = document.getElementById("danger-alert");
  const counterDiv = document.getElementById('counter-divi');
  let counter = 0;

   // IndexedDB setup
   let db;

   // Abrir/Configurar o IndexedDB
   const request = indexedDB.open('MounsterCounterDB', 1);

   request.onerror = function(event) {
       console.error('Erro ao abrir o IndexedDB:', event.target.errorCode);
   };

   request.onsuccess = function(event) {
       db = event.target.result;
       console.log('Banco de dados aberto com sucesso');
       getCounterFromDB(); // Recupera o valor do contador ao carregar a página
   };

   request.onupgradeneeded = function(event) {
       db = event.target.result;
       if (!db.objectStoreNames.contains('counterStore')) {
           const objectStore = db.createObjectStore('counterStore', { keyPath: 'id' });
           objectStore.transaction.oncomplete = function() {
               console.log('Object store criado');
           };
       }
   };

   // Função para salvar o contador no IndexedDB
   function saveCounterToDB(counterValue) {
    console.log(counterValue);
       const transaction = db.transaction(['counterStore'], 'readwrite');
       const objectStore = transaction.objectStore('counterStore');
       const request = objectStore.put({ id: 1, value: counterValue });

       request.onerror = function(event) {
           console.error('Erro ao salvar contador:', event.target.errorCode);
       };

       request.onsuccess = function() {
           console.log('Contador salvo com sucesso');
       };
   }

   // Função para buscar o contador do IndexedDB ao carregar a página
   function getCounterFromDB() {
       const transaction = db.transaction(['counterStore']);
       const objectStore = transaction.objectStore('counterStore');
       const request = objectStore.get(1);

       request.onerror = function(event) {
           console.error('Erro ao recuperar contador:', event.target.errorCode);
       };

       request.onsuccess = function(event) {
           if (request.result) {
               counter = request.result.value;
               counterDiv.textContent = `Contador: ${counter}`; // Atualiza o valor da div
           } else {
               console.log('Nenhum contador encontrado, inicializando com 0');
           }
       };
   }

    // Função para atualizar o contador
    function updateCounter(value) {
      if (value === -1) {
         if (counter > 0) {
          showRedAlert()
          counter += value;
          saveCounterToDB(counter);
         }
         else alert('Monstro negativo agora pae?')
      } else {
          showAlert();
          counter += value;
          saveCounterToDB(counter);
      }
      counterDiv.textContent = `Contador: ${counter}`; // Atualiza o valor da div com o contador
    }

  // Suponha que você tenha os dados das latas, poderia vir de uma API ou ser um array
  const energyDrinks = [
    {
      id: 1,
      imageUrl:
        "https://eldorado.hubsell.com.br/media/catalog/product/1/9/1982982_006664-1_1.png",
    },
    {
      id: 2,
      imageUrl:
        "https://memed.vtexassets.com/arquivos/ids/200110/Energetico-Monster-Energy-Ultra-Paradise-473ml-Drogaria-SP-725064.jpg?v=637895205216430000",
    },
    {
      id: 3,
      imageUrl:
        "https://images.tcdn.com.br/img/img_prod/858764/energetico_monster_energy_khaotic_lata_473ml_c_6_1743_1_8c4e46b1ea8f5f67f70244449015073c.jpg",
    },
    {
      id: 4,
      imageUrl:
        "https://down-br.img.susercontent.com/file/sg-11134201-7rbkb-lqs81ygcgmhw1e",
    },
    {
      id: 5,
      imageUrl:
        "https://images.tcdn.com.br/img/img_prod/858764/energetico_monster_energy_juice_pacific_punch_lata_473ml_c_06_1235_1_292099102e488def9ea31ca9f4e15150.jpg",
    },
    {
      id: 6,
      imageUrl:
        "https://lojavirtual.urizun.com.br/image/cache/data/eftr/Img_ftr_rp_399001-1160x1160.PNG?version=20240614144050",
    },
    {
      id: 7,
      imageUrl:
        "https://supermercadobomdemais.com.br/wp-content/uploads/2023/03/Monster-Ultra-Watermelon-473ml.png",
    },
    {
      id: 8,
      imageUrl:
        "https://boa.vtexassets.com/arquivos/ids/575529/Bebida-Energetica-Dragon-Ice-Tea-Lemon-Monster-Energy-Lata-473ml.jpg?v=638550511815700000",
    },
    {
      id: 9,
      imageUrl:
        "https://www.drogariaminasbrasil.com.br/media/product/33b/energetico-monster-juice-pipeline-punch-473ml-868.jpg",
    },
    {
      id: 10,
      imageUrl: "https://static.paodeacucar.com/img/uploads/1/173/24541173.png",
    },
    {
      id: 11,
      imageUrl:
        "https://www.imigrantesbebidas.com.br/img/bebida/images/products/full/88314-energetico-monster-energy-absolutely-zero-lata-473ml.jpg?s=465cb5b05b97cb3e7aec3a6277866cf1",
    },
    {
      id: 12,
      imageUrl:
        "https://cdn.awsli.com.br/2500x2500/600/600471/produto/91863108/3686394536.jpg",
    },
  ];

  // Função para criar os cards
  function createMounsterCard(energyDrink) {
    const card = document.createElement("div");
    card.classList.add("mounster-card");

    const img = document.createElement("img");
    img.src = energyDrink.imageUrl;
    img.alt = "Energy Drink";

    const cardActions = document.createElement("div");
    cardActions.classList.add("card-actions");

    const minusButton = document.createElement("button");
    minusButton.classList.add("actions-text");
    minusButton.innerText = " - ";
    minusButton.addEventListener("click", () => updateCounter(-1));

    const plusButton = document.createElement("button");
    plusButton.classList.add("actions-text");
    plusButton.innerText = " + ";
    plusButton.addEventListener("click", () => updateCounter(1));

    cardActions.appendChild(minusButton);
    cardActions.appendChild(plusButton);
    card.appendChild(img);
    card.appendChild(cardActions);

    mounsterGrid.appendChild(card);
  }

  function showRedAlert() {
    dangerAlert.classList.add("show"); // Adiciona a classe 'show' para exibir o alerta
    dangerAlert.style.display = "block";

    setTimeout(() => {
        dangerAlert.classList.remove("show"); // Remove a classe 'show' para o fade-out
      setTimeout(() => {
        dangerAlert.style.display = "none";
      }, 500); // Tempo para o fade-out completar
    }, 1000); // Exibe o alerta por 1 segundo
  }

  // Função para mostrar o alerta com fade-in/fade-out
  function showAlert() {
    successAlert.classList.add("show"); // Adiciona a classe 'show' para exibir o alerta
    successAlert.style.display = "block";

    setTimeout(() => {
      successAlert.classList.remove("show"); // Remove a classe 'show' para o fade-out
      setTimeout(() => {
        successAlert.style.display = "none";
      }, 500); // Tempo para o fade-out completar
    }, 1000); // Exibe o alerta por 1 segundo
  }

  // Gerar os cards
  energyDrinks.forEach((energyDrink) => {
    createMounsterCard(energyDrink);
  });
});
