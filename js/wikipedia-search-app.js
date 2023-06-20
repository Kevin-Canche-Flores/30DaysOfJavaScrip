// Btn-dark-mode
const switchButton = document.querySelector('.js-switch');
 
switchButton.addEventListener('click', () => {
    document.body.classList.toggle('dark'); //toggle the HTML body the class 'dark'
    switchButton.classList.toggle('active');//toggle the HTML button with the class='switch' with the class 'active'
});

// Referencia del elemento form añadida en una variable
const form = document.querySelector('.js-search-form');

form.addEventListener("submit", handleSubmit);

async function handleSubmit (event) {
  // preventDefault() nos sirve para evitar que el formulario recargue la pagina cada que le enviamos una busqueda.
  event.preventDefault();
  // Obtenemos el valor del campo que ingreso el usuario.
  const inputValue = document.querySelector(".js-search-input").value;
  // Aquí removemos espacios en ambas laterales del input.
  const searchQuery = inputValue.trim();

  const searchResults = document.querySelector('.js-search-results');
  // Clear the previous results
  searchResults.innerHTML = '';

  const spinner = document.querySelector('.js-spinner');
  spinner.classList.remove('hidden');

   try {
    const results = await searchWikipedia (searchQuery);
    //Es posible que una consulta de búsqueda no arroje resultados. Si eso sucede, no Los resultados se mostrarán en la página. Pero es mejor mostrar también una alerta a Notifique al usuario que no se encontraron resultados para su consulta.
    if (results.query.searchinfo.totalhits === 0) {
      alert('No results found. Try different keywords');
      return;
    }
    //Si encontro al menos un resultado procedera con esta parte del codigo...
    displayResults(results);

  } catch (err) {
    console.log(err);
    alert('Failed to search wikipedia');
  }

  finally {
    spinner.classList.add('hidden');
  }
}

function displayResults(results) {
  // Get a reference to the `.js-search-results` element
  const searchResults = document.querySelector('.js-search-results');

  results.query.search.forEach(result => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    // Append the search result to the DOM
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML => aqui nos explican el valor insertAdjacent...
    searchResults.insertAdjacentHTML(
      'beforeend',
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
      </div>`
    );
  }); 
}

async function searchWikipedia (searchQuery) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);
  if (!response.ok) { 
    throw Error(response.statusText);
  }
  const json = await response.json();
  return json;
}
