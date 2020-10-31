//Start of Bookmarker
const Bookmarker = (function (UI) {
  // Private variables & functions
  // const UISelectors = UI.getUISelectors()

  const UISelectors = {
    //Universal
    body: document.body,
    // Related to Searching
    result: document.querySelector('#results'),

    input_lookup: document.querySelector('#input-look-up'),
    search_form: document.querySelector('#search-form'),

    // Related to Dictator
    select_voices: document.querySelector('#select-voices'),
    pitch_range: document.querySelector('#pitch-range'),
    pitch_value: document.querySelector('#pitch-value'),
    rate_range: document.querySelector('#rate-range'),
    rate_value: document.querySelector('#rate-value'),
    btn_speak: document.querySelector('#btn-speak'),
    btn_stop: document.querySelector('#btn-stop'),
    input_to_speak: document.querySelector('#input-to-speak'),
    //Related to Bookmark
    bookmark_icon_ADDRESS: '#bookmark-icon',
    bookmarker: document.querySelector('#bookmarker'),
    bookmarker_words: document.querySelector('#bookmarker-words'),
    already_bookmarked: document.querySelector('#already-bookmarked'),
    add_bookmarked: document.querySelector('#add-bookmarked'),
    btn_delete: document.querySelector('#btn-delete'),
    btn_back: document.querySelector('#btn-back'),
    checkbox_ADDRESS: '.custom-control',
    //Related to Searchable
    searchable_ADDRESS: 'searchable',
    //Related to highlight
    highlight_box: document.querySelector('.highlight-box'),
    highlight_text: document.querySelector('.highlight-text'),
    highlight_btn_search: document.querySelector('#btn-highlight-search'),
    highlight_btn_pronounce: document.querySelector('#btn-highlight-pronounce'),
    //Related to Loader
    loader: document.querySelector('.loader'),
    //Related to Themes
    theme_btn_apply: document.querySelector('#btn-apply'),
    theme_checkboxes: document.querySelectorAll('#themes input'),
    //Quick Suggestion
    suggestions: document.querySelector('#suggestions'),
  }

  //Start of addToBookmarker
  function addToBookmarker(word, meaning) {
    let count = UISelectors.bookmarker_words.childElementCount + 1 // count = words already bookmarked plus 1 =
    let innerHTML = `
        <div>
            <span class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="customCheck${count}">
            <label class="custom-control-label" for="customCheck${count}"></label>
            </span>
            <span>${count}.</span> 
            <a class="text-info searchable text-capitalize h5" href="#"> ${word}</a> 
            <span>: ${meaning}</span>
        </div>
        `
    UISelectors.bookmarker_words.innerHTML += innerHTML
  }
  //End of addToBookmarker

  //Start of showState
  function showState() {
    let checkboxes = document.querySelectorAll(UISelectors.checkbox_ADDRESS)
    checkboxes.forEach((checkbox) => {
      checkbox.classList.add('show')
    })
    UISelectors.btn_back.classList.add('show')
    UISelectors.btn_delete.textContent = 'Delete'
  }
  //End of showState

  //Start of hideState
  function hideState() {
    let checkboxes = document.querySelectorAll(UISelectors.checkbox_ADDRESS)
    checkboxes.forEach((checkbox) => {
      checkbox.classList.remove('show')
    })
    UISelectors.btn_back.classList.remove('show')
    UISelectors.btn_delete.textContent = 'Select Delete'
  }
  //End of hideState

  //Start of showAlreadyAddedToBookmark
  function showAlreadyAddedToBookmark(text) {
    UISelectors.already_bookmarked.classList.add('show')
    UISelectors.already_bookmarked.innerHTML = `<h4 class="text-light ">${text} is already bookmarked!!</h4>`
    setTimeout(() => {
      UISelectors.already_bookmarked.classList.remove('show')
    }, 3000)
  }
  //End of showAlreadyAddedToBookmark
  //Start of showAddedToBookmark
  function showAddedToBookmark(text) {
    UISelectors.add_bookmarked.classList.remove('d-none')
    UISelectors.add_bookmarked.innerHTML = `<h4 class="text-light text-capitalize">${text} is bookmarked!!</h4> `
    setTimeout(() => {
      UISelectors.add_bookmarked.classList.add('d-none')
    }, 3000)
  }
  //End of showAddedToBookmark

  // Public functions
  return {
    addToBookmarker,
    showState,
    hideState,
    showAlreadyAddedToBookmark,
    showAddedToBookmark,
  }
  // })(UI)
})()
//End of Bookmarker

define(Bookmarker)
