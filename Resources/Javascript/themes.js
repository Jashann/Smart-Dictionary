//Start of Themes
const Theme = (function(){//UII is parameter
    //Private variables and functions
    const UISelectors = {
        theme_btn_apply: document.querySelector("#btn-apply"),
        theme_checkboxes: document.querySelectorAll("#themes input"),
        body: document.body,
    }

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
})(); //UI is passed.
//End of Themes

function loadTheme(){
        let theme = Theme.getThemeLocalStorage();
        Theme.change(theme);
}
loadTheme();