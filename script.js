const button = document.getElementById("loadPosts");
const container = document.getElementById("posts");

button.addEventListener("click", loadPosts);

function loadPosts(){

container.innerHTML="Loading Weather News...";

const apiKey="df6f72dec09643a89c7c51de099d4454";

const url=`https://api.allorigins.win/get?url=${encodeURIComponent(
`https://newsapi.org/v2/everything?q=weather india&language=en&sortBy=publishedAt&apiKey=${apiKey}`
)}`;

fetch(url)

.then(response=>response.json())

.then(result=>{

const data=JSON.parse(result.contents);

container.innerHTML="";

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

container.innerHTML="Error loading news";

console.log(error);

});

}
