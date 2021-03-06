//Start of UI
const UI = (function () {
  //Private Variables & functions

  //Start of clearResults
  function clearResults() {
    UISelectors.result.innerHTML = '' //Removes already shown meaning
  }
  //End of clearResults

  //Start of paintMeaning
  function paintMeaning(response) {
    // response = Fetch result(Array of objects)
    response.forEach((item) => {
      //Creating Div and Assigning classes to it
      let div = document.createElement('div')
      div.className = 'py-4 px-3 my-3'

      //Getting a word like desire from desire:1
      let word = item.meta.id
      let index = word.indexOf(':')
      if (index > -1) word = word.slice(0, index)

      //Gets arr of words like ["desire", "desired", "desires", "desiring"]
      let words = item.meta.stems
      let str = words.toString()
      //str = "desire,desired,desires,desiring"
      //str2 = "desire, desired, desires, desiring" puts spaces
      let str2 = ''
      for (let i = 0; i < str.length; i++) {
        let ch = str.charAt(i)
        if (ch === ',') str2 = str2 + ' ' + ch
        else str2 = str2 + ch
      }

      //Creates lists of OL from Definition array
      let lis = ''
      item.shortdef.forEach(function (definition) {
        let li = `
                <li> ${definition} </li>
                `
        lis = lis + li
        // lis contains
        // <li> to long or hope for : exhibit or feel desire for </li>
        // <li> to express a wish for : request </li>
      })

      // Handles Synonyms
      let synonyms = ''
      if (item.syns !== undefined) {
        synonyms = item.syns[0].pt[0][1]
        let synonymsC = ''
        // input: {sc}desire{/sc} {sc}wish{/sc} {sc}want{/sc} in synonyms
        // output: desire,  wish,  want, in synonymsC
        for (let i = 0; i < synonyms.length; i++) {
          let ch = synonyms.charAt(i)
          if (ch === '{') {
            // to remove {sc} and {/sc}
            if (synonyms.charAt(i + 1) === '/')
              //put commas where {/ is found
              synonymsC = synonymsC + ', '
            i = synonyms.indexOf('}', i)
          } else synonymsC += ch
        }
        // After split, synonyms =  ["desire", "  wish", "  want", "  crave", "  covet",""  mean to have a longing for. desire""]
        synonyms = synonymsC.split(',')
        synonymsC = "<span class='h6'>Synonyms: </span>"
        synonyms.forEach(function (word) {
          if (word.length < 13)
            // Removes phrases, Keeps only words
            synonymsC =
              synonymsC +
              `<a href="#" class="btn text-capitalize searchable h5 px-4">${word} <i class='fas fa-search'></i> </a> `
        })
        synonyms = synonymsC
      }

      // check if api does not returns Pronounce Text
      pronounceText = ''
      if (item.hwi.prs !== undefined)
        pronounceText = '[' + item.hwi.prs[0].mw + ']'

      let html = `
            <div class=""> 
                <h1 value=${word} class="text-capitalize"> ${word} <span class="h4"> ${pronounceText} </span> 
                    <a href="#"> <i id="pronounce-icon" class='fas fa-volume-up text-info'></i> </a>
                    <a href="#"> <i id="bookmark-icon" class='fas fa-bookmark text-info text-info'></i> </a>
                </h1>
                <hr>
                <h5 class="text-capitalize">${item.fl}</h5>
                <h6 class="text-capitalize">${words}</h6>
                <ol>
                    ${lis}
                </ol>
                <div class="synonyms">
                ${synonyms}
                </div>
            </div>
            `

      div.innerHTML = html
      UISelectors.result.appendChild(div)
    })
  } //End of paintMeaning

  //Start of paintDidYouMean
  function paintDidYouMean(response) {
    // response = array of words = [desire,dlsr,dire,sire]
    UISelectors.result.innerHTML = ''

    //Creating Div and Assigning classes to it
    let div = document.createElement('div')
    div.className = 'py-4 px-3 my-3'

    div.innerHTML = '<h2> Did you mean? </h2>'
    response.forEach((word, index) => {
      div.innerHTML += `<a class='text-capitalize searchable' href="#">${word}</a> / `
    })
    // Appending to results div
    UISelectors.result.appendChild(div)
  } //End of paintDidYouMean

  //Start of paintError
  function paintError() {
    if (!navigator.onLine) {
      UISelectors.result.innerHTML = `<div class="py-4 px-3 my-3 bg-danger text-light">
                <h2>Warning!</h2>
                Your internet connection is down 
                <br>
                Try Again after connecting.
            </div>`
    }
  }
  //End of paintError

  //Start of showHighlight
  function showHighlight(text) {
    if (text.length > 0) {
      UISelectors.highlight_btn_search.style = 'display:inline-block'
      UISelectors.highlight_text.textContent = text
      UISelectors.highlight_box.classList.add('show')
      if (
        (text.includes(' ') && text.charAt(0) !== ' ') ||
        (text.includes(' ') && text.length > 15)
      )
        //To check if more than one word
        UISelectors.highlight_btn_search.style = 'display:none'
    } else hideHighlight()
  }
  function hideHighlight() {
    UISelectors.highlight_box.classList.remove('show')
  }
  //End of showHighlight

  //Start of toggleLoader
  function toggleLoader() {
    UISelectors.loader.classList.toggle('show')
  }
  //End of toggleLoader

  function showSuggestionsAndHideResult() {
    UISelectors.suggestions.style.display = 'block'
    UISelectors.result.style.display = 'none'
  }

  function showResultAndHideSuggestions() {
    UISelectors.suggestions.style.display = 'none'
    UISelectors.result.style.display = 'block'
  }

  //Public functions
  return {
    paintMeaning,
    paintDidYouMean,
    paintError,
    showHighlight,
    hideHighlight,
    toggleLoader,
    clearResults,
    showSuggestionsAndHideResult,
    showResultAndHideSuggestions,
  }
})()
//End of UI

define(UI)
