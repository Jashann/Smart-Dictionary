//Start of Api
const Api = (function () {
  //Private Variables & functions

  const apiKey = 'e1fc09e6-9722-4699-9353-2d99d4668fbd'

  async function get(word) {
    let response = await fetch(
      `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`
    )
    let json = response.json()
    return json
  }

  //Public functions
  return {
    get,
  }
})()
//End of Api

define(Api)
