const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search

  resultsPane = document.body.querySelector("#resultsImageContainer");
  resultsPane.innerHTML = '';
  suggested = document.body.querySelector('.suggestions ul');
  suggested.innerHTML = '';
  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.

  input = document.body.querySelector("#searchInput").value;
  query = `${bing_api_endpoint}?q=${encodeURIComponent(input)}`;
  let request = new XMLHttpRequest();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.open('GET', query, true);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  
  request.addEventListener('load', function(event) {
    let response = request.response;
    console.log(response);

    if (response.relatedSearches && response.relatedSearches.length > 0) {
      response.relatedSearches.slice(0, 6).forEach(searchTerm => {
        console.log(searchTerm.text);
        let newSuggestion = document.createElement('li');
        newSuggestion.textContent = searchTerm.text;

        suggested.appendChild(newSuggestion);

        newSuggestion.addEventListener('click', function(event) {
          document.body.querySelector("#searchInput").value = newSuggestion.textContent;
          runSearch();
        })
      })
    }
  
    if (response.value && response.value.length > 0) {
        response.value.slice(0, 10).forEach(image => {
        let img = document.createElement('img');
        img.src = image.contentUrl;
  
        let div = document.createElement('div');
        div.className = 'resultImage';
        div.appendChild(img);
  
        resultsPane.appendChild(div);

        img.addEventListener('click', function(event) {
          let image = event.target;
          console.log(image);

          if (image) {
            let img = document.createElement('img');
            img.src = image.src;
            board = document.body.querySelector("#board")
            div = document.createElement('div');
            div.className = 'savedImage';
            div.appendChild(img);
            board.appendChild(div);
          }
        });
      });
    } else {
      resultsPane.innerHTML = 'No results found.';
    }
  });

  // TODO: Send the request

  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
