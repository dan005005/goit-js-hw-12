export const fetchImages = async value => {
  const respons = await fetch(
    `https://pixabay.com/api/?key=31800059-86399197816311d7a5cbd5e2b&q=${value}&image_type=photo&pretty=true&orientation=horizontal`
  );
  const data = await respons.json();
  return data.hits;
};
