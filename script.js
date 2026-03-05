const container = document.getElementById("posts");
const loader = document.getElementById("loader");
const searchBtn = document.getElementById("searchBtn");
const themeBtn = document.getElementById("themeBtn");

const apiKey = "df6f72dec09643a89c7c51de099d4454";

searchBtn.addEventListener("click", loadNews);

function loadNews(){

const query = document.getElementById("searchInput").value || "weather india";

loader.style.display="block";
container.innerHTML="";

const url=`https://api.allorigins.win/get?url=${encodeURIComponent(
`https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${apiKey}`
)}`;

fetch(url)

.then(res=>res.json())

.then(result=>{

loader.style.display="none";

const data = JSON.parse(result.contents);

data.articles.slice(0,9).forEach(article=>{

const card=document.createElement("div");
card.classList.add("card");

card.innerHTML=`

<img src="${article.urlToImage || 'https://via.placeholder.com/300'}">

<h3>${article.title}</h3>

<p>${article.description || "No description available"}</p>

<a href="${article.url}" target="_blank">Read Full News</a>

`;

container.appendChild(card);

});

})

.catch(error=>{
loader.style.display="none";
container.innerHTML="Failed to load news";
console.log(error);
});

}

/* dark mode */

themeBtn.addEventListener("click",()=>{
document.body.classList.toggle("dark");
});
