import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';

// refs
const refs = {
  searchForm: document.querySelector('#search-form'),
  galereyList: document.querySelector('.gallery'),
  loadingMark: document.querySelector('.loading'),
  inputText: document.querySelector('.search-txt'),
};

//Options
const lightboxOptions = {
  // captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
};
const intersectionOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};

//Var
let page = 0;
let dataArr = [];
let fatchValue = '';
let checkLoading = false;
let totalHits = 0;
let dataTotalHits = 0;

//functions

const putFetch = () => {
  fetchImages(fatchValue, page)
    .then(data => {
      dataArr = data.hits;
      dataTotalHits = data.totalHits;
      if (totalHits === 21) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else {
        renderImageCards(data.hits);
        lightbox.refresh();
        refs.loadingMark.classList.remove('disable');
        page += 1;
        if (totalHits > data.totalHits) {
          Notiflix.Report.failure(
            'Sorry',
            "But you've reached the end of search results.",
            'OK'
          );
          return;
        }
      }
    })
    .catch(error => console.log(error));
};

const handleInputForm = event => {
  event.preventDefault();
  if (event.target.elements.searchQuery.value.trim() === '') {
    Notiflix.Notify.failure('Pleace, fill the field');
  } else {
    refs.galereyList.innerHTML = '';
    fatchValue = event.target.elements.searchQuery.value.trim();
    page = 1;
    totalHits = 0;
    refs.loadingMark.classList.add('disable');
    putFetch();
    refs.inputText.value = '';
  }
};

const renderImageCards = galleryItems => {
  const markup = galleryItems
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
  refs.galereyList.insertAdjacentHTML('beforeend', markup);
};

const hendelIntersect = event => {
  checkLoading = event[0].isIntersecting;
  if (totalHits > dataTotalHits) {
    refs.loadingMark.classList.add('disable');
  }
  if (checkLoading === true && fatchValue !== '') {
    if (page > 1) {
      putFetch();
      // page += 1;
    }
    // page += 1;
    totalHits += 21;
  }
};

//Classes
const lightbox = new SimpleLightbox('.gallery a', lightboxOptions);
const observer = new IntersectionObserver(hendelIntersect, intersectionOptions);

//Listeners
observer.observe(refs.loadingMark);
refs.searchForm.addEventListener('submit', handleInputForm);
