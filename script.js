//Start of Api
const Api = (function(){
    //Private Variables & functions

    const apiKey = "e1fc09e6-9722-4699-9353-2d99d4668fbd";
    
    async function get(word){
        let response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
        let json = response.json();
        return json;
    }

    //Public functions
    return{
        get,
    }
})();
//End of Api





//Start of LocalStorage
const LocalStorage = (function(){
    //Private Variables & functions
    let bookmarkArray;


    function bookmarkAdd(text,meaning){
        if(localStorage.getItem("bookmarked")) // if already present this would run. 
        {
            bookmarkArray = JSON.parse(localStorage.getItem("bookmarked"));
            bookmarkArray.push([text,meaning]);
        }
        else // if nothing is stored, this would run, as null has been returned
            bookmarkArray = [[text,meaning]];
        
        localStorage.setItem("bookmarked", JSON.stringify(bookmarkArray));
    }

    function bookmarkGet(){
        return JSON.parse(localStorage.getItem("bookmarked"));
    }

    function dictatorAdd(voiceName,rate,pitch){
        let object = {
            voiceName,
            rate,
            pitch
        }
        localStorage.setItem("dictator",JSON.stringify(object));
    }

    function dictatorGet(){
        return JSON.parse(localStorage.getItem("dictator"));
    }

    function bookmarkDelete(nummbers){
        let array2d = JSON.parse(localStorage.getItem("bookmarked"));// [["desire", "to long or hope for : exhibit or feel desire for"],]
        let newArray2d = [];

        nummbers.forEach(function(number,index){
            newArray2d.push(array2d.slice(number-1, number)) ;
        });

        array2d = array2d.filter(function(arr1){
            let toBeDeleted = false;

            // arr1 = ["desire", "to long or hope for : exhibit or feel desire for"]... till all present words
            // arr2 = ["crave", " to ask for earnestly : beg, demand "], those which are to be deleted

            newArray2d.forEach(function(arr2){ 
                
                if(arr1[0] === arr2[0][0]){
                    toBeDeleted = true;
                }
            })
            if(!toBeDeleted)
                return arr1;
        });
        localStorage.setItem("bookmarked", JSON.stringify(array2d) );
    }

    //Public functions
    return{
        bookmarkAdd,
        bookmarkGet,
        bookmarkDelete,
        dictatorAdd,
        dictatorGet,
    }
})();
//End of LocalStorage





