const drop = document.getElementById("wrapper_dropdown");
const lists = document.getElementById("list");
const loc = document.getElementById("location");
var country_name = document.getElementById("count");
var error = document.getElementById("error");

var list, val, curr;

const api = {
    key: "7dcf46cef743e8c283f02f43f947010f",
    baseurl: "https://api.openweathermap.org/data/2.5/",
}

getLocation();

//--------load JSON--------

let http = new XMLHttpRequest();
http.open('get', './json/countries.json', true);
http.send();
http.onload = function () {

    if (this.readyState == 4 && this.status == 200) {
        list = JSON.parse(this.responseText);

        let output = "";

        for (let item of list) {
            output += `<li id="${item.code}">${item.name}</li>`;
        }

        document.querySelector(".list").innerHTML = output;
    }
}

//------- Arrow---------
drop.addEventListener("click", () => {
    document.getElementById("arrow").classList.toggle("arrow_up");
    lists.classList.toggle("display");
});

//--------Get lat and long--------

function getLocation() {

    if (navigator.geolocation) {
        var options = { timeout: 60000 };
        navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
    } else {
        alert("Sorry, browser does not support geolocation!");
    }
}

function showLocation(position) {
    var lattitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // lattitude = 48.9244019;
    // longitude = -79.6788007;

    let query = 'lat=' + lattitude + '&lon=' + longitude;

    getResult(query);
}

function errorHandler(err) {
    if (err.code == 1) {
        alert("Error: Access is denied!");
    } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}

//-------get country------

function getResult(query) {
    fetch(`${api.baseurl}weather?${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}

function displayResults(weather) {

    curr = `${weather.sys.country}`;

    country_name.innerHTML = curr;

    val = list.findIndex(function (item) {
        return item.code == curr;
    });

    loc.innerHTML = list[val].name+" (Current Location)";
}

lists.addEventListener('click', (e) => {
    loc.innerHTML = e.target.getInnerHTML();

    val = list.findIndex(function (item) {
        return item.name == e.target.getInnerHTML();
    });

    country_name.innerHTML = list[val].code;

    if(list[val].code==curr){
        error.classList.add("hide");
    }else{
        error.classList.remove("hide");
    }
})
