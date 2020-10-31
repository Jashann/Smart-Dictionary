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