//Start of UI
const UI = (function(){
    //Private Variables & functions

    const UISelectors = {
        //Universal
        body: document.body,
        // Related to Searching
        result: document.querySelector("#results"),
        btn_search: document.querySelector("#btn-search"),
        input_lookup: document.querySelector("#input-look-up"),
        // Related to Dictator
        select_voices: document.querySelector("#select-voices"),
        pitch_range: document.querySelector("#pitch-range"),
        pitch_value: document.querySelector("#pitch-value"),
        rate_range: document.querySelector("#rate-range"),
        rate_value: document.querySelector("#rate-value"),
        btn_speak: document.querySelector("#btn-speak"),
        btn_stop: document.querySelector("#btn-stop"),
        input_to_speak: document.querySelector("#input-to-speak"),
        //Related to Bookmark
        bookmark_icon_ADDRESS: "#bookmark-icon",
        bookmarker: document.querySelector("#bookmarker"),
        bookmarker_words: document.querySelector("#bookmarker-words"),
        already_bookmarked: document.querySelector("#already-bookmarked"),
        add_bookmarked: document.querySelector("#add-bookmarked"),
        btn_delete: document.querySelector("#btn-delete"),
        btn_back: document.querySelector("#btn-back"),
        checkbox_ADDRESS: ".custom-control",
        //Related to Searchable
        searchable_ADDRESS: "searchable",
        //Related to highlight
        highlight_box: document.querySelector(".highlight-box"),
        highlight_text: document.querySelector(".highlight-text"),
        highlight_btn_search: document.querySelector("#btn-highlight-search"),
        highlight_btn_pronounce: document.querySelector("#btn-highlight-pronounce"),
        //Related to Loader
        loader: document.querySelector(".loader"),
        //Related to Themes
        theme_btn_apply: document.querySelector("#btn-apply"),
        theme_checkboxes: document.querySelectorAll("#themes input"),
        //Quick Suggestion
        suggestions: document.querySelector("#suggestions"),
    }
    function getUISelectors(){
        return UISelectors;
    }

    //Start of clearResults
    function clearResults(){
        UISelectors.result.innerHTML = "";//Removes already shown meaning
    }
    //End of clearResults

    //Start of paintMeaning
    function paintMeaning(response)
    {   // response = Fetch result(Array of objects)
        response.forEach(item=>
        {
            //Creating Div and Assigning classes to it
            let div = document.createElement("div");
            div.className = "py-4 px-3 my-3";
            
            //Getting a word like desire from desire:1
            let word = item.meta.id;
            let index = word.indexOf(":");  
            if(index>-1)
                word = word.slice(0,index);

            //Gets arr of words like ["desire", "desired", "desires", "desiring"]
            let words = item.meta.stems;
            let str = words.toString(); 
            //str = "desire,desired,desires,desiring"
            //str2 = "desire, desired, desires, desiring" puts spaces
            let str2="";
            for(let i=0; i<str.length; i++)
            {
                let ch = str.charAt(i);
                if(ch===",")
                    str2 = str2+" "+ch;
                else
                    str2 = str2+ch;
            }

            //Creates lists of OL from Definition array
            let lis = "";
            item.shortdef.forEach(function(definition){
                let li = `
                <li> ${definition} </li>
                `;
                lis = lis+li;
                // lis contains 
                // <li> to long or hope for : exhibit or feel desire for </li>
                // <li> to express a wish for : request </li>
            });

            // Handles Synonyms
            let synonyms = "";
            if(item.syns !== undefined){
                synonyms = item.syns[0].pt[0][1];
                let synonymsC = "";
                // input: {sc}desire{/sc} {sc}wish{/sc} {sc}want{/sc} in synonyms
                // output: desire,  wish,  want, in synonymsC
                for(let i=0; i<synonyms.length; i++)
                {
                    let ch = synonyms.charAt(i);
                    if(ch === "{") // to remove {sc} and {/sc}
                    {
                        if(synonyms.charAt(i+1)==="/") //put commas where {/ is found
                            synonymsC = synonymsC+", ";
                        i = synonyms.indexOf("}",i);
                    }
                    else
                        synonymsC += ch;
                }
                // After split, synonyms =  ["desire", "  wish", "  want", "  crave", "  covet",""  mean to have a longing for. desire""]
                synonyms = synonymsC.split(',');
                synonymsC = "<span class='h6'>Synonyms: </span>";
                synonyms.forEach(function(word){
                    if(word.length < 13)// Removes phrases, Keeps only words
                        synonymsC = synonymsC + `<a href="#" class="text-capitalize searchable h5 px-1">${word}</a> `
                })
                synonyms = synonymsC;
            }
            
            // check if api does not returns Pronounce Text
            pronounceText = "";
            if(item.hwi.prs !== undefined)
                pronounceText = "["+item.hwi.prs[0].mw+"]";

            let html = 
            `
            <div class=""> 
                <h1 value=${word} class="text-capitalize"> ${word} <span class="h4"> ${pronounceText} </span> 
                    <a href="#"> <img id="speak" src="./Resources/Icons/iconfinder_mic-microphone-record-speak_2205213.svg" alt="speak" srcset=""> </a>  
                    <a href="#"> <span id="bookmark-icon"> </span> </a>
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
            `;

            div.innerHTML = html;;
            UISelectors.result.appendChild(div);
        })
    }; //End of paintMeaning

    //Start of paintDidYouMean
    function paintDidYouMean(response){ // response = array of words = [desire,dlsr,dire,sire]
        UISelectors.result.innerHTML = "";

        //Creating Div and Assigning classes to it
        let div = document.createElement("div");
        div.className = "py-4 px-3 my-3";
        
        div.innerHTML = '<h2> Did you mean? </h2>';
        response.forEach((word,index)=>{
            div.innerHTML +=  `<a class='text-capitalize searchable' href="#">${word}</a> / `
        });
        // Appending to results div
        UISelectors.result.appendChild(div);
    }//End of paintDidYouMean

    //Start of paintError
    function paintError(){
        if(!navigator.onLine){
            UISelectors.result.innerHTML = 
            `<div class="py-4 px-3 my-3 bg-danger text-light">
                <h2>Warning!</h2>
                Your internet connection is down 
                <br>
                Try Again after connecting.
            </div>`;
        }
    }
    //End of paintError

    //Start of showHighlight
    function showHighlight(text){
        if(text.length>0)
        {
            UISelectors.highlight_btn_search.style = "display:inline-block";
            UISelectors.highlight_text.textContent = text;
            UISelectors.highlight_box.classList.add("show");
            if(text.includes(" ")&&text.charAt(0)!==" " || text.includes(" ")&&text.length>15) //To check if more than one word 
                UISelectors.highlight_btn_search.style = "display:none";
        }
        else
            hideHighlight();
    }   
    function hideHighlight(){
        UISelectors.highlight_box.classList.remove("show");
    }
    //End of showHighlight

    //Start of toggleLoader
    function toggleLoader(){
        UISelectors.loader.classList.toggle('show');
    }
    //End of toggleLoader

    //Public functions
    return{
        getUISelectors,
        paintMeaning,
        paintDidYouMean,
        paintError,
        showHighlight,
        hideHighlight,
        toggleLoader,
        clearResults,
    }
})();
//End of UI





