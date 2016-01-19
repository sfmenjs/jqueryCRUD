var firebase = "https://dokudoku.firebaseio.com/";
var movies = [];

function Movie(title, genre, rating) {
  this.title = title;
  this.genre = genre;
  this.rating = rating;
}

function getAllMovies() {
  $.ajax({ url: firebase + '.json', type: 'GET',
    success: function(response) {
      var elemString = '';
      //prop is the GUID (PK), response[prop] is the object we want
      for(var prop in response) {
        response[prop]._id = prop;
        movies.push(response[prop]);
        elemString += displayMovie(response[prop]);
      }
      $("#display-movies").html(elemString);
    }
  });
}

function createMovie() {
  // var title = document.getElementById('inpuTitle').value;
  var title = $('#inputTitle').val();
  var genre = $('#inputGenre').val();
  var rating = $('#inputRating').val();
  var movie = new Movie(title, genre, rating);

  $.ajax({ type: 'POST', url: firebase + '.json',
    data: JSON.stringify(movie),
    success: function(response) {
      //Onload function
      movie._id = response.name;
      movies.push(movie);
      //document.getElementById('display-movies').innerHTML += displayMovie(movie);
      $('#display-movies').append(displayMovie(movie));
    },
    error: function() {
      console.err('Could not post movie to database. Please try again later.');
    }
  });
  // document.getElementById('inputTitle').value = '';
  //inputTitle.value = inputGenre.value = inputRating.value = '';
  $('inputTitle').val(''); $('inputGenre').val('');
  $('inputRating').val('');
}

function showEditModal(i) {
  $('#myModal').modal('toggle');
  //document.getElementById('editTitle').value = movies[i].title;
  $('#editTitle').val(movies[i].title);
  $('#editGenre').val(movies[i].genre);
  $('#editRating').val(movies[i].rating);
  $('#edit-buttons').html('<button class="btn btn-primary" onclick="editMovie(\'' + movies[i]._id + '\')">Save</button>')
}

function editMovie(id) {
  //var title = document.getElementById('editTitle').value;
  var title = $('#editTitle').val();
  var genre = $('#editGenre').val();
  var rating = $('#editRating').val();
  var movie = new Movie(title, genre, rating);
  $.ajax({type: 'PUT', url: firebase + id + '/.json',
    data: JSON.stringify(movie),
    success: function() {
        $('#myModal').modal('toggle'); //close the edit modal
        for(var i = 0; i < movies.length; i++) {
          if(movies[i]._id === id) {
            movie._id = id; //movie doesn't have an id property yet
            movies[i] = movie; //replace the movie in the array
            //Rewrite this movie on the HTML page
            $('.movie-div:nth-child(' + (i + 1) + ')').html('<h2>' + movie.title + '</h2><h3>' + movie.genre + '</h3><h3>' + movie.rating + '</h3><div style="text-align:center;"><button class="btn btn-warning" onclick="showEditModal(' + movies.indexOf(movie) + ')">Edit</button><button class="btn btn-danger" onclick="deleteMovie(\'' + movie._id + '\')">&times;</button></div>');
          }
        }
    }
  });
}

function deleteMovie(id) {
  $.ajax({ type: 'DELETE', url: firebase + id + '/.json',
    success: function() {
      for(var i = 0; i < movies.length; i++) {
        if(movies[i]._id === id) {
          movies.splice(i, 1);
          //remove the box from the page, so the user sees the difference
          $('.movie-div:nth-child(' + (i + 1) + ')').remove();
          break;
        }
      } //end of for loop over movies array
    }
  });
}

function displayMovie(movie) {
  return '<div class="col-sm-4 movie-div" style="border: 1px solid grey; margin: auto;"><h2>' + movie.title + '</h2><h3>' + movie.genre + '</h3><h3>' + movie.rating + '</h3><div style="text-align:center;"><button class="btn btn-warning" onclick="showEditModal(' + movies.indexOf(movie) + ')">Edit</button><button class="btn btn-danger" onclick="deleteMovie(\'' + movie._id + '\')">&times;</button></div></div>'
}

getAllMovies();
