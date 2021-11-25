// Selectores
const postContainer = document.querySelector('.posts-container');
const loading = document.querySelector('.loader');

// https://jsonplaceholder.typicode.com/posts?_limit=10&_page=3
let limit = 9;
let page = 0;
let ultimaPelicula;

// OBSERVADOR
let observador = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        showLoading();
      }
    });
  },
  {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1.0,
  }
);

// FETCH POST
const getPost = async () => {
  const result = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await result.json();
  console.log(data);
  page++;
  return data;
};

const showPost = async () => {
  let posts = await getPost();
  const postHTML = posts
    .map((post, index) => {
      return `
      <div class="post">
            <div class="number">${post.id}</div>
            <div class="post-info">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
            </div>
        </div>
        `;
    })
    .join(' ');
  postContainer.innerHTML += postHTML;
  if (ultimaPelicula) {
    observador.unobserve(ultimaPelicula);
  }
  const peliculasMostradas = document.querySelectorAll('.post');
  ultimaPelicula = peliculasMostradas[peliculasMostradas.length - 1];
  observador.observe(ultimaPelicula);
};

// LOADER INTERACTIVE
const showLoading = () => {
  loading.style.opacity = '1';
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      showPost();
    });
  }, 1000);
};

// FILTRO
const filterPost = ({ target }) => {
  const value = target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');

  for (let post of posts) {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.includes(value) || body.includes(value)) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  }
};

// FUNCION INIT
function init() {
  window.addEventListener('DOMContentLoaded', async () => {
    let posts = await getPost();
    showPost(posts);

    filter.addEventListener('input', filterPost);
  });
}

// RUN PROGRAM
init();
