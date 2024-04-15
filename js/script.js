console.log("vishal pal");
let currentSong = new Audio();

let songs;
let currFolder;
function stm(seconds) {
  if(isNaN(seconds) || seconds < 0){
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2,'0');

  return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }


    // show all the songs in the palylist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
  <img class="invert" src="images/musical-note.svg" alt="Music">
  <div class="info">
    <div>${song.replaceAll("%20", " ")}</div>
    <div>vishal</div>
  </div>
  <div class="playnow">
    <span>Play Now</span>
    <img class="invert" src="images/play-circle (1).svg" alt="playcircle">
  </div>
</li>`;
  }

//Attach event listener to each song

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  });
})
 return songs;

}

const playMusic = (track, pause=false) => {
  currentSong.src = `/${currFolder}/` + track;
  if(!pause){
  currentSong.play();
  play.src = "images/playBarIcon/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

};




(async function displayAlbums() {
  console.log("displaying albums");
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if(e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-1)[0];
    
      // Get the Metdata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder=${folder} class="card">
      <div class="play">
        <img src="images/play-outline.svg" alt="playbutton">
      </div>
        <img src="/songs/${folder}/cover.jpeg" alt="card1">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
    </div>`
    }
}


//load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e => {
  e.addEventListener("click",async item => {
    console.log("fetching songs");
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0]);
  })
});

  
})();




(async function main() {
  //get the list of all songs
  await getSongs("songs/cs");
  playMusic(songs[0],true)

  //Display all the albums on the page


//attach an event listener to play/pause

play.addEventListener("click", () => {
  if(currentSong.paused){
    currentSong.play();
    play.src = "images/playBarIcon/pause.svg";
  }else{
    currentSong.pause();
    play.src = "images/playBarIcon/play.svg";
  }
})


// Add event listener for time update
currentSong.addEventListener("timeupdate", () =>{
  document.querySelector(".songTime").innerHTML = `${stm(currentSong.currentTime)} / ${stm(currentSong.duration)}`;
  document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})


// add an eventlistener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration)* percent) / 100;
})


// Add event listener for menubtn
document.querySelector(".nav").addEventListener("click", () =>{
  document.querySelector(".left").style.left = "0";
})

// Add event listener for closebtn
document.querySelector(".close").addEventListener("click", () =>{
  document.querySelector(".left").style.left = "-100%";
})

// Add an event listener to previous
previous.addEventListener("click", () => {
  console.log("previous clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if((index-1) >= 0){
    playMusic(songs[index -1])
  };
})

// Add an event listener to next
next.addEventListener("click", () => {
  console.log("Next clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if((index+1) < songs.length){
    playMusic(songs[index + 1])
  };
})


// Add an event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  console.log("Set volume to",e.target.value);
  currentSong.volume = parseInt(e.target.value)/100;

})





// Add event listener to mute the track

document.querySelector(".volume>img").addEventListener("click", e => {
  if(e.target.src.includes("images/volume-up.svg")){
    e.target.src = e.target.src.replace("volume-up.svg","volume-mute.svg");
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }else{
    e.target.src = e.target.src.replace("volume-mute.svg","volume-up.svg");
    currentSong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
})




})();
