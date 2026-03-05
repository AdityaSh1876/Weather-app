const container = document.getElementById("posts");

container.innerHTML = "Loading weather news...";

const apiKey = "df6f72dec09643a89c7c51de099d4454";

const url = `https://newsapi.org/v2/everything?q=weather&language=en&sortBy=publishedAt&apiKey=${df6f72dec09643a89c7c51de099d4454}`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response failed");
    }
    return response.json();
  })
  .then(data => {

    container.innerHTML = "";

    data.articles.forEach(article => {

      const card = document.createElement("div");
      card.classList.add("card");

      const title = article.title || "No title available";
      const description = article.description || "No description available";
      const link = article.url || "#";

      card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="${link}" target="_blank">Read Full News</a>
      `;

      container.appendChild(card);

    });

  })
  .catch(error => {
    container.innerHTML = "Error loading weather news.";
    console.error("Fetch error:", error);
  });

