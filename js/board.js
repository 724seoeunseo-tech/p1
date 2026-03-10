// ===== 게시판 시스템 (학교별) =====

function generatePosts() {
  const titles = {
    '한국항공대': ['항공우주 실험실 후기','비행 시뮬레이션 꿀팁','기숙사 생활 꿀팁','학식 메뉴 추천','항공대 축제 후기'],
    '서강대': ['서강대 도서관 명당','전공 복수전공 고민','교내 카페 랭킹','중간고사 벼락치기','MT 장소 추천'],
    '연세대': ['연대 백양로 맛집','교환학생 후기','동아리 박람회 정보','연고전 준비','학점 관리 팁'],
    '홍익대': ['홍대 맛집 TOP5','디자인 포트폴리오 팁','전시회 후기','과제 파트너 구해요','축제 라인업 정보'],
    '이화여대': ['이대 근처 카페 추천','장학금 신청 정보','교환학생 준비','동아리 추천','대학원 진학 상담'],
  };
  const allPosts = [];
  let pid = 1;
  SCHOOLS.forEach(school => {
    const schoolTitles = titles[school] || [];
    const schoolUsers = ALL_USERS.filter(u => u.school === school);
    schoolTitles.forEach((title, i) => {
      const cats = ['free','question','info','review'];
      const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 14));
      const author = schoolUsers[Math.floor(Math.random() * schoolUsers.length)];
      allPosts.push({ id: pid++, school, category: cats[i % 4], title, content: title + ' 관련 내용입니다.\n\n자세한 내용은 댓글로 남겨주세요!', authorId: author.id, authorName: author.name, date: d, views: Math.floor(Math.random() * 500), likes: Math.floor(Math.random() * 50), comments: [] });
    });
  });
  return allPosts;
}

let posts = generatePosts();
const writeModal = document.getElementById('writeModal');
const detailModal = document.getElementById('detailModal');

function initBoard() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : '서강대';
  if (!boardSchool) { boardSchool = mySchool; document.getElementById('boardSchoolFilter').value = mySchool; }
  document.getElementById('writeBtn').style.display = (boardSchool === mySchool) ? '' : 'none';
}

document.getElementById('boardSchoolFilter').addEventListener('change', (e) => { boardSchool = e.target.value; currentPage = 1; initBoard(); renderPosts(); });

function renderPosts() {
  let filtered = posts.filter(p => p.school === boardSchool);
  if (currentSort === 'latest') filtered.sort((a, b) => b.date - a.date);
  else if (currentSort === 'popular') filtered.sort((a, b) => b.likes - a.likes);
  const start = (currentPage - 1) * 8, page = filtered.slice(start, start + 8);
  const el = document.getElementById('postList');
  if (page.length === 0) { el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-secondary)">게시글이 없습니다.</div>'; document.getElementById('pagination').innerHTML = ''; return; }
  el.innerHTML = page.map(p => `<div class="post-item" data-id="${p.id}"><div class="post-item-header"><span class="post-category">${CAT_LABELS[p.category]}</span><span class="post-title">${escapeHtml(p.title)}</span>${p.comments.length > 0 ? `<span class="post-comment-count">[${p.comments.length}]</span>` : ''}</div><div class="post-meta"><span>${escapeHtml(p.authorName)}</span><span>${formatDate(p.date)}</span><span>조회 ${p.views}</span></div></div>`).join('');
  document.getElementById('pagination').innerHTML = Array.from({ length: Math.ceil(filtered.length / 8) }, (_, i) => `<button class="page-btn ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('');
}

document.getElementById('writeBtn').addEventListener('click', () => writeModal.classList.add('active'));
document.getElementById('modalClose').addEventListener('click', () => writeModal.classList.remove('active'));
document.getElementById('cancelBtn').addEventListener('click', () => writeModal.classList.remove('active'));
document.getElementById('submitBtn').addEventListener('click', () => {
  const t = document.getElementById('postTitle').value.trim(), c = document.getElementById('postContent').value.trim();
  if (!t || !c) { alert('제목과 내용을 입력해주세요.'); return; }
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : '서강대';
  posts.unshift({ id: posts.length + 100, school: mySchool, category: document.getElementById('postCategory').value, title: t, content: c, authorId: currentUser.id, authorName: currentUser.profile ? currentUser.profile.name : '익명', date: new Date(), views: 0, likes: 0, comments: [] });
  document.getElementById('postTitle').value = ''; document.getElementById('postContent').value = '';
  writeModal.classList.remove('active'); renderPosts();
});

document.getElementById('postList').addEventListener('click', (e) => {
  const item = e.target.closest('.post-item');
  if (!item) return;
  const p = posts.find(x => x.id === Number(item.dataset.id));
  if (!p) return;
  currentPostId = p.id; p.views++;
  document.getElementById('detailTitle').textContent = p.title;
  document.getElementById('detailMeta').innerHTML = `<span>${CAT_LABELS[p.category]}</span><span>${escapeHtml(p.authorName)}</span><span>${formatDate(p.date)}</span><span>${p.school}</span>`;
  document.getElementById('detailContent').textContent = p.content;
  document.getElementById('likeCount').textContent = p.likes;
  document.getElementById('likeBtn').classList.remove('liked');
  renderComments(p);
  detailModal.classList.add('active');
});

function renderComments(p) {
  document.getElementById('commentList').innerHTML = p.comments.length === 0 ? '<div style="color:#94a3b8;font-size:.85rem">아직 댓글이 없습니다.</div>' : p.comments.map(c => `<div class="comment-item"><div class="comment-author">${escapeHtml(c.authorName)}</div><div class="comment-text">${escapeHtml(c.text)}</div></div>`).join('');
}

document.getElementById('pagination').addEventListener('click', (e) => { if (e.target.classList.contains('page-btn')) { currentPage = Number(e.target.dataset.page); renderPosts(); } });
document.querySelectorAll('.sort-btn[data-sort]').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('.sort-btn[data-sort]').forEach(x => x.classList.remove('active')); b.classList.add('active'); currentSort = b.dataset.sort; currentPage = 1; renderPosts(); }));
document.getElementById('detailClose').addEventListener('click', () => detailModal.classList.remove('active'));
document.getElementById('likeBtn').addEventListener('click', () => { const p = posts.find(x => x.id === currentPostId); if (!p) return; const b = document.getElementById('likeBtn'); if (b.classList.contains('liked')) { p.likes--; b.classList.remove('liked'); } else { p.likes++; b.classList.add('liked'); } document.getElementById('likeCount').textContent = p.likes; });
document.getElementById('commentBtn').addEventListener('click', () => { const t = document.getElementById('commentInput').value.trim(); if (!t) return; const p = posts.find(x => x.id === currentPostId); if (p) { p.comments.push({ authorName: currentUser.profile ? currentUser.profile.name : '익명', text: t }); document.getElementById('commentInput').value = ''; renderComments(p); } });

// 모달 닫기
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('active'); }));
