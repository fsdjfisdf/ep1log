document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fanboard-form');
  const postsList = document.getElementById('posts-list');
  const confirmation = document.getElementById('confirmation-message');
  const API_BASE = 'http://43.201.204.91:3001/api/fanboard';

  // 글 작성
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const writer_name = form.writer_name.value.trim();
    const password = form.password.value.trim();
    const content = form.content.value.trim();
    const is_secret = form.is_secret.checked;

    const payload = { writer_name, password, content, is_secret, ip_address: '' };

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
        loadPosts();
      } else {
        const error = await res.text();
        confirmation.innerHTML = `<p>❌ 오류: ${error}</p>`;
      }
    } catch (err) {
      confirmation.innerHTML = `<p>❌ 오류 발생: ${err.message}</p>`;
    }
  });

  // 글 목록 불러오기
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
          <div><strong>${post.writer_name}</strong> | <span class="date">${new Date(post.created_at).toLocaleString()}</span></div>
          <div class="content">${post.is_secret ? '(비밀글입니다)' : post.content}</div>
        `;
        postsList.appendChild(postEl);
      });
    } catch (err) {
      postsList.innerHTML = '<p>❌ 글을 불러오는 데 실패했습니다.</p>';
    }
  }

  loadPosts();
});
