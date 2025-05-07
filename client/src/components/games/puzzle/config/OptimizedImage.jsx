import React from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ 
  src, 
  alt, 
  width = 300,
  height = 300,
  className = '',
  loading = 'eager',
  fetchPriority = 'high'
}) => {
  // Simplificar el componente para enfocarnos primero en que funcione
  return (
    <img 
      src={src} 
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority} 
      className={className}
    />
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  loading: PropTypes.string
};

export default OptimizedImage;