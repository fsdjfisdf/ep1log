// fanboard.js — neo-brutal fan board (safe rendering, merged theme)

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://43.201.204.91:3001/api/fanboard';

  // Nodes
  const postsList = document.getElementById('posts-list');
  const postCount = document.getElementById('postCount');
  const empty = document.getElementById('empty');
  const loadError = document.getElementById('loadError');

  const modal = document.getElementById('write-modal');
  const openBtns = [document.getElementById('open-modal'), document.getElementById('open-modal-2')].filter(Boolean);
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('fanboard-form');
  const confirmMsg = document.getElementById('confirmation-message');

  // Utils
  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('ko-KR', {
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit'
      }).format(d);
    } catch { return iso; }
  };

  const openModal = () => {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    form?.querySelector('input[name="writer_name"]')?.focus();
  };
  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    confirmMsg.hidden = true;
    form.reset();
  };

  openBtns.forEach(b => b.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'backdrop') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  // Safe element builders (no innerHTML injection)
  const el = (tag, cls) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  };

  function renderPost(post){
    const item = el('article', 'pitem');

    // header
    const head = el('div', 'phead');
    const left = el('div', 'left');
    const right = el('div', 'right');

    const writer = el('span', 'writer');
    writer.textContent = post.writer_name || '익명';

    const date = el('span', 'date');
    date.textContent = fmtDate(post.created_at);

    left.append(writer, date);

    const delBtn = el('button', 'btn small danger');
    delBtn.textContent = '삭제';
    delBtn.setAttribute('data-id', post.id);
    right.append(delBtn);

    head.append(left, right);

    // content
    const contentBox = el('div', 'pcontent');
    if (post.is_secret) {
      const badge = el('span', 'pill secret');
      badge.textContent = 'SECRET';
      const txt = el('em');
      txt.textContent = '(비밀글입니다)';
      contentBox.append(badge, txt);
    } else {
      const txt = el('p');
      txt.className = 'text';
      txt.textContent = post.content || '';
      contentBox.append(txt);
    }

    item.append(head, contentBox);

    // delete handler
    delBtn.addEventListener('click', async () => {
      const password = window.prompt('비밀번호를 입력하세요:');
      if (!password) return;
      try {
        const res = await fetch(`${API_BASE}/${post.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        if (res.ok) {
          await loadPosts();
        } else {
          const msg = await res.text();
          alert(`❌ 삭제 실패: ${msg}`);
        }
      } catch {
        alert('삭제 중 오류가 발생했습니다.');
      }
    });

    return item;
  }

  async function loadPosts(){
    postsList.replaceChildren();
    empty.hidden = true;
    loadError.hidden = true;

    // lightweight skeleton
    const skel = el('div', 'skeletons');
    for (let i=0;i<3;i++){
      const s = el('div', 'skeleton card');
      skel.append(s);
    }
    postsList.append(skel);

    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('응답 실패');
      const posts = await res.json();

      postsList.replaceChildren();
      postCount.textContent = posts.length;

      if (!posts.length){
        empty.hidden = false;
        return;
      }

      // newest first (if API unsorted)
      posts.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));

      for (const p of posts){
        postsList.append(renderPost(p));
      }
    } catch (err){
      postsList.replaceChildren();
      loadError.hidden = false;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const writer_name = form.writer_name.value.trim();
    const password = form.password.value.trim();
    const content = form.content.value.trim();
    const is_secret = form.is_secret.checked;

    if (!writer_name || !password || !content){
      confirmMsg.hidden = false;
      confirmMsg.className = 'msg err';
      confirmMsg.textContent = '❌ 입력값을 확인하세요.';
      return;
    }

    const payload = { writer_name, password, content, is_secret };
    confirmMsg.hidden = true;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        confirmMsg.hidden = false;
        confirmMsg.className = 'msg ok';
        confirmMsg.textContent = `✅ ${data.message || '등록되었습니다.'}`;
        form.reset();

        // 살짝 딜레이 후 닫고 새로고침
        setTimeout(() => {
          closeModal();
          loadPosts();
        }, 400);
      } else {
        const error = await res.text();
        confirmMsg.hidden = false;
        confirmMsg.className = 'msg err';
        confirmMsg.textContent = `❌ 오류: ${error}`;
      }
    } catch (err) {
      confirmMsg.hidden = false;
      confirmMsg.className = 'msg err';
      confirmMsg.textContent = `❌ 오류 발생: ${err.message}`;
    }
  });

  // init
  loadPosts();
});
