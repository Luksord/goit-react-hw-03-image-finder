import '../styles.css';
import { useState } from 'react';
import Notiflix from 'notiflix';

export const Searchbar = ({ handleSearch }) => {
  const [query, setQuery] = useState('');

  const onChange = event => {
    setQuery(event.target.value);
  };

  const onSubmit = event => {
    event.preventDefault();
    if (query.trim() === '') {
      Notiflix.Notify.info('Please enter a valid search term.');
      return;
    }
    handleSearch(query);
  };
  // Search z JS
  //   searchForm.addEventListener('submit', async event => {
  //     event.preventDefault();
  //     clearPhotoCard();
  //     searchQuery = searchInput.value.trim();
  //     if (searchQuery === '') {
  //       Notiflix.Notify.info(`There is no valid query in the imput.`);
  //       return; // Nie wykonuj wyszukiwania dla pustego zapytania
  //     }
  //     searchQuery = searchQuery.split(' ').join('+');
  //     try {
  //       pageCount = 1;
  //       const { images, totalHits, totalPages } = await fetchImages(
  //         searchQuery,
  //         pageCount
  //       );
  //       Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  //       renderPhotos({ images, totalHits });
  //       loadMoreBtn.style.display = 'block';
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });

  return (
    <header className="searchbar">
      <form className="searchForm" onSubmit={onSubmit}>
        <input
          className="searchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images..."
          value={query}
          onChange={onChange}
        />
        <button type="submit" className="searchForm-button">
          <span className="searchForm-button-label">Search</span>
        </button>
      </form>
    </header>
  );
};
