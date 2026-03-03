const loadBtn = document.getElementById("loadBtn");
const postsDiv = document.getElementById("posts");
const loadingText = document.getElementById("loading");

loadBtn.addEventListener("click", fetchPosts);

function fetchPosts() {
    loadingText.innerText = "Loading posts...";
    postsDiv.innerHTML = "";

    Promise.all([
        fetch("https://newsdata.io/api/1/latest?apikey=pub_23b5653d62b141b3b9ca9a16be5cd261&q=Weather%20news%20in%20india%20")
  .then(res => res.json())
  .then(data => {
      console.log(data);

      if (data.status === "success") {
          data.results.slice(0, 10).forEach(article => {
              const card = document.createElement("div");
              card.classList.add("card");

              card.innerHTML = `
                  <h3>${article.title}</h3>
                  <p>${article.description || "No description available"}</p>
              `;

              postsDiv.appendChild(card);
          });
      } else {
          loadingText.innerText = "API Error";
      }
  })
  .catch(error => {
      console.log(error);
      loadingText.innerText = "Network Error";
  });
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([posts, users]) => {
        loadingText.innerText = "";

        posts.slice(0, 12).forEach(post => {
            const user = users.find(u => u.id === post.userId);

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <small><strong>Author:</strong> ${user.name}</small>
            `;

            postsDiv.appendChild(card);
        });
    })
    .catch(error => {
        loadingText.innerText = "Error loading posts.";
        console.error(error);
    });
}