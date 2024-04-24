import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import './styles.css';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [previousImages, setPreviousImages] = useState([]); // Dodany stan przechowujący poprzednie wyniki

  useEffect(() => {
    if (query === '') return;
    const fetchImages = async () => {
      setLoader(true); // Włączenie ikonki ładowania
      try {
        const baseUrl = 'https://pixabay.com/api/';
        const apiKey = '42459296-f3a6b1338d11ae21b8ba0dee6';
        const searchParams = new URLSearchParams({
          q: query,
          page: page,
          key: apiKey,
          image_type: 'photo',
          orientation: 'horizontal',
          per_page: 12,
          safesearch: true,
        });
        const response = await axios.get(`${baseUrl}?${searchParams}`);
        console.log(response.data);
        const newImages = response.data.hits;
        if (newImages.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          setImages(newImages);
          setPreviousImages(prevImages => [...prevImages, ...newImages]); // Aktualizacja poprzednich wyników
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoader(false); // Wyłączenie ikonki ładowania
      }
    };
    fetchImages();
  }, [query, page]);
  // Fetch z JS
  // async function fetchPhotos(searchTerm, page) {
  //   //   const response = await axios.get(
  //     `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  //   );
  //   console.log(response.data);
  //   const images = response.data.hits;
  //   const totalHits = response.data.totalHits;
  //   const totalPages = Math.ceil(totalHits / perPage);
  //   if (totalHits === 0) {
  //     Notiflix.Notify.failure(
  //       'Sorry, there are no images matching your search query. Please try again.'
  //     );
  //     throw new Error('No results found');
  //   }
  //   if (page > totalPages) {
  //     Notiflix.Notify.failure(
  //       "We're sorry, but you've reached the end of search results."
  //     );
  //     loadMoreBtn.style.display = 'none';
  //     throw new Error('No more results');
  //   }
  //   return { images, totalHits, totalPages };
  // }

  const handleSearch = searchQuery => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleLoadMore = async () => {
    setPage(prevPage => prevPage + 1);
    setLoader(true); // Włączenie ikonki ładowania
  };
  // loadMore z JS
  // loadMoreBtn.addEventListener('click', async () => {
  //   pageCount++;
  //   try {
  //     const { images, totalHits, totalPages } = await fetchPhotos(
  //       searchQuery,
  //       pageCount
  //     );
  //     renderPhotos({ images, totalHits });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  const handleImageClick = event => {
    const largeImageUrl = event.target.getAttribute('data-large');
    setModalImageUrl(largeImageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="app">
      <Searchbar handleSearch={handleSearch} />
      {loader ? (
        <Loader />
      ) : (
        <ImageGallery images={images} openModal={handleImageClick} />
      )}
      {images.length > 0 && <Button onClick={handleLoadMore}>Load More</Button>}
      {showModal && (
        <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
      )}
    </div>
  );
};

// JS homework 11 https://github.com/Luksord/goit-js-hw-11/tree/main/src
// import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const photoCard = document.querySelector('.photo-card');
// const searchForm = document.querySelector('.search-form');
// const searchInput = document.querySelector('[data-search]');
// const loadMoreBtn = document.querySelector('.load-more');

// const apiKey = '42459296-f3a6b1338d11ae21b8ba0dee6';
// let searchQuery = '';
// let pageCount = 1;
// const perPage = 40;

// loadMoreBtn.style.display = 'none';

// searchForm.addEventListener('submit', async event => {
//   event.preventDefault();
//   clearPhotoCard();
//   searchQuery = searchInput.value.trim();
//   if (searchQuery === '') {
//     Notiflix.Notify.info(`There is no valid query in the imput.`);
//     return; // Nie wykonuj wyszukiwania dla pustego zapytania
//   }
//   searchQuery = searchQuery.split(' ').join('+');
//   try {
//     pageCount = 1;
//     const { images, totalHits, totalPages } = await fetchPhotos(
//       searchQuery,
//       pageCount
//     );
//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//     renderPhotos({ images, totalHits });
//     loadMoreBtn.style.display = 'block';
//   } catch (error) {
//     console.log(error);
//   }
// });

// async function fetchPhotos(searchTerm, page) {
//   //   const response = await axios.get(
//     `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
//   );
//   console.log(response.data);
//   const images = response.data.hits;
//   const totalHits = response.data.totalHits;
//   const totalPages = Math.ceil(totalHits / perPage);
//   if (totalHits === 0) {
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     throw new Error('No results found');
//   }
//   if (page > totalPages) {
//     Notiflix.Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//     loadMoreBtn.style.display = 'none';
//     throw new Error('No more results');
//   }
//   return { images, totalHits, totalPages };
// }

// function renderPhotos(data) {
//   const images = data.images;
//   const markup = images
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `
//     <div class="photo-card-template">
//       <a href="${largeImageURL}" data-lightbox="gallery">
//         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//       </a>
//       <div class="info">
//         <p class="info-item"><b>Likes</b><br>${likes}</p>
//         <p class="info-item"><b>Views</b><br>${views}</p>
//         <p class="info-item"><b>Comments</b><br>${comments}</p>
//         <p class="info-item"><b>Downloads</b><br>${downloads}</p>
//       </div>
//     </div>
//   `
//     )
//     .join('');
//   photoCard.insertAdjacentHTML('beforeend', markup);
//   lightbox.refresh();
//   loadMoreBtn.style.display = 'block';
//   smoothScroll(cardHeight * 2);
// }

// /*
// const searchParams = new URLSearchParams({
//     key: apiKey,
//     q: searchQuery,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//     page: pageCount,
//     per_page: perPage,
//   });
//   console.log(searchParams);
//   const response = await fetch(`https://pixabay.com/api/?${searchParams}`).then((response) => response.json()).then((data) => console.log(data)).then({hits}) => {
//   const markupArray = hits.flatMap(
//     ({
//       webformatURL,
//       largeImageURL,
//       tags,
//       likes,
//       views,
//       comments,
//       downloads,
//     }) =>
//     `<div class="photo-card">
//         <a href="${largeImageURL}" data-lightbox="gallery">
//           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//         </a>
//         <div class="info">
//           <p class="info-item"><b>Likes</b><br>${likes}</p>
//           <p class="info-item"><b>Views</b><br>${views}</p>
//           <p class="info-item"><b>Comments</b><br>${comments}</p>
//           <p class="info-item"><b>Downloads</b><br>${downloads}</p>
//         </div>
//       </div>`
//   );
//   return markupArray;
// }
// markupArray => {
//   const gallery = document.querySelector('.gallery');
//   gallery.innerHTML = markupArray.join('');
// };
// */

// const lightbox = new SimpleLightbox('.photo-card a', {
//   captionsData: 'alt',
//   captionPosition: 'bottom',
//   captionDelay: 250,
// });
// lightbox.on('show.simplelightbox', function () {
//   lightbox.load();
// });

// async function smoothScroll(scrollAmount) {
//   await new Promise(resolve => {
//     window.scrollBy({
//       top: scrollAmount,
//       behavior: 'smooth',
//     });
//     setTimeout(resolve, 1000); // Opóźnienie wykonania kolejnej akcji
//   });
// }

// async function clearPhotoCard() {
//   photoCard.innerHTML = '';
// }
