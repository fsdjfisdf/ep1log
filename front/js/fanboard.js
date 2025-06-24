document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('write-modal');
  const openBtn = document.getElementById('open-modal');
  const closeBtn = document.querySelector('.close-button');
  const form = document.getElementById('fanboard-form');
  const postsList = document.getElementById('posts-list');
  const confirmation = document.getElementById('confirmation-message');
  const API_BASE = 'http://43.201.204.91:3001/api/fanboard';

  openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const writer_name = form.writer_name.value.trim();
    const password = form.password.value.trim();
    const content = form.content.value.trim();
    const is_secret = form.is_secret.checked;

    const payload = { writer_name, password, content, is_secret };

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        confirmation.innerHTML = `<p>✅ ${data.message}</p>`;
        form.reset();
        modal.classList.add('hidden');
        loadPosts();
      } else {
        const error = await res.text();
        confirmation.innerHTML = `<p>❌ 오류: ${error}</p>`;
      }
    } catch (err) {
      confirmation.innerHTML = `<p>❌ 오류 발생: ${err.message}</p>`;
    }
  });

  async function loadPosts() {
    postsList.innerHTML = '';
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('응답 실패');

      const posts = await res.json();
      if (posts.length === 0) {
        postsList.innerHTML = '<p>등록된 글이 없습니다.</p>';
        return;
      }

        posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post-item';
        postEl.innerHTML = `
        <div class="post-header">
            <div class="left">
            <span class="writer">${post.writer_name}</span>
            <span class="date">${new Date(post.created_at).toLocaleString()}</span>
            </div>
            <div class="right">
            <button class="delete-btn" data-id="${post.id}">삭제</button>
            </div>
        </div>
        <div class="content-box">
            ${post.is_secret ? '<em>(비밀글입니다)</em>' : post.content}
        </div>
        `;

        postsList.appendChild(postEl);
        }); 

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const password = prompt('비밀번호를 입력하세요');
          if (password) deletePost(id, password);
        });
      });
    } catch (err) {
      postsList.innerHTML = '<p>❌ 글을 불러오는 데 실패했습니다.</p>';
    }
  }

  // 삭제 버튼 이벤트 연결
postsList.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      alert('✅ 삭제되었습니다.');
      loadPosts();
    } else {
      const msg = await res.text();
      alert(`❌ 삭제 실패: ${msg}`);
    }
  });
});

  async function deletePost(id, password) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        loadPosts();
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('삭제 중 오류 발생');
    }
  }

  loadPosts();
});
