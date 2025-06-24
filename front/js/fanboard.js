document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fanboard-form');
  const postsList = document.getElementById('posts-list');
  const confirmation = document.getElementById('confirmation-message');

  // 글 작성
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      writer_name: formData.get('writer_name'),
      password: formData.get('password'),
      content: formData.get('content'),
      is_secret: formData.get('is_secret') === 'on',
      ip_address: ''
    };

    try {
      const res = await fetch('/api/fanboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      confirmation.textContent = result.message;
      form.reset();
      loadPosts();
    } catch (err) {
      confirmation.textContent = '❌ 오류 발생: ' + err.message;
    }
  });

  // 글 목록 불러오기
  async function loadPosts() {
    postsList.innerHTML = '';
    try {
      const res = await fetch('/api/fanboard');
      const posts = await res.json();

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
      postsList.innerHTML = '<p>글을 불러오지 못했습니다.</p>';
    }
  }

  loadPosts();
});