//Start of Dictator (Rule Broken -> UIselector used here)
const Dictator = (function(UI){
    //private variables and functions
    const speechSyn = window.speechSynthesis;
    let voices = [];
    
    const UISelectors = UI.getUISelectors();

    function populateSelect(){

        // setTimeout(function(){ //To make browser wait so voices have been loaded

            voices = speechSyn.getVoices();
            voices.forEach(voice=>{
                // Creating option with textContent and value Attribute
                if(voice.lang.includes("en"))//Filtering English Voices
                {
                    let option = document.createElement("option");
                    option.textContent = voice.name;
                    option.setAttribute("value",voice.name);
                    UISelectors.select_voices.appendChild(option);
                }        
            });
        
        // },50);       
    }

    function speak(text){   
        // New keyword is needed for Utterance not for speechSynthesis above 
        const utterance = new window.SpeechSynthesisUtterance();
        let selectedVoiceName = UISelectors.select_voices.selectedOptions[0].value;
        let selectedVoice;
        voices.forEach((voice)=>{
            if(voice.name === selectedVoiceName)
                selectedVoice = voice;
        })
        utterance.text = text;
        utterance.voice = selectedVoice;
        utterance.pitch = UISelectors.pitch_range.value;
        utterance.rate = UISelectors.rate_range.value;
        speechSyn.speak(utterance);
    }
    function pitch_range_OnChange(e){
        UISelectors.pitch_value.textContent = "Pitch: "+UISelectors.pitch_range.value;
    }
    function rate_range_OnChange(e){
        UISelectors.rate_value.textContent = "Rate: "+UISelectors.rate_range.value;
    }

    //Local Storage
    function changeVoice(voiceName){

        // setTimeout(function(){ //To make browser wait so voices have been loaded

            let options = UISelectors.select_voices.children; //options = html collection of all options
            options = Array.from(options);

            let selectedOption;
            options.forEach((option)=>{
                if(option.getAttribute("value") === voiceName)
                    selectedOption = option;
            })

            selectedOption.selected = "selected";

        // },50)

    }
    function stop(){
        speechSyn.cancel();
    }

    //public functions
    return{
        speak,
        populateSelect,
        pitch_range_OnChange,
        rate_range_OnChange,
        changeVoice,
        stop
    }

})(UI);
//End of Dictator




