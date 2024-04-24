import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import './styles.css';

const baseUrl = 'https://pixabay.com/api/';
const apiKey = '42459296-f3a6b1338d11ae21b8ba0dee6';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [noMoreResults, setNoMoreResults] = useState(false);
  const [previousImages, setPreviousImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true); // Włączenie ikonki ładowania
      try {
        const searchParams = new URLSearchParams({
          q: searchQuery,
          page: pageCount,
          key: apiKey,
          image_type: 'photo',
          orientation: 'horizontal',
          per_page: perPage,
          safesearch: true,
        });
        const url = new URL(`${baseUrl}?${searchParams}`);
        const response = await axios.get(url);
        console.log(response.data);
        const nawImages = response.data.hits;
        const totalHits = response.data.totalHits;
        const totalPages = Math.ceil(totalHits / perPage);
        if (totalHits === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          throw new Error('No results found');
        }
        // if (page > totalPages) {
        //   Notiflix.Notify.failure("You've reached the end of search results.");
        //   loadMoreBtn.style.display = 'none';
        //   throw new Error('No more results');
        // }
        else {
          setImages(newImages);
          setPreviousImages(prevImages => [...prevImages, ...newImages]); // Aktualizacja poprzednich wyników
        }
        return { nawImages, totalHits, totalPages };
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false); // Wyłączenie ikonki ładowania
      }
    };
    fetchImages();
  }, [searchQuery, pageCount, perPage]);
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

  const handleSearch = searchImage => {
    setSearchQuery(searchImage);
    setPageCount(1);
    setNoMoreResults(false); // Resetowanie stanu informującego o braku kolejnych wyników
  };
  const handleLoadMore = async () => {
    setPage(prevPage => prevPage + 1);
    setLoader(true);
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${
          pageCount + 1
        }&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`
      );
      const newImages = response.data.hits;
      if (newImages.length === 0) {
        setNoMoreResults(true);
      } else {
        setImages(prevImages => [...prevImages, ...newImages]);
        setPreviousImages(prevImages => [...prevImages, ...newImages]); // Aktualizacja poprzednich wyników
      }
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
    setLoader(false);
  };

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
      {images.length > 0 && !noMoreResults && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
      {showModal && (
        <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
      )}
      {noMoreResults && (
        <p className="info-noMoreResults">No more results to display</p>
      )}
    </div>
  );
};
