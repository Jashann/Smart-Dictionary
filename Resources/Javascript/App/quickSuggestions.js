//Start of QuickSuggestions
const QuickSuggestions = (function (UII) {
  // Private Variables & functions

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
