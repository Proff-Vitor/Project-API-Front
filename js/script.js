const cardContainer = document.getElementById('cardContainer');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

let contacts = [];

// Carregar os contatos do servidor
async function loadCards() {
    try {
        const response = await fetch('http://localhost:3000/contatos/listarContatos');
        contacts = await response.json();
        renderCards();
    } catch (error) {
        console.error('Erro ao carregar contatos:', error);
    }
}

// Renderizar os contatos na tela
function renderCards() {
    cardContainer.innerHTML = '';
    contacts.Data.forEach((contact) => {

        console.log(contact);
        
        const card = document.createElement('div');
        card.className = 'card';

        const image = document.createElement('img');
        image.src = contact.foto || 'https://via.placeholder.com/150';
        card.appendChild(image);

        const name = document.createElement('h3');
        name.textContent = contact.nome;
        card.appendChild(name);

        const phone = document.createElement('p');
        phone.textContent = `Telefone: ${contact.telefone}`;
        card.appendChild(phone);

        const email = document.createElement('p');
        email.textContent = `Email: ${contact.email}`;
        card.appendChild(email);

        const favorite = document.createElement('p');
        favorite.textContent = contact.favorito ? 'Favorito' : '';
        card.appendChild(favorite);

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editContact(contact);
        card.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.onclick = () => deleteContact(contact.id);
        card.appendChild(deleteButton);

        cardContainer.appendChild(card);
    });
}

// Adicionar um novo contato
async function addContact() {
    const name = document.getElementById('nameInput').value;
    const phone = document.getElementById('phoneInput').value;
    const email = document.getElementById('emailInput').value;
    const favorite = document.getElementById('favoriteInput').checked;
    const image = document.getElementById('imageInput').value;

    if (name && phone && email) {
        
        const newContact = {
            nome: name,
            telefone: phone,
            email: email,
            favorito: favorite,
            foto: image
        };

        try {
            const response = await fetch('http://localhost:3000/contatos/cadastrarContato', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newContact),
            });

            if (response.ok) {
                loadCards();
                clearForm();
            } else {
                console.error('Erro ao cadastrar contato:', await response.text());
            }
        } catch (error) {
            console.error('Erro ao cadastrar contato:', error);
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Editar um contato existente
async function editContact(contact) {
    document.getElementById('nameInput').value = contact.nome;
    document.getElementById('phoneInput').value = contact.telefone;
    document.getElementById('emailInput').value = contact.email;
    document.getElementById('favoriteInput').checked = contact.favorito;

    document.getElementById('imageInput').value = contact.foto;

    deleteContact(contact.id);
}

// Deletar um contato
async function deleteContact(id) {
    try {
        const response = await fetch(`http://localhost:3000/contatos/deletarContato/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadCards();
        } else {
            console.error('Erro ao deletar contato:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao deletar contato:', error);
    }
}

// Limpar o formulário após adicionar ou editar um contato
function clearForm() {
    document.getElementById('nameInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('favoriteInput').checked = false;
    document.getElementById('imageInput').value = '';
}

// Alternar entre tema claro e escuro
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Inicializar com os cards carregados
loadCards();