//Start of Bookmarker
const Bookmarker = (function(UI){

    // Private variables & functions
        const UISelectors = UI.getUISelectors();

      //Start of addToBookmarker
      function addToBookmarker(word,meaning){

        let count =  UISelectors.bookmarker_words.childElementCount + 1; // count = words already bookmarked plus 1 = 
        let innerHTML = 
        `
        <div>
            <span class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="customCheck${count}">
            <label class="custom-control-label" for="customCheck${count}"></label>
            </span>
            <span>${count}.</span> 
            <a class="text-info searchable text-capitalize h5" href="#"> ${word}</a> 
            <span>: ${meaning}</span>
        </div>
        `;
        UISelectors.bookmarker_words.innerHTML += innerHTML;

    }
    //End of addToBookmarker

    //Start of showState
    function showState(){
        let checkboxes = document.querySelectorAll(UISelectors.checkbox_ADDRESS);
        checkboxes.forEach((checkbox)=>{
            checkbox.classList.add("show");
        })
        UISelectors.btn_back.classList.add("show");
        UISelectors.btn_delete.textContent = "Delete";
    }
    //End of showState

    //Start of hideState
    function hideState(){
        let checkboxes = document.querySelectorAll(UISelectors.checkbox_ADDRESS);
        checkboxes.forEach((checkbox)=>{
            checkbox.classList.remove("show");
        })
        UISelectors.btn_back.classList.remove("show");
        UISelectors.btn_delete.textContent = "Select Delete";
    }
    //End of hideState

    //Start of showAlreadyAddedToBookmark
    function showAlreadyAddedToBookmark(text){
        UISelectors.already_bookmarked.classList.add("show");
        setTimeout(()=>{
            UISelectors.already_bookmarked.classList.remove("show");
        },3000)
    }
    //End of showAlreadyAddedToBookmark
    //Start of showAddedToBookmark
    function showAddedToBookmark(text){
        UISelectors.add_bookmarked.classList.remove("d-none");
        setTimeout(()=>{
            UISelectors.add_bookmarked.classList.add("d-none");
        },3000)
    }
    //End of showAddedToBookmark

    // Public functions
    return{
        addToBookmarker,
        showState,
        hideState,
        showAlreadyAddedToBookmark,
        showAddedToBookmark
    }
})(UI);
//End of Bookmarker





//Start of Themes
const Theme = (function(UII){//UII is parameter
    //Private variables and functions
    const UISelectors = UII.getUISelectors();

    function showBtn(){
        UISelectors.theme_btn_apply.style = 
        "display:inline-block";
    }
    
    function change(id){
        UISelectors.body.classList.remove("light");
        UISelectors.body.classList.remove("colorful");
        UISelectors.body.classList.remove("dark");
        UISelectors.body.classList.add(id)
        saveToLocalStorage(id);

    }

    function saveToLocalStorage(id){
        localStorage.setItem("theme", id);
    }

    function getThemeLocalStorage(){
        return localStorage.getItem("theme");
    }


    // Public functions
    return{
        showBtn,
        change,
        getThemeLocalStorage,
    }
})(UI); //UI is passed.
//End of Themes





//Start of QuickSuggestions
const QuickSuggestions = (function(UII){
    // Private Variables & functions
    const UISelectors = UII.getUISelectors();

    function clearSuggestions(){
        suggestions.innerHTML = "";
    }

    function createSuggestions(wordsArr,limit=10){
        //Clearing Suggestions
        clearSuggestions();

        wordsArr.forEach(function(wordObj,index){
            if(index < limit)
            {
            let div = document.createElement("li");
            div.classList.add("lead");
            div.textContent = wordObj.word;
            UISelectors.suggestions.append(div);
            }
        })
    }

    async function getSuggestions(word){
        const response = await fetch(`https://api.datamuse.com/sug?s=${word}`);
        const json = await response.json();
        return json;
    }

    // Public functions
    return{
        getSuggestions,
        createSuggestions,
        clearSuggestions
    }
})(UI);
//End of QuickSuggestions





