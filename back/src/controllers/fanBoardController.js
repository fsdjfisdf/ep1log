const dao = require('../dao/fanBoardDao');

const createPost = async (req, res) => {
  try {
    await dao.insertPost(req.body);
    res.status(201).json({ message: '글이 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '글 등록 중 오류 발생' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const [rows] = await dao.getAllPosts();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '글 목록 조회 실패' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const success = await dao.deletePost(id, password);
    if (success) {
      res.status(200).json({ message: '삭제되었습니다.' });
    } else {
      res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '삭제 중 오류 발생' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  deletePost
};
