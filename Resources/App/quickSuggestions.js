//Start of QuickSuggestions
const QuickSuggestions = (function (UII) {
  // Private Variables & functions
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

  async function getSuggestions(word) {
    try {
      const response = await fetch(`https://api.datamuse.com/sug?s=${word}`)
      const json = await response.json()
      return json
    } catch (err) {}
  }

  function clearSuggestions() {
    suggestions.innerHTML = ''
  }

  function createSuggestions(wordsArr, limit = 10) {
    //Clearing Suggestions
    clearSuggestions()

    wordsArr.forEach(function (wordObj, index) {
      if (index < limit) {
        let div = document.createElement('li')
        div.classList.add('lead')
        div.textContent = wordObj.word
        UISelectors.suggestions.append(div)
      }
    })
  }

  // Public functions
  return {
    getSuggestions,
    createSuggestions,
    clearSuggestions,
  }
})()
//End of QuickSuggestions

define(QuickSuggestions)