//Start of App
const App = (function(Api,LocalStorage,UI,Dictator,Bookmarker){
    //Private Variables & functions
    const UISelectors = UI.getUISelectors();

    // Start of getData
    function getData(word){

        UI.clearResults();
        UI.toggleLoader();

        Api.get(word)
        .then(res=>{
            if(res[0].fl !== undefined)//Correct word spelling has been entered
                UI.paintMeaning(res); //Called with arguments of array/arrays returned by api 
            else // Word entered is wrong spelt;
                UI.paintDidYouMean(res);// Called with array of words:["Coire", "desire", "Zaire", "sire"]
            UI.toggleLoader();
        })
        .catch(err=>{
            UI.paintError(err); //If Something goes wrong (Internet Connection is down.)
            UI.toggleLoader();
        })

    }
    // End of getData


    // Start of loadEventListener
    function loadEventListener(){

        // Start of Searching Listeners
        // Adding event Listener for Searching to btn and input
        UISelectors.btn_search.addEventListener("click",checkValid);
        UISelectors.input_lookup.addEventListener("keypress",function(e){
            if(e.key ==="Enter")
                checkValid();
        });
        // Check if input is not empty
        function checkValid(){
            let inputValue = UISelectors.input_lookup.value;
            UISelectors.input_lookup.value = "";

            if(inputValue !== "")
                getData(inputValue)
            
        }
        // End of Searching Listeners


        // Start of Dictating Related 
        speechSynthesis.addEventListener("voiceschanged",Dictator.populateSelect); // Runs when voices are loaded.

        Dictator.populateSelect();
    
        UISelectors.pitch_range.addEventListener("change", Dictator.pitch_range_OnChange);
        UISelectors.rate_range.addEventListener("change", Dictator.rate_range_OnChange);
        UISelectors.btn_speak.addEventListener("click", function(){
            Dictator.speak(UISelectors.input_to_speak.value);

            // For Storing in Local Storage
            let voiceName = UISelectors.select_voices.selectedOptions[0].value;
            let pitch = UISelectors.pitch_range.value;
            let rate = UISelectors.rate_range.value;

            LocalStorage.dictatorAdd(voiceName,rate,pitch);
        })
        UISelectors.btn_stop.addEventListener("click",function(e){
            Dictator.stop();
        });

        UISelectors.result.addEventListener('click',function(e){ //When a word is clicked from results
            e.preventDefault();
            if(e.target.tagName === "IMG"){
                let text = e.target.parentElement.parentElement.textContent; //desire  [di-ˈzī(-ə)r] || desire

                let index = text.indexOf("[");
                if(index>-1) // desire  [di-ˈzī(-ə)r] to remove '[di-ˈzī(-ə)r]' result after this 'desire ' 
                    text = text.substring(0,index-2);
                text = text.trim(); // removes extra spaces
                Dictator.speak(text);
            }
        })

        // End of Dictating Related 

    
        // Start of Bookmark
        // Start of addBookmark
        UISelectors.result.addEventListener("click", function(e){
            e.preventDefault();
            if(e.target.id==="bookmark-icon")
            {
                let alreadyPresent = false;
                let h1 = e.target.parentElement.parentElement; 
                let text = h1.getAttribute("value"); // h2.value = word i.e: desire
                let meaning = h1.parentElement.querySelector("ol li").textContent;
                // meaning = to long or hope for : exhibit or feel desire for

                //Getting Data from LocalStorage
                let array2d = LocalStorage.bookmarkGet();
                if(array2d){
                    array2d.forEach((array)=>{
                        if(array[0] === text)
                            alreadyPresent = true
                    })
                }

                if(alreadyPresent){
                    Bookmarker.showAlreadyAddedToBookmark(text);
                }
                else{ //if already is false then this runs
                    Bookmarker.showAddedToBookmark();
                    Bookmarker.addToBookmarker(text,meaning);
                    LocalStorage.bookmarkAdd(text,meaning);
                }
            }
        })
        // End of addBookmark

        // Start of deleteBookmark
        UISelectors.btn_delete.addEventListener("click",function(e){
            e.preventDefault();
            if(UISelectors.btn_delete.textContent==="Select Delete")
                Bookmarker.showState();
            else // when textContent = Delete
            {
                let checkboxes = document.querySelectorAll(UISelectors.checkbox_ADDRESS);
                checkboxes = Array.from(checkboxes);
                let numbers = [];

                checkboxes.forEach(function(checkbox){
                    let input = checkbox.querySelector("input");
                    let id = input.id; //customCheck1 || customCheck2 ...
                    let number = id.charAt(id.length -1); // 1 || 2..
                    if(input.checked){
                        numbers.push(parseInt(number)); // checked number = [1,2] is stored in array
                    }
                });
                LocalStorage.bookmarkDelete(numbers);
                Bookmarker.hideState();
                const loadDataFromLocalStorageFNS = loadDataFromLocalStorage(); //returns object containing loadBookmarker function
                loadDataFromLocalStorageFNS.loadBookmarker();
            }
        })
        // End of deleteBookmark
        // Start of goBackBookmark
        UISelectors.btn_back.addEventListener("click",function(e){
            e.preventDefault();
            Bookmarker.hideState();
        })
        // End of goBackBookmark
        // End of Bookmark


        //Start of Searchable
        document.body.addEventListener("click", function(e){
            if(e.target.classList.contains(UISelectors.searchable_ADDRESS))
            {
                e.preventDefault();
                let word = e.target.textContent; //word = desire
                $('#bookmarker').modal('hide'); //to Hide modal popup if shown
                getData(word);
            }
        })
        //End of Searchable


        //Start of Highlight
        let highlightedText = "";
        //Start of Showing and Hiding of highlightBox
        document.addEventListener("selectionchange", function(){
            let selection = window.getSelection();

            if(selection.isCollapsed===true) //If nothing is selected so hide.
                UI.hideHighlight();
            else{
                try{ // to get rid of error showing in console
                    let text = selection.focusNode.data;
                    let anchor_Offset = selection.anchorOffset;
                    let offset = selection.focusOffset;

                    highlightedText = text.substring(anchor_Offset,offset);
                    UI.showHighlight(highlightedText);
                }
                catch(error){}
            }
        })
        //End of Showing and Hiding of highlightBox

        //Hide highlightBox if already showing
        document.addEventListener('scroll',function(){
            UI.hideHighlight();
        })
        //Searching by btn-highlight-search
        UISelectors.highlight_btn_search.addEventListener('click',function(){
            getData(highlightedText);
        });
        //Searching by btn-highlight-pronounce
        UISelectors.highlight_btn_pronounce.addEventListener('click',function(){
            Dictator.speak(highlightedText);
        });
        //End of Highlight

        
        //Start of Themes EventListeners
        UISelectors.theme_checkboxes.forEach(function(checkbox){
            checkbox.addEventListener( 'change', function() {
            if(this.checked)
                Theme.showBtn();
        });
        });
        UISelectors.theme_btn_apply.addEventListener("click",function(e){
            e.preventDefault();
            let checked = "";
            UISelectors.theme_checkboxes.forEach(function(checkbox){
                if(checkbox.checked){
                    checked = checkbox;
                }   
            })
            Theme.change(checked.id);
        })
        //End of Themes EventListeners
        
        
        //Start of QuickSuggestions EventListeners
        UISelectors.suggestions.addEventListener("click", function(e){// on clicking on suggested word enters it into input box
            if(e.target.tagName==="LI"){
                //Clearing Suggestions
                QuickSuggestions.clearSuggestions();
        
                let li = e.target;
                UISelectors.input_lookup.value = li.textContent;
            }
        })
        
        UISelectors.input_lookup.addEventListener("keyup",function(e){ //
            let value = UISelectors.input_lookup.value;
        
            if(value!==""){
                QuickSuggestions.getSuggestions(value)
                .then(function(res){
                QuickSuggestions.createSuggestions(res);
                })
                .catch();
            }
            else //When Empty then clear suggestions
                QuickSuggestions.clearSuggestions();
        })
        //End of QuickSuggestions EventListeners
    }
    // End of loadEventListener


    // Start of loadDataFromLocalStorage
    function loadDataFromLocalStorage(){

        loadBookmarker();
        loadDictator();
        loadTheme();
        
        function loadBookmarker(){
            UISelectors.bookmarker_words.innerHTML = "";
            let bookmarkedArray = JSON.parse(localStorage.getItem("bookmarked"));
            if(bookmarkedArray) //if bookmarked is not null
            {
                bookmarkedArray.forEach(function(array){
                    Bookmarker.addToBookmarker(array[0],array[1]); // array[0] = word, array[1]=text
                })
            }
        }

        function loadDictator(){
            let object = LocalStorage.dictatorGet();
            if(object) //if object is not null
            {
                speechSynthesis.addEventListener("voiceschanged", function(){ // runs once voices are loaded.
                    UISelectors.rate_range.value = object.rate;
                    UISelectors.pitch_range.value = object.pitch;
                    Dictator.pitch_range_OnChange();
                    Dictator.rate_range_OnChange();
                    Dictator.changeVoice(object.voiceName);
                })
            }
        }

        function loadTheme(){
            let theme = Theme.getThemeLocalStorage();
            Theme.change(theme);
        }
        //Returning to use in deleteBookmark 
        return{
            loadBookmarker,
        }
    }
    // End of loadDataFromLocalStorage

    //Public functions
    return{
        init: function(){
            loadEventListener();
            loadDataFromLocalStorage();
        }
    }
})(Api,LocalStorage,UI,Dictator,Bookmarker);
//End of App

//Calling init
App.init();