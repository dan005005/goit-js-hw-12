import axios from 'axios';

export const fetchImages = async (value, page) => {
  const respons = await axios.get(
    `https://pixabay.com/api/?key=31800059-86399197816311d7a5cbd5e2b&q=${value}&image_type=photo&pretty=true&orientation=horizontal&page=${page}&per_page=21`
  );
  const respValue = await respons;
  return respValue.data;
};
