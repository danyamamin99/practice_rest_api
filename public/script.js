function row(user) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-rowid", user.id);

  const idTd = document.createElement("td");
  idTd.append(user.id);
  tr.append(idTd);

  const nameTd = document.createElement("td");
  nameTd.append(user.name);
  tr.append(nameTd);

  const ageTd = document.createElement("td");
  ageTd.append(user.age);
  tr.append(ageTd);
    
  const linksTd = document.createElement("td");

  const editLink = document.createElement("a");
  editLink.setAttribute("data-id", user.id);
  editLink.setAttribute("style", "cursor:pointer;padding:15px;");
  editLink.append("Изменить");
  editLink.addEventListener("click", e => {

      e.preventDefault();
      getUser('/users/', user.id);
  });
  linksTd.append(editLink);

  const removeLink = document.createElement("a");
  removeLink.setAttribute("data-id", user.id);
  removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
  removeLink.append("Удалить");
  removeLink.addEventListener("click", e => {

      e.preventDefault();
      deleteUser(user.id);
  });

  linksTd.append(removeLink);
  tr.appendChild(linksTd);

  return tr;
}

function reset() {
  const form = document.forms["userForm"];
  form.reset();
  form.elements["id"].value = 0;
}

const getUsers = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    throw new Error(`Ошибки по адресу ${url}, statuc ${res.ok}`)
  } else {
    const json = await res.json();
    let tbody = document.querySelector("tbody"); 
    tbody.innerHTML = ''
      json.forEach(user => {
        tbody.append(row(user))
    });
  }
};
getUsers('/users')

const getUser = async (url, id) => {
  const res = await fetch(url + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    throw new Error(`Ошибки по адресу ${url}, statuc ${res.ok}`)
  } else {
    const json =  await res.json()
    const form = document.forms["userForm"];
    form.elements["id"].value = json.id;
    form.elements["name"].value = json.name;
    form.elements["age"].value = json.age;
  }
};

const createUser = async (url, name, age) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      age: parseInt(age)
    })
  })

  if (!res.ok) {
    throw new Error(`Ошибки по адресу ${url}, statuc ${res.ok}`)
  }

  return await res.json()
}

const deleteUser = async (id) => {
  const response = await fetch('/users/' + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
  });
  if (response.ok === true) {
      const user = await response.json();
      document.querySelector("tr[data-rowid='" + user.id + "']").remove();
      // getUsers('/users')
  } else {
    throw new Error(response);
  }
}

const editUser = async (userId, userName, userAge) => {
  const response = await fetch("/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          id: userId,
          name: userName,
          age: parseInt(userAge, 10)
      })
  });
  if (response.ok === true) {
      const user = await response.json();
      reset();
      document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
  }
}

document.forms['userForm'].addEventListener('submit', (e) => {
  e.preventDefault();

  const form = document.forms['userForm'];
  const id = form.elements['id'].value;
  const name = form.elements['name'].value;
  const age = form.elements['age'].value;

  if (id == 0) 
    createUser('/users', name, age)
  else
    editUser(id, name, age)

  getUsers('/users')
})

document.querySelector('#reset').addEventListener('click', reset);






