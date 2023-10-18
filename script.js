document.getElementsByTagName('div')[document.getElementsByTagName('div').length-1].style.display = 'none'
let isPaused = true;
let isPlaying = false;
let id = 3;
let audio;
let actualTime;
let data = {
    track: []
}

if(localStorage.getItem('data') != null)   
    data = JSON.parse(localStorage.getItem('data'))
//funkcja do wyszukiwania piosenki
function search(element){
    document.getElementById("holder").innerHTML = "";
    let query = element.value.toUpperCase()
    data.track.forEach(item => {
        if(item.author.toUpperCase().includes(query) || item.name.toUpperCase().includes(query))
        {
            const it = document.createElement("div");
            const h = document.createElement('h2');
            h.classList.add('song-title')
            const div = document.createElement('div');
            div.classList.add('image');
            div.style.backgroundImage = item.thumbnail;
            h.innerText = item.name;
            const auth = document.createElement('div')
            auth.classList.add('block-author')
            it.classList.add('item');
            const flex = document.createElement('div')
            flex.classList.add('flex-position')
            flex.append(h)
            flex.append(auth)
            if(lightMode)
                item.classList.add('lightitem')   
            
            auth.innerText = item.author;
            it.append(div);
            it.append(flex);
            document.getElementById("holder").append(it);
            addEventListeners();
        }
    })
}

//funkcja do pauzowania muzyki
function pause() {
    const ICON_PAUSE = document.getElementById("iconPause");
    if(isPaused)
    {
        ICON_PAUSE.classList.remove("fa-pause");
        ICON_PAUSE.classList.add("fa-play");
        audio.pause();
        isPaused = false;
    }else{
        ICON_PAUSE.classList.remove("fa-play");
        ICON_PAUSE.classList.add("fa-pause");
        audio.play();
        isPaused = true;
    }
}

//funkcja dostosowujaca glosnosc muzyki
function volume(element) {
    audio.volume = element.value / 100;
    const VOLUME = document.getElementById("iconVolume"); 
    if(audio.volume < 0.7)
    {
        VOLUME.classList.add("fa-volume-low")
        VOLUME.classList.remove("fa-volume-high")
        VOLUME.classList.remove("fa-volume-xmark")
    }
    if(audio.volume > 0.7 && audio.volume < 1){
        VOLUME.classList.add("fa-volume-high")
        VOLUME.classList.remove("fa-volume-low")
        VOLUME.classList.remove("fa-volume-xmark")
    }
    if(audio.volume === 0)
    {
        VOLUME.classList.add("fa-volume-xmark")
        VOLUME.classList.remove("fa-volume-low")
        VOLUME.classList.remove("fa-volume-high")
    }
}
//funkcja naprawiająca błąd zwiazany z przestarzałym linkiem źródła
function refresh(){
    let updatedData = data;
    data = {track:[]};

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '67051636admshf38e532aae08983p1ebd02jsn1d729bc8a622',
            'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com'
        }
    };

    updatedData.track.forEach((track) => {
    fetch('https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=' + track.ytLink, options)
    .then(response => response.json())
    .then(response => {
        data.track.push({
            id: track.id,
            name: track.name,
            author: track.author,
            thumbnail: track.thumbnail,
            path: response.audios.items[0].url,
            ytLink: track.ytLink,
        })
    }).then(() => {
        localStorage.setItem('data', JSON.stringify(data));
        generateData()
        addEventListeners()
    })
    .catch(err => console.error(err));
    })

}



//funkcja zmieniajaca tryb aplikacji (jasny/ciemny)
let lightMode = false;
function mode(){
    lightMode = lightMode ? false : true;
    document.body.classList.toggle("light")     
    for (let index = 0; index < document.getElementsByClassName("item").length; index++)
        document.getElementsByClassName("item")[index].classList.toggle("lightclickable")

    document.getElementById("bellow").classList.toggle("lightitem")
    document.getElementById("browsefile").classList.toggle("lightitem")
    document.getElementById("add").classList.toggle("lightitem")
}

