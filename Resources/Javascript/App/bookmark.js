//Start of Bookmarker
const Bookmarker = (function (UI) {
  // Private variables & functions

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
