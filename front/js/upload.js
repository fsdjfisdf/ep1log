document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch('http://your-server-address/api/upload/image', {
    method: 'POST',
    body: formData,
  });

  const result = await res.json();
  document.getElementById('preview').src = result.imageUrl;

  // 저장용으로 imageUrl DB에 함께 전송
});
