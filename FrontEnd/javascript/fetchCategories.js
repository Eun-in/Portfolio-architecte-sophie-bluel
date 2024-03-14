async function fetchDataCat() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    return [response, data];
  } catch (error) {
    console.log("error fetching" + error);
  }
}
export default fetchDataCat;
