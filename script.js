console.log('Lets Write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
       //Show all the song in the playlist
       let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
       songUL.innerHTML=""
       for (const song of songs) {
           songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
           <div class="info">
           <div>${song.replaceAll("%20"," ")}</div>
           <div>Sumit</div>
           </div>
           <div class="playnow">
           <span>Play Now</span>
           <img class="invert" src="play.svg" alt="">
           </div>
           </li>`
       }
       
       // Attach an event listner to each song
       Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
           e.addEventListener("click", element=>{
               console.log(e.querySelector(".info").firstElementChild.innerHTML)
               playMusic(e.querySelector(".info").firstElementChild.innerHTML)
           })
           
       })
    
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/`+track
    if(!pause){
        currentSong.play() 
        play.src = "pause.svg"
    }
    
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        }
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            // Get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="cs" class="card">
            <div  class="play">

                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg>

            </div>
            <img src="oneDirection.jpg" alt="">
            <h2>One Direction</h2>
            <p>Hits to boost your mood and fill you with happiness!</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() {
    
    //get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)
    console.log(songs)

    // Display all the album on the page
    displayAlbums()

    // Attach an event listner to play, next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close hamburger
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Previous clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>0){
            playMusic(songs[index-1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    
}
main()                   