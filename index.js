const api = 'https://jsonplaceholder.typicode.com/'

const fetchData = async (url) => {
  try {
    let response = await fetch(`${api + url}`)
    let data = await response.json();
    if (data) {
      return data
    }
    else console.log("Error fetching data.")
  } catch (err) {
    console.error(err)
  }
}

const getAllData = async () => {
  let posts = await fetchData('posts')
  let users = await fetchData('users')

  for (let i=0; i<posts.length; i++) {
    const post = posts[i]
    const { userId } = post;
    const user = users.find(item => item.id === userId);
    const { name, username } = user;
    posts[i] = { ...post, name, username }
  }

  displayData(posts)

  let isSorted = false;
  const handleSort = () => {
    sortData(posts, isSorted)
    isSorted = !isSorted
    sortButton.textContent = `Sort by Title ${isSorted ? "[Z-A]" : "[A-Z]"}`
  }

  const sortButton = document.getElementById("sort-btn")
  sortButton.addEventListener("click", handleSort)

  const groupButton = document.getElementById("group-btn")
  groupButton.addEventListener("click", () => groupData(posts))
}

const displayData = (posts) => {
  let bottom = document.querySelector(".content-bottom")
  bottom.innerHTML = '';

  for (post of posts) {
    const { title, body, name, username } = post;

    const content =  `
      <h1 class="content-title">${title}</h1>
      <small class="content-small">Posted by: ${name} @${username}</small>
      <p class="content-body">${body}</p>
    `
    const div = document.createElement("div")
    div.classList.add("content-item");
    div.innerHTML = content;

    bottom.appendChild(div)
  }
}

window.addEventListener("load", getAllData());

const sortData = (posts, isSorted) => {
  const sortedPosts = posts.sort((a, b) => {
    const title1 = a.title.toLowerCase(), title2 = b.title.toLowerCase();
    return (isSorted ? (title1 < title2 ? 1 : -1 ): (title1 > title2 ? 1 : -1))
  })
  displayData(sortedPosts)
}

const groupData = (posts) => {
  const userArr = [];
  const bottom = document.querySelector(".content-bottom");
  bottom.innerHTML = '';

  for (post of posts) {
    const { userId, name, username, title, body } = post;
    const index = userArr.findIndex(element => element.userId === userId)
    if (index === -1) userArr.push({
      userId,
      name,
      username,
      posts: [
        {
          title,
          body,
          name,
          username
        }
      ]
    })
    else userArr[index].posts.push({ title, body, name, username })
  }
  
  for (let i=0; i<userArr.length; i++) {
    const { userId, name, username, posts } = userArr[i]
    const content = `
      <h1 class="content-title">${name}</h1>
      <p class="content-body">@${username}</p>
      <p class="content-body">${posts.length} posts</p>
    `
    const div = document.createElement("div");
    div.classList.add("content-item", "user-button");
    div.addEventListener('click', () => clickUser(userId, userArr))
    div.innerHTML = content;

    bottom.appendChild(div);
  }
}

const clickUser = (userId, userArr) => {
  const userPosts = userArr.find(element => element.userId === userId).posts;
  displayData(userPosts);
}
