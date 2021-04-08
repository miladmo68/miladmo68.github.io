// import { firebaseConfig } from './keys.js';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBs-Mhr4HTI65pampDoAV6-NhM96aB4fHA",
  authDomain: "sample3-36801.firebaseapp.com",
  projectId: "sample3-36801",
  storageBucket: "sample3-36801.appspot.com",
  messagingSenderId: "48450131549",
  appId: "1:48450131549:web:3e6e1803bbb6e38bed1fb4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


/// read firbase
const getFansongs = async () => {
  const data = await db.collection('songs').get();

  const songs = [];
  data.docs.forEach(doc => {
    songs.push({
      id: doc.id,
      ...doc.data()
    })
  });
   console.log('songs', songs);
  return songs;
};

// write data to DOM
const render = async () => {
  //const PlaylistContainer = document.getElementById('playlist');
  const PlaylistContainer = document.querySelector('#playlist tbody ')
  const songs = await getFansongs();
  PlaylistContainer.innerHTML = '';

  songs.forEach((songItem, i) => {

        PlaylistContainer.innerHTML += `
      <tr>
        <td>${songItem.name}</td>
        <td>${songItem.artist}</td>
        <td>${songItem.song}</td>
        <td>        
        <i  id="heart${i}" class="fa fa-heart pull-left heart" data-id="${songItem.id}"> ${songItem.votes} </i>
        </td>

        <td>
        <i  id="increment${i}" class="fa fa-thumbs-up upvote pull-left " data-id="${songItem.id}"></i>
        <i  id="decrement${i}" class="fa fa-thumbs-down downvote pull-left " data-id="${songItem.id}"></i>
        <i  id="trash${i}" class="fa fa-trash pull-left delete" data-id="${songItem.id}"></i>
        
        </td>
      </tr>
    `;
  });

  addDeleteListeners();
  incrementListeners();
  decrementListeners();
}
// Delete
function deletSsong(id) {
  // find message whose objectId is equal to the id we're searching with
  return db.collection('songs').doc(id).delete();
}
function addDeleteListeners() {
  let deletes = document.querySelectorAll('.delete');
  for (let i = 0; i < deletes.length; i++) {
    deletes[i].addEventListener('click', async (e) => {
      await deletSsong(e.target.dataset.id);
      render();
    });
  }

}

//Vote UP
function upVoteSong(id) {
  // find message whose objectId is equal to the id we're searching with
  return db.collection('songs').doc(id).update({
    votes: firebase.firestore.FieldValue.increment(1)
  });
}
function incrementListeners() {
  let upVote = document.querySelectorAll('.upvote');
  for (let i = 0; i < upVote.length; i++) {
    upVote[i].addEventListener('click', async (e) => {
      console.log('inVote works');
      await upVoteSong(e.target.dataset.id);
      render();
    });
  }
}

//Vote Down
function downVoteSong(id) {
  // find message whose objectId is equal to the id we're searching with
  return db.collection('songs').doc(id).update({
    votes: firebase.firestore.FieldValue.increment(-1)
  });
}
function decrementListeners() {
  let downVote = document.querySelectorAll('.downvote');
  for (let i = 0; i < downVote.length; i++) {
    downVote[i].addEventListener('click', async (e) => {
      console.log('inVote works');
      await downVoteSong(e.target.dataset.id);
      render();
    });
  }
}

const onLoadHandler = async () => {


////////////////////////////////////////////////////
// ArtistNews is an object but you can think of it as a lookup table
var ArtistNews = {
  'Billie Eilish': ['Bury A Friend', 'Bad Guy', 'When I Was Older', 'Bellyache', 'Everything I Wanted'],
  'Adele': ['Hello', 'Rolling In The Deep', 'Chasing Pavements', 'Someone Like You', 'Set Fire To The Rain'],
  'Rihanna': ['Love The Way You Lie', 'Run This Town', 'Rude Boy', 'Shut Up And Drive', 'What is My Name']
},
// just grab references to the two drop-downs
ArtistNew_select = document.querySelector('#ArtistNew'),
songNew_select = document.querySelector('#songNew');

// populate the ArtistNewinces drop-down
setOptions(ArtistNew_select, Object.keys(ArtistNews));
// populate the songNew drop-down
setOptions(songNew_select, ArtistNews[ArtistNew_select.value]);

// attach a change event listener to the ArtistNewinces drop-down
ArtistNew_select.addEventListener('change', function() {
// get the songNews in the selected ArtistNewince
setOptions(songNew_select, ArtistNews[ArtistNew_select.value]);
});

function setOptions(dropDown, options) {
// clear out any existing values
dropDown.innerHTML = '';
// insert the new options into the drop-down
options.forEach(function(value) {
dropDown.innerHTML += '<option value="' + value + '" name="' + value + '">' + value + '</option>';
console.log(value);

});
}  
////////////////////////////////////////////////////////////////////

  // click listener for submission
  document.getElementById('sendForm').addEventListener('submit', (event) => {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const songInput = document.getElementById('song');
    const artistInput = document.getElementById('artist');

    if(nameInput.value === '' || songInput.value === ''){
      alert('Fill out the form!!!');
    }else{
    db.collection("songs").add(
      {
        name: nameInput.value,
        song: songInput.value,
        artist: artistInput.value,
        votes: 0
      }
    ).then(() => {
      //alert('success to submit your message');
      nameInput.value = '';
      songInput.value = '';
      artistInput.value = '';

    });

    // this render after submit
    render();
  }
  });


  // click listener for submission
  document.getElementById('sendForm1').addEventListener('submit', (event) => {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault();
    const nameInput = document.getElementById('name1');
    const songInput = document.getElementById('songNew');
    const artistInput = document.getElementById('artistNew');
 //console.log('innnnnnnnnnnnnn'+artistInput);
    if(nameInput.value === ''){
      alert('Fill out the form!!!');
    }else{
    db.collection("songs").add(
      {
        name: nameInput.value,
        song: songInput.value,
        artist: artistInput.value,
        votes: 0
      }
    ).then(() => {
      //alert('success to submit your message');
      nameInput.value = '';
      //songInput.value = '';
      //artistInput.value = '';

    });

    // this render after submit
    render();
  }
  });

  // On first load
  render();
  addDeleteListeners();
  incrementListeners();
  decrementListeners();
};





// Wait for DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoadHandler);
  console.log('load');
} else {
  onLoadHandler();
  console.log('load');

}
