requirejs.config({
  //By default load any module IDs from js/lib
  baseUrl: 'Resources/App',
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    app: '../app',
  },
})

// Start the main app logic.
requirejs(
  [
    'api',
    'bookmark',
    'dictator',
    'localStorage',
    'quickSuggestions',
    'theme',
    'ui',
  ],
  function (
    Api,
    Bookmarker,
    Dictator,
    LocalStorage,
    QuickSuggestions,
    Theme,
    UI
  ) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    //Start of App
    const App = (function (Api, LocalStorage, UI, Dictator, Bookmarker) {
      //Private Variables & functions
      const UISelectors = UI.getUISelectors()

      // Start of getData
      function getData(word) {
        UI.clearResults()
        UI.toggleLoader()

        Api.get(word)
          .then((res) => {
            if (res[0].fl !== undefined)
              //Correct word spelling has been entered
              UI.paintMeaning(res)
            //Called with arguments of array/arrays returned by api
            // Word entered is wrong spelt;
            else UI.paintDidYouMean(res) // Called with array of words:["Coire", "desire", "Zaire", "sire"]
            UI.toggleLoader()
          })
          .catch((err) => {
            UI.paintError(err) //If Something goes wrong (Internet Connection is down.)
            UI.toggleLoader()
          })
      }
      // End of getData

      // Start of loadEventListener
      function loadEventListener() {
        // Start of Searching Listeners
        // Adding event Listener for Searching to btn and input
        UISelectors.search_form.addEventListener('submit', checkValid)
        UISelectors.input_lookup.addEventListener('input', function (e) {
          UI.showSuggestionsAndHideResult()
          if (!Boolean(e.target.value))
            // if input is empty
            UI.showResultAndHideSuggestions()
        })
        // Check if input is not empty
        function checkValid(e) {
          e.preventDefault()
          let inputValue = UISelectors.input_lookup.value
          UISelectors.input_lookup.value = ''
          UI.showResultAndHideSuggestions()

          if (inputValue !== '') {
            QuickSuggestions.clearSuggestions() //Clearing Suggestions when a word is searched.
            getData(inputValue)
          }
        }
        // End of Searching Listeners

        // Start of Dictating Related
        speechSynthesis.addEventListener(
          'voiceschanged',
          Dictator.populateSelect
        ) // Runs when voices are loaded.

        Dictator.populateSelect()

        UISelectors.pitch_range.addEventListener(
          'change',
          Dictator.pitch_range_OnChange
        )
        UISelectors.rate_range.addEventListener(
          'change',
          Dictator.rate_range_OnChange
        )
        UISelectors.btn_speak.addEventListener('click', function () {
          Dictator.speak(UISelectors.input_to_speak.value)

          // For Storing in Local Storage
          let voiceName = UISelectors.select_voices.selectedOptions[0].value
          let pitch = UISelectors.pitch_range.value
          let rate = UISelectors.rate_range.value

          LocalStorage.dictatorAdd(voiceName, rate, pitch)
        })
        UISelectors.btn_stop.addEventListener('click', function (e) {
          Dictator.stop()
        })

        UISelectors.result.addEventListener('click', function (e) {
          //When a word is clicked from results
          e.preventDefault()
          if (e.target.id === 'pronounce-icon') {
            let text = e.target.parentElement.parentElement.textContent //desire  [di-ˈzī(-ə)r] || desire

            let index = text.indexOf('[')
            if (index > -1)
              // desire  [di-ˈzī(-ə)r] to remove '[di-ˈzī(-ə)r]' result after this 'desire '
              text = text.substring(0, index - 2)
            text = text.trim() // removes extra spaces
            Dictator.speak(text)
          }
        })

        // End of Dictating Related

        // Start of Bookmark
        // Start of addBookmark
        UISelectors.result.addEventListener('click', function (e) {
          e.preventDefault()
          if (e.target.id === 'bookmark-icon') {
            let alreadyPresent = false
            let h1 = e.target.parentElement.parentElement
            let text = h1.getAttribute('value') // h2.value = word i.e: desire
            let meaning = h1.parentElement.querySelector('ol li').textContent
            // meaning = to long or hope for : exhibit or feel desire for

            //Getting Data from LocalStorage
            let array2d = LocalStorage.bookmarkGet()
            if (array2d) {
              array2d.forEach((array) => {
                if (array[0] === text) alreadyPresent = true
              })
            }

            if (alreadyPresent) {
              Bookmarker.showAlreadyAddedToBookmark(text)
            } else {
              //if already is false then this runs
              Bookmarker.showAddedToBookmark(text)
              Bookmarker.addToBookmarker(text, meaning)
              LocalStorage.bookmarkAdd(text, meaning)
            }
          }
        })
        // End of addBookmark

        // Start of deleteBookmark
        UISelectors.btn_delete.addEventListener('click', function (e) {
          e.preventDefault()
          if (UISelectors.btn_delete.textContent === 'Select Delete')
            Bookmarker.showState()
          // when textContent = Delete
          else {
            let checkboxes = document.querySelectorAll(
              UISelectors.checkbox_ADDRESS
            )
            checkboxes = Array.from(checkboxes)
            let numbers = []

            checkboxes.forEach(function (checkbox) {
              let input = checkbox.querySelector('input')
              let id = input.id //customCheck1 || customCheck2 ...
              let number = id.charAt(id.length - 1) // 1 || 2..
              if (input.checked) {
                numbers.push(parseInt(number)) // checked number = [1,2] is stored in array
              }
            })
            LocalStorage.bookmarkDelete(numbers)
            Bookmarker.hideState()
            const loadDataFromLocalStorageFNS = loadDataFromLocalStorage() //returns object containing loadBookmarker function
            loadDataFromLocalStorageFNS.loadBookmarker()
          }
        })
        // End of deleteBookmark
        // Start of goBackBookmark
        UISelectors.btn_back.addEventListener('click', function (e) {
          e.preventDefault()
          Bookmarker.hideState()
        })
        // End of goBackBookmark
        // End of Bookmark

        //Start of Searchable
        document.body.addEventListener('click', function (e) {
          if (e.target.classList.contains(UISelectors.searchable_ADDRESS)) {
            e.preventDefault()
            let word = e.target.textContent //word = desire
            $('#bookmarker').modal('hide') //to Hide modal popup if shown
            getData(word)
          }
        })
        //End of Searchable

        //Start of Highlight
        let highlightedText = ''
        //Start of Showing and Hiding of highlightBox
        document.addEventListener('selectionchange', function () {
          let selection = window.getSelection()

          if (selection.isCollapsed === true)
            //If nothing is selected so hide.
            UI.hideHighlight()
          else {
            try {
              // to get rid of error showing in console
              let text = selection.focusNode.data
              let anchor_Offset = selection.anchorOffset
              let offset = selection.focusOffset

              highlightedText = text.substring(anchor_Offset, offset)
              UI.showHighlight(highlightedText)
            } catch (error) {}
          }
        })
        //End of Showing and Hiding of highlightBox

        //Hide highlightBox if already showing
        document.addEventListener('scroll', function () {
          UI.hideHighlight()
        })
        //Searching by btn-highlight-search
        UISelectors.highlight_btn_search.addEventListener('click', function () {
          getData(highlightedText)
        })
        //Searching by btn-highlight-pronounce
        UISelectors.highlight_btn_pronounce.addEventListener(
          'click',
          function () {
            Dictator.speak(highlightedText)
          }
        )
        //End of Highlight

        //Start of Themes EventListeners
        UISelectors.theme_checkboxes.forEach(function (checkbox) {
          checkbox.addEventListener('change', function () {
            if (this.checked) Theme.showBtn()
          })
        })
        UISelectors.theme_btn_apply.addEventListener('click', function (e) {
          e.preventDefault()
          let checked = ''
          UISelectors.theme_checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
              checked = checkbox
            }
          })
          Theme.change(checked.id)
          $('#themes').modal('hide')
        })
        //End of Themes EventListeners

        //Start of QuickSuggestions EventListeners
        UISelectors.suggestions.addEventListener('click', function (e) {
          // on clicking on suggested word enters it into input box
          if (e.target.tagName === 'LI') {
            //Clearing Suggestions
            QuickSuggestions.clearSuggestions()
            UI.showResultAndHideSuggestions()

            let li = e.target
            getData(li.textContent)
            UISelectors.input_lookup.value = ''
          }
        })

        UISelectors.input_lookup.addEventListener('keyup', function (e) {
          let value = UISelectors.input_lookup.value

          if (e.key === 'Enter') QuickSuggestions.clearSuggestions()

          if (value !== '') {
            QuickSuggestions.getSuggestions(value)
              .then(function (res) {
                if (res) QuickSuggestions.createSuggestions(res)
              })
              .catch()
          } //When Empty then clear suggestions
          else QuickSuggestions.clearSuggestions()
        })
        // End of QuickSuggestions EventListeners
      }
      // End of loadEventListener

      // Start of loadDataFromLocalStorage
      function loadDataFromLocalStorage() {
        loadBookmarker()
        loadDictator()
        loadTheme()

        function loadBookmarker() {
          UISelectors.bookmarker_words.innerHTML = ''
          let bookmarkedArray = JSON.parse(localStorage.getItem('bookmarked'))
          if (bookmarkedArray) {
            //if bookmarked is not null
            bookmarkedArray.forEach(function (array) {
              Bookmarker.addToBookmarker(array[0], array[1]) // array[0] = word, array[1]=text
            })
          }
        }

        function loadDictator() {
          let object = LocalStorage.dictatorGet()
          if (object) {
            //if object is not null
            speechSynthesis.addEventListener('voiceschanged', function () {
              // runs once voices are loaded.
              UISelectors.rate_range.value = object.rate
              UISelectors.pitch_range.value = object.pitch
              Dictator.pitch_range_OnChange()
              Dictator.rate_range_OnChange()
              Dictator.changeVoice(object.voiceName)
            })
          }
        }

        function loadTheme() {
          let theme = Theme.getThemeLocalStorage()
          Theme.change(theme)
        }
        //Returning to use in deleteBookmark
        return {
          loadBookmarker,
        }
      }
      // End of loadDataFromLocalStorage

      //Public functions
      return {
        init: function () {
          loadEventListener()
          loadDataFromLocalStorage()
        },
      }
    })(Api, LocalStorage, UI, Dictator, Bookmarker)
    //End of App

    //Calling init
    App.init()
  }
)
