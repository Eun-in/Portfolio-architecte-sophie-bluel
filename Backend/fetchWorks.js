async function fetchData() {
   try {
     const reponse = await fetch("http://localhost:5678/api/works");
     const works = await reponse.json();
     return [reponse,works]
   } catch (error) {
    console.log("error fetching" + error);
   }
  }
 export default fetchData 