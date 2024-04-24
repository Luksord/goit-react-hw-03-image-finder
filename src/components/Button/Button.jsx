import '../styles.css';

export const Button = ({ onClick }) => {
  return (
    <div className="button-container">
      <button onClick={onClick} className="button">
        Load more images
      </button>
    </div>
  );
};