//funkcja dodajaca wlasna muzyke do obiektu tracks
function addMusic(){
    const TITLE = document.getElementById("titl");
    const AUTHOR = document.getElementById("auth");
    
    if(document.getElementById("link").value == ''){
        const file = document.getElementById("inputTag").files[0]
        const blobURL = URL.createObjectURL(file);
        data.track.push({
            id: ++id,
            name: TITLE.value,
            author: AUTHOR.value,
            thumbnail: '',
            path: blobURL,
            ytLink: 'null',
        })
        localStorage.setItem('data', JSON.stringify(data));
    }else{
        let ID = document.getElementById("link").value;
        ID = ID.slice(ID.indexOf('=')+1,ID.indexOf('&'))
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '67051636admshf38e532aae08983p1ebd02jsn1d729bc8a622',
                'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com'
            }
        };
        fetch('https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=' + ID, options)
        .then(response => response.json())
        .then(response => {
            data.track.push({
                id: ++id,
                name: response.title,
                author: response.channel.name,
                thumbnail: 'url(' + response.thumbnails[0].url + ')',
                path: response.audios.items[0].url,
                ytLink: ID
            })
        }).then(() => {
            localStorage.setItem('data', JSON.stringify(data));
            generateData()
            addEventListeners()
        })
        .catch(err => console.error(err));

    }
    document.getElementById("browsefile").style.display = "none";

}

//funkcja generująca kafelki
function generateData(){
    document.getElementById("holder").innerHTML = ""
    data.track.forEach(track =>{
        const item = document.createElement("div");
        const h = document.createElement('h2');
        h.classList.add('song-title')
        const div = document.createElement('div');
        div.classList.add('image');
        div.style.backgroundImage = track.thumbnail;
        div.style.backgroundSize = 'cover'
        div.style.backgroundPosition = 'center'
        h.innerText = track.name;
        const auth = document.createElement('div')
        auth.classList.add('block-author')
        item.classList.add('item');
        const flex = document.createElement('div')
        flex.classList.add('flex-position')
        flex.append(h)
        flex.append(auth)

        if(lightMode)
            item.classList.add('lightitem')   
        
        auth.innerText = track.author;
        
        item.append(div);
        item.append(flex);
        
        
        document.getElementById("holder").append(item);
    })        
}


//funkcja zmienia aktualny moment piosenki na miejsce klikniecia
function change(){
    audio.currentTime = document.getElementById("duration").value;
}

//funkcja zmienia status petli odtwarzania (wlaczona/wylaczona)
let isloop = false;
function loop(){
    isloop = isloop ? false : true;
}

//funkcja dodaje obsluge klikniecia na kady kafelek
function addEventListeners(){
    for (let index = 0; index < document.getElementsByClassName("item").length; index++) {
            document.getElementsByClassName("item")[index].addEventListener("click", () => {
            document.title = data.track[index].author + " - " + data.track[index].name;
            if(typeof audio == 'object')
                audio.pause();
            document.getElementById("bottom").style.display = "block";
            document.getElementById("artist").innerText = data.track[index].author
            document.getElementById("title").innerText = data.track[index].name
            document.getElementById("image").style.backgroundImage = data.track[index].thumbnail;
            document.getElementById("")
            audio = new Audio(data.track[index].path)
            audio.play();
            isPaused = audio.paused ? true : false;
            pause();
            audio.onloadedmetadata = () => {
            setInterval(() => {
                actualTime = audio.currentTime
                document.getElementById("duration").setAttribute("max", parseInt(audio.duration))
                document.getElementById("duration").value = actualTime
                if(isloop && audio.currentTime == audio.duration)
                {
                    audio.currentTime = 0;
                    audio.play();
                }        
            },500);
            }
        })
    }
}
