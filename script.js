const input = document.getElementById('autocomplete');
const dropdown = document.getElementById('dropdown');
const repositoryList = document.getElementById('repository-list');

let timeoutId;

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

async function fetchRepositories(query) {
  if (!query) {
    dropdown.style.display = 'none';
    return;
  }

  const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
  const data = await response.json();
  showDropdown(data.items || []);
}

function showDropdown(repositories) {
  dropdown.innerHTML = '';
  if (repositories.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  repositories.forEach(repo => {
    const div = document.createElement('div');
    div.textContent = repo.name;
    div.onclick = () => selectRepository(repo);
    dropdown.appendChild(div);
  });

  dropdown.style.display = 'block';
}

function selectRepository(repo) {
  const div = document.createElement('div');
  div.className = 'repository-item';
  div.innerHTML = `
    <span>
      <strong>Name:</strong> ${repo.name} <br>
      <strong>Owner:</strong> ${repo.owner.login} <br>
      <strong>Stars:</strong> ${repo.stargazers_count}
    </span>
    <button class="remove-btn" onclick="this.parentElement.remove()">X</button>
  `;

  repositoryList.appendChild(div);
  input.value = '';
  dropdown.style.display = 'none';
}

input.addEventListener('input', debounce((e) => fetchRepositories(e.target.value), 500));
