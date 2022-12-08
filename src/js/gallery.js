import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
// Change code below this line

const refs = {
  searchForm: document.querySelector('#search-form'),
  galereyList: document.querySelector('.gallery'),
};

const lightboxOptions = {
  // captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
};

const lightbox = new SimpleLightbox('.gallery a', lightboxOptions);

const handleInputForm = event => {
  event.preventDefault();
  console.log(event.target.elements.searchQuery.value);
  const { value } = event.target.elements.searchQuery;
  fetchImages(value)
    .then(dataArr => {
      refs.galereyList.insertAdjacentHTML(
        'beforeend',
        renderImageCards(dataArr)
      );
      lightbox.refresh();
      // new SimpleLightbox('.gallery a', lightboxOptions);
    })
    .catch(error => console.log(error));
};

function renderImageCards(galleryItems) {
  return galleryItems
    .map(
      ({
        webformatURL,
        tags,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="gallery__item"><a class="gallery__link" href="${largeImageURL}">
    <img class="gallery__image" src="${webformatURL}" 
    alt="${tags}" />
<div class="info">
    <h3 class="info-item">
      <b>Likes</b>
      <br>${likes}</br>
    </h3>
    <h3 class="info-item">
      <b>Views</b>
      <br>${views}</br>
    </h3>
    <h3 class="info-item">
      <b>Comments</b>
      <br>${comments}</br>
    </h3>
    <h3 class="info-item">
      <b>Downloads</b>
      <br>${downloads}</br>
    </h3>
  </div></a></div>`;
      }
    )
    .join('');
}

function onGaleryListClick(event) {
  event.preventDefault();
  if (!event.target.classList.contains('gallery__image')) {
    return;
  }
}
refs.searchForm.addEventListener('submit', handleInputForm);
refs.galereyList.addEventListener('click', onGaleryListClick);
