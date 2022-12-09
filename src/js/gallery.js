import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';

// refs
const refs = {
  searchForm: document.querySelector('#search-form'),
  galereyList: document.querySelector('.gallery'),
  loadingMark: document.querySelector('.loading'),
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
let page = 1;
let dataArr = [];
let fatchValue = '';
let checkLoading = false;

//functions
const putFetch = () => {
  fetchImages(fatchValue, page)
    .then(data => {
      dataArr = data;
      if ((data = [])) {
        Notiflix.Notify.failure('Qui timide rogat docet negare');
      }
      console.log('data', data);
      renderImageCards(data);
      lightbox.refresh();
    })
    .catch(error => console.log(error));
};

const handleInputForm = event => {
  event.preventDefault();
  refs.galereyList.innerHTML = '';
  refs.loadingMark.classList.remove('disable');
  page = 1;
  console.log(event.target.elements.searchQuery.value);
  fatchValue = event.target.elements.searchQuery.value;
  putFetch();
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
  // console.log(checkLoading);
  if (checkLoading === true && fatchValue !== '') {
    page += 1;
    putFetch();
    console.log(page);
  }
};

//Classes
const lightbox = new SimpleLightbox('.gallery a', lightboxOptions);
const observer = new IntersectionObserver(hendelIntersect, intersectionOptions);

//Listeners
observer.observe(refs.loadingMark);
refs.searchForm.addEventListener('submit', handleInputForm);
