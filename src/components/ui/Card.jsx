/**
 * Card component - Reusable UI wrapper component
 */
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
