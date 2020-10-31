//Start of Dictator (Rule Broken -> UIselector used here)
const Dictator = (function (UI) {
  //private variables and functions
  const speechSyn = window.speechSynthesis
  let voices = []

  function populateSelect() {
    // setTimeout(function(){ //To make browser wait so voices have been loaded

    voices = speechSyn.getVoices()
    voices.forEach((voice) => {
      // Creating option with textContent and value Attribute
      if (voice.lang.includes('en')) {
        //Filtering English Voices
        let option = document.createElement('option')
        option.textContent = voice.name
        option.setAttribute('value', voice.name)
        UISelectors.select_voices.appendChild(option)
      }
    })

    // },50);
  }

  function speak(text) {
    // New keyword is needed for Utterance not for speechSynthesis above
    const utterance = new window.SpeechSynthesisUtterance()
    let selectedVoiceName = UISelectors.select_voices.selectedOptions[0].value
    let selectedVoice
    voices.forEach((voice) => {
      if (voice.name === selectedVoiceName) selectedVoice = voice
    })
    utterance.text = text
    utterance.voice = selectedVoice
    utterance.pitch = UISelectors.pitch_range.value
    utterance.rate = UISelectors.rate_range.value
    speechSyn.speak(utterance)
  }
  function pitch_range_OnChange(e) {
    UISelectors.pitch_value.textContent =
      'Pitch: ' + UISelectors.pitch_range.value
  }
  function rate_range_OnChange(e) {
    UISelectors.rate_value.textContent = 'Rate: ' + UISelectors.rate_range.value
  }

  //Local Storage
  function changeVoice(voiceName) {
    // setTimeout(function(){ //To make browser wait so voices have been loaded

    let options = UISelectors.select_voices.children //options = html collection of all options
    options = Array.from(options)

    let selectedOption
    options.forEach((option) => {
      if (option.getAttribute('value') === voiceName) selectedOption = option
    })

    selectedOption.selected = 'selected'

    // },50)
  }
  function stop() {
    speechSyn.cancel()
  }

  //public functions
  return {
    speak,
    populateSelect,
    pitch_range_OnChange,
    rate_range_OnChange,
    changeVoice,
    stop,
  }
})()
//End of Dictator

define(Dictator)
