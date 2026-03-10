// ===== Splash → Auth transition =====
const splash = document.getElementById('splash');
const authPage = document.getElementById('authPage');
const app = document.getElementById('app');

setTimeout(() => {
  splash.style.display = 'none';
}, 3600);

// ===== Auth =====
const loginCard = document.getElementById('loginCard');
const signupCard = document.getElementById('signupCard');

document.getElementById('goSignup').addEventListener('click', (e) => {
  e.preventDefault();
  loginCard.classList.add('hidden');
  signupCard.classList.remove('hidden');
});

document.getElementById('goLogin').addEventListener('click', (e) => {
  e.preventDefault();
  signupCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
});

let currentUser = null;

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPassword').value.trim();
  if (!email || !pw) { alert('이메일과 비밀번호를 입력해주세요.'); return; }
  currentUser = { nick: email.split('@')[0], email };
  enterApp();
});

document.getElementById('signupBtn').addEventListener('click', () => {
  const nick = document.getElementById('signupNick').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const univ = document.getElementById('signupUniv').value.trim();
  const pw = document.getElementById('signupPassword').value.trim();
  const pwc = document.getElementById('signupPasswordConfirm').value.trim();
  if (!nick || !email || !univ || !pw) { alert('모든 항목을 입력해주세요.'); return; }
  if (pw.length < 8) { alert('비밀번호는 8자 이상이어야 합니다.'); return; }
  if (pw !== pwc) { alert('비밀번호가 일치하지 않습니다.'); return; }
  currentUser = { nick, email, univ };
  enterProfile();
});

document.getElementById('googleLoginBtn').addEventListener('click', () => {
  currentUser = { nick: '구글유저', email: 'user@gmail.com' };
  enterApp();
});

function enterProfile() {
  authPage.classList.add('hidden');
  document.getElementById('profilePage').classList.remove('hidden');
  if (currentUser.univ) {
    document.getElementById('profSchool').value = currentUser.univ;
  }
}

function enterApp() {
  authPage.classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  app.classList.remove('hidden');
  document.getElementById('userName').textContent = currentUser.nick + '님';
  switchTab('board');
}

// ===== Profile Setup =====
let selectedKeywords = [];
let profilePhoto = null;

document.getElementById('photoBtn').addEventListener('click', () => document.getElementById('photoInput').click());
document.getElementById('photoPreview').addEventListener('click', () => document.getElementById('photoInput').click());
document.getElementById('photoInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    profilePhoto = ev.target.result;
    document.getElementById('photoPreview').innerHTML = `<img src="${profilePhoto}" alt="profile" />`;
  };
  reader.readAsDataURL(file);
});

document.getElementById('profBio').addEventListener('input', (e) => {
  document.getElementById('bioCount').textContent = e.target.value.length;
});

function showStep(num) {
  document.querySelectorAll('.profile-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + num).classList.remove('hidden');
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.step[data-step="${num}"]`).classList.add('active');
}

document.getElementById('toStep2').addEventListener('click', () => {
  const name = document.getElementById('profName').value.trim();
  const age = document.getElementById('profAge').value;
  const school = document.getElementById('profSchool').value.trim();
  const major = document.getElementById('profMajor').value.trim();
  const year = document.getElementById('profYear').value;
  if (!name || !age || !school || !major || !year) { alert('모든 기본 정보를 입력해주세요.'); return; }
  showStep(2);
});

document.getElementById('backStep1').addEventListener('click', () => showStep(1));
document.getElementById('toStep3').addEventListener('click', () => showStep(3));
document.getElementById('backStep2').addEventListener('click', () => showStep(2));
document.getElementById('toStep4').addEventListener('click', () => { renderPreview(); showStep(4); });
document.getElementById('backStep3').addEventListener('click', () => showStep(3));

document.querySelectorAll('.keyword-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.val;
    if (btn.classList.contains('selected')) {
      btn.classList.remove('selected');
      selectedKeywords = selectedKeywords.filter(k => k !== val);
    } else {
      if (selectedKeywords.length >= 10) { alert('최대 10개까지 선택 가능합니다.'); return; }
      btn.classList.add('selected');
      selectedKeywords.push(val);
    }
    document.getElementById('keywordCount').textContent = selectedKeywords.length;
  });
});

document.querySelectorAll('.toggle-input').forEach(toggle => {
  toggle.addEventListener('change', () => {
    toggle.closest('.toggle-label').querySelector('.toggle-text').textContent = toggle.checked ? '공개' : '비공개';
  });
});

function renderPreview() {
  const name = document.getElementById('profName').value.trim();
  const school = document.getElementById('profSchool').value.trim();
  const major = document.getElementById('profMajor').value.trim();
  const year = document.getElementById('profYear').value;
  const age = document.getElementById('profAge').value;
  const bio = document.getElementById('profBio').value.trim();
  const height = document.getElementById('profHeight').value.trim();
  const location = document.getElementById('profLocation').value.trim();
  const insta = document.getElementById('profInsta').value.trim();
  const showHeight = document.getElementById('toggleHeight').checked;
  const showLocation = document.getElementById('toggleLocation').checked;
  const showInsta = document.getElementById('toggleInsta').checked;

  document.getElementById('previewName').textContent = name + ' (' + age + ')';
  document.getElementById('previewSchool').textContent = school + ' / ' + major + ' / ' + year;
  document.getElementById('previewBio').textContent = bio || '자기소개가 없습니다.';
  const photoEl = document.getElementById('previewPhoto');
  photoEl.innerHTML = profilePhoto ? `<img src="${profilePhoto}" alt="profile" />` : '<span class="photo-placeholder">?</span>';
  document.getElementById('previewKeywords').innerHTML = selectedKeywords.map(k => `<span class="preview-keyword">${k}</span>`).join('');
  let extraHtml = '';
  if (height && showHeight) extraHtml += `<span class="preview-extra-item">${height}</span>`;
  if (location && showLocation) extraHtml += `<span class="preview-extra-item">${location}</span>`;
  if (insta && showInsta) extraHtml += `<span class="preview-extra-item">${insta}</span>`;
  document.getElementById('previewExtra').innerHTML = extraHtml;
}

document.getElementById('profileComplete').addEventListener('click', () => {
  currentUser.profile = {
    name: document.getElementById('profName').value.trim(),
    age: document.getElementById('profAge').value,
    school: document.getElementById('profSchool').value.trim(),
    major: document.getElementById('profMajor').value.trim(),
    year: document.getElementById('profYear').value,
    bio: document.getElementById('profBio').value.trim(),
    keywords: [...selectedKeywords],
    height: document.getElementById('profHeight').value.trim(),
    location: document.getElementById('profLocation').value.trim(),
    insta: document.getElementById('profInsta').value.trim(),
    showHeight: document.getElementById('toggleHeight').checked,
    showLocation: document.getElementById('toggleLocation').checked,
    showInsta: document.getElementById('toggleInsta').checked,
    photo: profilePhoto,
  };
  enterApp();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  app.classList.add('hidden');
  authPage.classList.remove('hidden');
  authPage.style.opacity = '1';
});

// ===== Utility =====
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return minutes + '분 전';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + '시간 전';
  const days = Math.floor(hours / 24);
  if (days < 7) return days + '일 전';
  return date.toLocaleDateString('ko-KR');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Sample Users Database =====
const ALL_USERS = [
  { nick: '캠퍼스고양이', email: 'cat@snu.ac.kr', school: '서울대', major: '컴퓨터공학', year: '3학년', age: '23', bio: '코딩하는 고양이입니다. 밤에 더 활발해요!', keywords: ['게임', '음악', '카페', '조용한'], photo: null },
  { nick: '도서관지박령', email: 'lib@yonsei.ac.kr', school: '연세대', major: '경영학', year: '2학년', age: '22', bio: '도서관이 제 집이에요. 카공 메이트 구해요~', keywords: ['독서', '카페', '지적인', '한식'], photo: null },
  { nick: '학식헌터', email: 'food@korea.ac.kr', school: '고려대', major: '식품공학', year: '4학년', age: '25', bio: '대학 학식 리뷰어입니다. 맛있는 건 못 참아!', keywords: ['요리', '한식', '치킨', '활발한'], photo: null },
  { nick: '과잠러버', email: 'jacket@hanyang.ac.kr', school: '한양대', major: '기계공학', year: '1학년', age: '20', bio: '과잠 수집가. 다른 학교 과잠도 좋아해요.', keywords: ['운동', '사진', '활발한', '피자'], photo: null },
  { nick: '새내기탐험가', email: 'fresh@skku.ac.kr', school: '성균관대', major: '미디어학', year: '1학년', age: '20', bio: '대학생활 모든 게 신기해요!', keywords: ['여행', '사진', '영화', '모험적'], photo: null },
  { nick: '올A목표', email: 'grade@sogang.ac.kr', school: '서강대', major: '수학', year: '3학년', age: '24', bio: '학점 4.5가 목표입니다. 스터디 환영!', keywords: ['독서', '계획적', '지적인', '카페'], photo: null },
  { nick: '동아리장', email: 'club@cau.ac.kr', school: '중앙대', major: '사회학', year: '4학년', age: '25', bio: '동아리 3개 운영 중. 대학생활은 동아리가 전부!', keywords: ['댄스', '음악', '활발한', '유머러스'], photo: null },
  { nick: '자취요리왕', email: 'cook@konkuk.ac.kr', school: '건국대', major: '영문학', year: '2학년', age: '22', bio: '자취 3년차. 요리 레시피 공유해요~', keywords: ['요리', '한식', '양식', '감성적'], photo: null },
  { nick: '카공러', email: 'cafe@hongik.ac.kr', school: '홍익대', major: '디자인', year: '2학년', age: '21', bio: '카페에서 공부하는 게 제일 잘돼요.', keywords: ['그림', '카페', '디저트', '감성적'], photo: null },
  { nick: '졸업언제', email: 'grad@khu.ac.kr', school: '경희대', major: '체육학', year: '4학년', age: '26', bio: '졸업이 코앞인데 아직도 실감이 안 나요...', keywords: ['운동', '등산', '캠핑', '유머러스'], photo: null },
  { nick: '밤샘코더', email: 'dev@snu.ac.kr', school: '서울대', major: '소프트웨어학', year: '2학년', age: '22', bio: '새벽 코딩이 최고! 해커톤 러버.', keywords: ['게임', '음악', '매운음식', '모험적'], photo: null },
  { nick: '축제좋아', email: 'fest@yonsei.ac.kr', school: '연세대', major: '문화학', year: '3학년', age: '23', bio: '축제 시즌이 기다려지는 사람.', keywords: ['음악', '댄스', '활발한', '치킨'], photo: null },
];

function getUserInfo(nick) {
  return ALL_USERS.find(u => u.nick === nick) || { nick, school: '대학교', major: '전공', year: '', age: '', bio: '', keywords: [], photo: null };
}

// ===== Community Board Data =====
const CATEGORY_LABELS = { free: '자유게시판', question: '질문답변', info: '정보공유', review: '대학생활' };
const NICKNAMES = ALL_USERS.map(u => u.nick);

const SAMPLE_TITLES = [
  { cat: 'free', title: '오늘 학식 맛있었다', content: '오늘 학식 메뉴가 돈까스였는데 역대급이었어요.' },
  { cat: 'question', title: '전공 복수전공 고민 중인데요', content: '경영학 전공인데 컴공 복수전공 할지 고민이에요.' },
  { cat: 'info', title: '교내 무료 소프트웨어 목록 정리', content: 'Adobe, MS Office, MATLAB 등 학교 라이선스로 무료 사용 가능합니다.' },
  { cat: 'free', title: '동아리 MT 후기', content: '이번 주말에 동아리 MT 다녀왔는데 너무 재밌었어요!' },
  { cat: 'review', title: '자취 첫 달 생존기', content: '자취 시작한 지 한 달... 꿀팁 있으면 공유 부탁!' },
  { cat: 'question', title: '대외활동 추천해주세요', content: '이번 학기에 대외활동 하나 하려는데 IT 관련이면 더 좋아요.' },
  { cat: 'info', title: '장학금 신청 꿀팁', content: '교내/교외 장학금 종류별 신청 팁 정리했습니다.' },
  { cat: 'free', title: '중간고사 벼락치기 중...', content: '시험 3일 전인데 아직 1강도 안 들었습니다 ㅠㅠ' },
  { cat: 'review', title: '교환학생 준비 과정 공유', content: '일본 교환학생 다녀온 경험 공유합니다.' },
  { cat: 'question', title: '노트북 추천 부탁드려요', content: '공대생인데 예산 100만원 내외로 괜찮은 거 있을까요?' },
  { cat: 'info', title: '학교 근처 카페 TOP 5', content: '카공하기 좋은 카페 5곳을 선정해봤습니다.' },
  { cat: 'free', title: '대학 와서 제일 좋은 점', content: '시간표 자유롭게 짤 수 있는 게 최고인 것 같아요.' },
];

function generatePosts() {
  return SAMPLE_TITLES.map((sample, i) => {
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date(); date.setDate(date.getDate() - daysAgo);
    return {
      id: i + 1, category: sample.cat, title: sample.title, content: sample.content,
      author: NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)], date,
      views: Math.floor(Math.random() * 500) + 10,
      likes: Math.floor(Math.random() * 50),
      comments: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
        author: NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)],
        text: ['공감 ㅋㅋ', '저도요!', '유용해요~', '우리 학교도 똑같아요', '대박'][Math.floor(Math.random() * 5)],
        date: new Date(Date.now() - Math.random() * 604800000),
      })),
      tags: ['대학생활', '스터디', '동아리', '취업', '맛집', '자취', '시험'].sort(() => 0.5 - Math.random()).slice(0, 2),
    };
  });
}

let posts = generatePosts();
let currentSort = 'latest';
let currentCategory = 'all';
let currentPage = 1;
let currentPostId = null;
const POSTS_PER_PAGE = 8;
const postListEl = document.getElementById('postList');
const paginationEl = document.getElementById('pagination');
const writeModal = document.getElementById('writeModal');
const detailModal = document.getElementById('detailModal');

function getFilteredPosts() {
  let filtered = [...posts];
  if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
  if (currentSort === 'latest') filtered.sort((a, b) => b.date - a.date);
  else if (currentSort === 'popular') filtered.sort((a, b) => b.likes - a.likes);
  else if (currentSort === 'comments') filtered.sort((a, b) => b.comments.length - a.comments.length);
  return filtered;
}

function renderPosts() {
  const filtered = getFilteredPosts();
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  if (pagePosts.length === 0) {
    postListEl.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8;">게시글이 없습니다.</div>';
    paginationEl.innerHTML = ''; return;
  }
  postListEl.innerHTML = pagePosts.map(post => `
    <div class="post-item" data-id="${post.id}">
      <div class="post-item-header">
        <span class="post-category">${CATEGORY_LABELS[post.category]}</span>
        <span class="post-title">${escapeHtml(post.title)}</span>
        ${post.comments.length > 0 ? `<span class="post-comment-count">[${post.comments.length}]</span>` : ''}
      </div>
      <div class="post-meta">
        <span>${post.author}</span><span>${formatDate(post.date)}</span>
        <span>조회 ${post.views}</span><span>&#9829; ${post.likes}</span>
      </div>
    </div>`).join('');
  paginationEl.innerHTML = Array.from({ length: totalPages }, (_, i) =>
    `<button class="page-btn ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`
  ).join('');
}

function openDetail(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  currentPostId = postId; post.views++;
  document.getElementById('detailTitle').textContent = post.title;
  document.getElementById('detailMeta').innerHTML = `<span>${CATEGORY_LABELS[post.category]}</span><span>${post.author}</span><span>${formatDate(post.date)}</span><span>조회 ${post.views}</span>`;
  document.getElementById('detailContent').textContent = post.content;
  document.getElementById('detailTags').innerHTML = post.tags.map(t => `<span class="tag">#${t}</span>`).join('');
  document.getElementById('likeCount').textContent = post.likes;
  document.getElementById('likeBtn').classList.remove('liked');
  renderComments(post);
  detailModal.classList.add('active');
}

function renderComments(post) {
  const el = document.getElementById('commentList');
  if (post.comments.length === 0) { el.innerHTML = '<div style="color:#94a3b8;font-size:0.85rem;">아직 댓글이 없습니다.</div>'; return; }
  el.innerHTML = post.comments.map(c => `
    <div class="comment-item">
      <div class="comment-author">${escapeHtml(c.author)}</div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
      <div class="comment-time">${formatDate(c.date)}</div>
    </div>`).join('');
}

// ===== Tab Navigation =====
let currentTab = 'board';

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.nav-link[data-tab="${tab}"]`);
  if (link) link.classList.add('active');
  const actionBtn = document.getElementById('mainActionBtn');

  if (tab === 'board') {
    document.getElementById('tabBoard').classList.remove('hidden');
    actionBtn.textContent = '글쓰기';
    actionBtn.onclick = () => writeModal.classList.add('active');
    renderPosts();
  } else if (tab === 'gather') {
    document.getElementById('tabGather').classList.remove('hidden');
    actionBtn.textContent = '모임 만들기';
    actionBtn.onclick = () => document.getElementById('gatherModal').classList.add('active');
    renderGatherings();
  } else if (tab === 'friends') {
    document.getElementById('tabFriends').classList.remove('hidden');
    actionBtn.textContent = '';
    actionBtn.onclick = null;
    renderFriendTab('school');
  } else if (tab === 'chat') {
    document.getElementById('tabChat').classList.remove('hidden');
    actionBtn.textContent = '';
    actionBtn.onclick = null;
    renderChatRooms();
  }
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => { e.preventDefault(); switchTab(link.dataset.tab); });
});

// ===== Board Event Listeners =====
document.getElementById('modalClose').addEventListener('click', () => writeModal.classList.remove('active'));
document.getElementById('cancelBtn').addEventListener('click', () => writeModal.classList.remove('active'));
document.getElementById('detailClose').addEventListener('click', () => { detailModal.classList.remove('active'); currentPostId = null; });

document.getElementById('submitBtn').addEventListener('click', () => {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const category = document.getElementById('postCategory').value;
  const tagsStr = document.getElementById('postTags').value.trim();
  if (!title || !content) { alert('제목과 내용을 입력해주세요.'); return; }
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
  posts.unshift({ id: posts.length + 1, category, title, content, author: currentUser ? currentUser.nick : '익명', date: new Date(), views: 0, likes: 0, comments: [], tags });
  currentPage = 1; renderPosts();
  document.getElementById('postTitle').value = ''; document.getElementById('postContent').value = ''; document.getElementById('postTags').value = '';
  writeModal.classList.remove('active');
});

postListEl.addEventListener('click', (e) => { const item = e.target.closest('.post-item'); if (item) openDetail(Number(item.dataset.id)); });
paginationEl.addEventListener('click', (e) => { if (e.target.classList.contains('page-btn')) { currentPage = Number(e.target.dataset.page); renderPosts(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });

document.querySelectorAll('.sort-btn[data-sort]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-btn[data-sort]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); currentSort = btn.dataset.sort; currentPage = 1; renderPosts();
  });
});

document.querySelectorAll('.category-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active'); currentCategory = item.dataset.category; currentPage = 1; renderPosts();
  });
});

document.getElementById('likeBtn').addEventListener('click', () => {
  const post = posts.find(p => p.id === currentPostId); if (!post) return;
  const btn = document.getElementById('likeBtn');
  if (btn.classList.contains('liked')) { post.likes--; btn.classList.remove('liked'); }
  else { post.likes++; btn.classList.add('liked'); }
  document.getElementById('likeCount').textContent = post.likes; renderPosts();
});

document.getElementById('commentBtn').addEventListener('click', () => {
  const input = document.getElementById('commentInput');
  const text = input.value.trim(); if (!text) return;
  const post = posts.find(p => p.id === currentPostId); if (!post) return;
  post.comments.push({ author: currentUser ? currentUser.nick : '익명', text, date: new Date() });
  renderComments(post); renderPosts(); input.value = '';
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) posts = generatePosts();
  else posts = generatePosts().filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
  currentPage = 1; renderPosts();
});
document.getElementById('searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('searchBtn').click(); });

// Close modals on overlay
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('active'); currentPostId = null; } });
});

// ===== FRIENDS SYSTEM (틴더식 양방향 매칭) =====
// iLiked: 내가 OK 누른 사람, likedMe: 상대가 OK 누른 사람
// matched: 양쪽 다 OK = 친구 성립
let iLiked = new Set();
let likedMe = new Set(['과잠러버', '새내기탐험가', '축제좋아']); // 시뮬레이션
let matched = new Set(['캠퍼스고양이', '도서관지박령']); // 이미 매칭된 친구
let currentFriendTab = 'school';
let currentSwipeList = [];
let swipeIndex = 0;

// AI 추천 설정
let recommendFilter = { keywords: [], ageRange: '', schoolOnly: false };

function getMySchool() {
  if (currentUser && currentUser.profile) return currentUser.profile.school;
  if (currentUser && currentUser.univ) return currentUser.univ;
  return '';
}

function getSchoolUsers() {
  const mySchool = getMySchool();
  return ALL_USERS.filter(u => u.school === mySchool && u.nick !== (currentUser ? currentUser.nick : ''));
}

function getRecommendedUsers() {
  const myKeywords = currentUser && currentUser.profile ? currentUser.profile.keywords : selectedKeywords;
  let candidates = ALL_USERS.filter(u =>
    u.nick !== (currentUser ? currentUser.nick : '') && !matched.has(u.nick)
  );

  // 필터 적용
  if (recommendFilter.schoolOnly) {
    const mySchool = getMySchool();
    candidates = candidates.filter(u => u.school === mySchool);
  }
  if (recommendFilter.keywords.length > 0) {
    candidates = candidates.filter(u =>
      u.keywords.some(k => recommendFilter.keywords.includes(k))
    );
  }

  // 관심사 매칭 점수
  candidates.sort((a, b) => {
    const filterKw = recommendFilter.keywords.length > 0 ? recommendFilter.keywords : myKeywords;
    const scoreA = a.keywords.filter(k => filterKw.includes(k)).length;
    const scoreB = b.keywords.filter(k => filterKw.includes(k)).length;
    return scoreB - scoreA;
  });

  return candidates;
}

function renderFriendTab(tab) {
  currentFriendTab = tab || currentFriendTab;
  const el = document.getElementById('friendList');
  document.querySelectorAll('[data-ftab]').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-ftab="${currentFriendTab}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (currentFriendTab === 'school') {
    renderSchoolFriends(el);
  } else if (currentFriendTab === 'search') {
    renderFriendSearch(el);
  } else if (currentFriendTab === 'recommend') {
    renderRecommendFriends(el);
  } else if (currentFriendTab === 'matched') {
    renderMatchedFriends(el);
  } else if (currentFriendTab === 'requests') {
    renderFriendRequests(el);
  }
}

function renderProfileCard(user, showActions) {
  const isMatched = matched.has(user.nick);
  const iSent = iLiked.has(user.nick);
  const keywords = user.keywords || [];
  let actionsHtml = '';
  if (showActions && !isMatched) {
    if (iSent) {
      actionsHtml = '<div class="friend-actions"><button class="btn btn-ghost btn-sm" disabled>OK 전송됨</button></div>';
    } else {
      actionsHtml = `<div class="friend-actions">
        <button class="btn btn-primary btn-sm match-ok" data-nick="${escapeHtml(user.nick)}">OK</button>
        <button class="btn btn-ghost btn-sm match-no" data-nick="${escapeHtml(user.nick)}">NO</button>
      </div>`;
    }
  } else if (isMatched) {
    actionsHtml = '<div class="friend-actions"><span style="color:var(--primary);font-size:0.8rem;font-weight:600;">친구</span></div>';
  }
  return `
    <div class="friend-item" data-nick="${escapeHtml(user.nick)}">
      <div class="friend-info">
        <div class="friend-avatar">${user.nick[0]}</div>
        <div>
          <div class="friend-name">${escapeHtml(user.nick)} <span style="font-size:0.8rem;color:var(--text-secondary)">${user.age || ''}</span></div>
          <div class="friend-detail">${user.school} · ${user.major} · ${user.year}</div>
          <div style="margin-top:4px">${keywords.slice(0, 4).map(k => `<span class="tag" style="font-size:0.7rem;padding:2px 6px">${k}</span>`).join(' ')}</div>
        </div>
      </div>
      ${actionsHtml}
    </div>`;
}

function renderSchoolFriends(el) {
  const users = getSchoolUsers();
  if (users.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#127979;</div><div class="empty-state-text">같은 학교 가입자가 아직 없습니다.</div></div>';
    return;
  }
  el.innerHTML = users.map(u => renderProfileCard(u, true)).join('');
}

function renderFriendSearch(el) {
  el.innerHTML = `
    <div class="search-bar" style="margin-bottom:16px">
      <input type="text" class="search-input" id="friendEmailSearch" placeholder="이메일로 친구 검색..." />
      <button class="btn btn-primary" id="friendEmailBtn">검색</button>
    </div>
    <div id="friendSearchResult"></div>`;
  document.getElementById('friendEmailBtn').addEventListener('click', searchFriendByEmail);
  document.getElementById('friendEmailSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter') searchFriendByEmail(); });
}

function searchFriendByEmail() {
  const query = document.getElementById('friendEmailSearch').value.trim().toLowerCase();
  const resultEl = document.getElementById('friendSearchResult');
  if (!query) { resultEl.innerHTML = ''; return; }
  const found = ALL_USERS.filter(u => u.email.toLowerCase().includes(query) && u.nick !== (currentUser ? currentUser.nick : ''));
  if (found.length === 0) {
    resultEl.innerHTML = '<div class="empty-state"><div class="empty-state-text">검색 결과가 없습니다.</div></div>';
  } else {
    resultEl.innerHTML = found.map(u => renderProfileCard(u, true)).join('');
  }
}

function renderRecommendFriends(el) {
  const recommended = getRecommendedUsers();
  const filterHtml = `
    <div class="card" style="margin-bottom:16px;padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="font-size:0.9rem;font-weight:700">AI 추천 설정</h3>
        <button class="btn btn-ghost btn-sm" id="resetFilter">초기화</button>
      </div>
      <div style="margin-bottom:10px">
        <label class="form-label" style="font-size:0.8rem">관심 키워드 (클릭하여 선택)</label>
        <div class="keyword-group" id="filterKeywords" style="gap:6px">
          ${['운동','독서','게임','음악','영화','여행','요리','카페','코딩','댄스'].map(k =>
            `<button class="keyword-btn ${recommendFilter.keywords.includes(k) ? 'selected' : ''}" data-val="${k}" style="padding:5px 12px;font-size:0.8rem">${k}</button>`
          ).join('')}
        </div>
      </div>
      <label class="toggle-label" style="padding-bottom:0">
        <input type="checkbox" class="toggle-input" id="filterSchoolOnly" ${recommendFilter.schoolOnly ? 'checked' : ''} />
        <span class="toggle-slider"></span>
        <span class="toggle-text" style="font-size:0.8rem">같은 학교만</span>
      </label>
    </div>`;

  if (recommended.length === 0) {
    el.innerHTML = filterHtml + '<div class="empty-state"><div class="empty-state-text">조건에 맞는 추천 유저가 없습니다.</div></div>';
  } else {
    el.innerHTML = filterHtml + `<p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">관심사 기반으로 ${recommended.length}명을 추천합니다</p>` +
      recommended.map(u => renderProfileCard(u, true)).join('');
  }

  // Filter events
  document.querySelectorAll('#filterKeywords .keyword-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        recommendFilter.keywords = recommendFilter.keywords.filter(k => k !== val);
      } else {
        btn.classList.add('selected');
        recommendFilter.keywords.push(val);
      }
      renderRecommendFriends(el);
    });
  });
  const schoolToggle = document.getElementById('filterSchoolOnly');
  if (schoolToggle) {
    schoolToggle.addEventListener('change', () => {
      recommendFilter.schoolOnly = schoolToggle.checked;
      renderRecommendFriends(el);
    });
  }
  const resetBtn = document.getElementById('resetFilter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      recommendFilter = { keywords: [], ageRange: '', schoolOnly: false };
      renderRecommendFriends(el);
    });
  }
}

function renderMatchedFriends(el) {
  const matchedList = [...matched];
  if (matchedList.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128149;</div><div class="empty-state-text">아직 매칭된 친구가 없습니다.<br>서로 OK를 누르면 친구가 됩니다!</div></div>';
    return;
  }
  el.innerHTML = matchedList.map(nick => {
    const u = getUserInfo(nick);
    return `
      <div class="friend-item" data-nick="${escapeHtml(nick)}">
        <div class="friend-info">
          <div class="friend-avatar">${nick[0]}</div>
          <div>
            <div class="friend-name">${escapeHtml(nick)}</div>
            <div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div>
          </div>
        </div>
        <div class="friend-actions">
          <button class="btn btn-ghost btn-sm friend-remove" data-nick="${escapeHtml(nick)}">삭제</button>
        </div>
      </div>`;
  }).join('');
}

function renderFriendRequests(el) {
  const requests = [...likedMe].filter(n => !matched.has(n) && !iLiked.has(n));
  if (requests.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128232;</div><div class="empty-state-text">받은 요청이 없습니다.</div></div>';
    return;
  }
  el.innerHTML = `<p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">${requests.length}명이 OK를 보냈습니다</p>` +
    requests.map(nick => {
      const u = getUserInfo(nick);
      return renderProfileCard(u, true);
    }).join('');
}

// Friend tab buttons
document.querySelectorAll('[data-ftab]').forEach(btn => {
  btn.addEventListener('click', () => renderFriendTab(btn.dataset.ftab));
});

// Friend list click events
document.getElementById('friendList').addEventListener('click', (e) => {
  // OK button
  if (e.target.classList.contains('match-ok')) {
    const nick = e.target.dataset.nick;
    iLiked.add(nick);
    if (likedMe.has(nick)) {
      matched.add(nick);
      alert('축하합니다! ' + nick + '님과 친구가 되었습니다!');
    } else {
      // 시뮬레이션: 50% 확률로 상대도 OK
      if (Math.random() > 0.5) {
        likedMe.add(nick);
        matched.add(nick);
        setTimeout(() => alert(nick + '님도 OK를 눌렀습니다! 친구가 되었어요!'), 500);
      } else {
        alert('OK를 전송했습니다. 상대방의 응답을 기다려주세요.');
      }
    }
    renderFriendTab();
    return;
  }
  // NO button
  if (e.target.classList.contains('match-no')) {
    const nick = e.target.dataset.nick;
    e.target.closest('.friend-item').style.opacity = '0.3';
    setTimeout(() => renderFriendTab(), 300);
    return;
  }
  // Remove friend
  if (e.target.classList.contains('friend-remove')) {
    const nick = e.target.dataset.nick;
    if (confirm(nick + '님을 친구 목록에서 삭제하시겠어요?')) {
      matched.delete(nick);
      iLiked.delete(nick);
      renderFriendTab();
    }
    return;
  }
  // Click profile to view
  const item = e.target.closest('.friend-item');
  if (item && !e.target.closest('.friend-actions')) {
    const nick = item.dataset.nick;
    if (nick) openUserProfile(nick);
  }
});

function openUserProfile(nick) {
  const u = getUserInfo(nick);
  const isMatch = matched.has(nick);
  const keywords = u.keywords || [];
  let extraHtml = '';
  if (isMatch) {
    if (u.bio) extraHtml += `<p class="preview-bio">${escapeHtml(u.bio)}</p>`;
  }
  document.getElementById('userProfileCard').innerHTML = `
    <div class="preview-photo"><span class="photo-placeholder">${nick[0]}</span></div>
    <h3 class="preview-name">${escapeHtml(nick)} <span style="font-size:0.9rem;color:var(--text-secondary)">${u.age || ''}</span></h3>
    <p class="preview-school">${u.school} / ${u.major} / ${u.year}</p>
    ${extraHtml}
    <div class="preview-keywords">${keywords.map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>
  `;
  const actionsEl = document.getElementById('userProfileActions');
  if (isMatch) {
    actionsEl.innerHTML = '<button class="btn btn-ghost" onclick="document.getElementById(\'userProfileModal\').classList.remove(\'active\')">닫기</button>';
  } else {
    const iSent = iLiked.has(nick);
    actionsEl.innerHTML = iSent
      ? '<button class="btn btn-ghost" disabled>OK 전송됨</button>'
      : `<button class="btn btn-primary match-ok" data-nick="${escapeHtml(nick)}">OK</button>
         <button class="btn btn-ghost match-no" data-nick="${escapeHtml(nick)}">NO</button>`;
  }
  document.getElementById('userProfileModal').classList.add('active');
}

document.getElementById('userProfileClose').addEventListener('click', () => {
  document.getElementById('userProfileModal').classList.remove('active');
});
document.getElementById('userProfileActions').addEventListener('click', (e) => {
  if (e.target.classList.contains('match-ok')) {
    const nick = e.target.dataset.nick;
    iLiked.add(nick);
    if (likedMe.has(nick)) {
      matched.add(nick);
      alert('축하합니다! ' + nick + '님과 친구가 되었습니다!');
    } else {
      alert('OK를 전송했습니다.');
    }
    document.getElementById('userProfileModal').classList.remove('active');
    renderFriendTab();
  }
  if (e.target.classList.contains('match-no')) {
    document.getElementById('userProfileModal').classList.remove('active');
  }
});

// ===== GATHERING (모임) SYSTEM =====
const GATHER_CAT_LABELS = {
  study: '스터디', hobby: '취미', food: '맛집탐방',
  exercise: '운동', travel: '여행', project: '프로젝트', etc: '기타',
};

// AI가 다듬은 홍보글 생성
function generateGatherPromo(title, desc, category, maxMembers) {
  const catLabel = GATHER_CAT_LABELS[category] || category;
  const emojis = { study: '📚', hobby: '🎨', food: '🍽️', exercise: '💪', travel: '✈️', project: '💻', etc: '✨' };
  const emoji = emojis[category] || '✨';
  return `${emoji} [${catLabel}] ${title}\n\n${desc}\n\n👥 모집 인원: ${maxMembers}명\n📌 관심 있으신 분은 가입 신청해주세요!\n\n※ 승인제로 운영됩니다.`;
}

let gatherings = [
  {
    id: 1, title: '알고리즘 스터디', category: 'study',
    rawDesc: '매주 토요일 백준 문제 풀기. 초보 환영.',
    desc: '📚 [스터디] 알고리즘 스터디\n\n매주 토요일 오후에 모여서 백준/프로그래머스 문제를 함께 풀어요! 초보자도 환영합니다.\n\n👥 모집 인원: 10명\n📌 관심 있으신 분은 가입 신청해주세요!\n\n※ 승인제로 운영됩니다.',
    host: '캠퍼스고양이', hostHidden: true, maxMembers: 10,
    members: ['캠퍼스고양이', '도서관지박령'],
    requests: [{ nick: '올A목표', date: new Date() }],
    chatMessages: [
      { author: '캠퍼스고양이', text: '이번주 문제 올렸어요!', date: new Date(Date.now() - 3600000) },
      { author: '도서관지박령', text: '넵 확인했습니다~', date: new Date(Date.now() - 1800000) },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 2, title: '맛집 탐방 모임', category: 'food',
    rawDesc: '매주 금요일 저녁 학교 근처 맛집 탐방.',
    desc: '🍽️ [맛집탐방] 맛집 탐방 모임\n\n매주 금요일 저녁, 학교 근처 숨은 맛집을 함께 찾아다녀요! 먹는 거 좋아하는 분이라면 누구나 환영!\n\n👥 모집 인원: 8명\n📌 관심 있으신 분은 가입 신청해주세요!\n\n※ 승인제로 운영됩니다.',
    host: '학식헌터', hostHidden: true, maxMembers: 8,
    members: ['학식헌터', '자취요리왕'],
    requests: [],
    chatMessages: [{ author: '학식헌터', text: '이번주는 홍대 쪽 어때요?', date: new Date(Date.now() - 7200000) }],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 3, title: '주말 등산 번개', category: 'exercise',
    rawDesc: '이번 주말 북한산 등산 같이 가요!',
    desc: '💪 [운동] 주말 등산 번개\n\n이번 주말, 북한산으로 함께 등산 가실 분 모집합니다! 초보도 환영이고, 간식은 준비할게요.\n\n👥 모집 인원: 5명\n📌 관심 있으신 분은 가입 신청해주세요!\n\n※ 승인제로 운영됩니다.',
    host: '졸업언제', hostHidden: true, maxMembers: 5,
    members: ['졸업언제', '동아리장'],
    requests: [],
    chatMessages: [],
    createdAt: new Date(Date.now() - 86400000 * 0.5),
  },
];

function renderGatherings() {
  const el = document.getElementById('gatherList');
  const query = (document.getElementById('gatherSearch').value || '').trim().toLowerCase();
  let filtered = gatherings;
  if (query) {
    filtered = gatherings.filter(g => g.title.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query));
  }
  if (filtered.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><div class="empty-state-text">모임이 없습니다. 첫 모임을 만들어보세요!</div></div>';
    return;
  }
  el.innerHTML = filtered.map(g => `
    <div class="gather-card" data-gid="${g.id}">
      <span class="gather-card-cat">${GATHER_CAT_LABELS[g.category]}</span>
      <div class="gather-card-title">${escapeHtml(g.title)}</div>
      <div class="gather-card-desc">${escapeHtml(g.desc).substring(0, 100)}...</div>
      <div class="gather-card-footer">
        <span>익명 · ${formatDate(g.createdAt)}</span>
        <span class="gather-card-members">${g.members.length}/${g.maxMembers}명</span>
      </div>
    </div>`).join('');
}

document.getElementById('gatherList').addEventListener('click', (e) => {
  const card = e.target.closest('.gather-card');
  if (card) openGatherDetail(Number(card.dataset.gid));
});

document.getElementById('gatherSearchBtn').addEventListener('click', renderGatherings);
document.getElementById('gatherSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderGatherings(); });

function openGatherDetail(gid) {
  const g = gatherings.find(x => x.id === gid);
  if (!g) return;
  const isHost = currentUser && currentUser.nick === g.host;
  const isMember = currentUser && g.members.includes(currentUser.nick);
  const hasRequested = currentUser && g.requests.some(r => r.nick === currentUser.nick);
  const isFull = g.members.length >= g.maxMembers;

  document.getElementById('gatherDetailTitle').textContent = g.title;
  document.getElementById('gatherDetailMeta').innerHTML =
    `<span>${GATHER_CAT_LABELS[g.category]}</span><span>개설자: 익명</span><span>${g.members.length}/${g.maxMembers}명</span>`;
  document.getElementById('gatherDetailDesc').textContent = g.desc;
  document.getElementById('gatherDetailTags').innerHTML = '';

  // Members (show as anonymous unless you're a member)
  document.getElementById('gatherMemberCount').textContent = `(${g.members.length}/${g.maxMembers})`;
  if (isMember) {
    document.getElementById('gatherMemberList').innerHTML = g.members.map(m =>
      `<span class="member-chip"><span class="member-avatar">${m[0]}</span>${escapeHtml(m)}${m === g.host ? ' <span class="host-badge">방장</span>' : ''}</span>`
    ).join('');
  } else {
    document.getElementById('gatherMemberList').innerHTML = `<span style="font-size:0.85rem;color:var(--text-secondary)">멤버 ${g.members.length}명 (가입 후 확인 가능)</span>`;
  }

  // Requests (only host sees with full profiles)
  const reqSection = document.getElementById('gatherRequests');
  if (isHost && g.requests.length > 0) {
    reqSection.classList.remove('hidden');
    document.getElementById('gatherRequestList').innerHTML = g.requests.map(r => {
      const u = getUserInfo(r.nick);
      return `
        <div class="request-item" data-rname="${escapeHtml(r.nick)}" data-gid="${g.id}">
          <div class="request-item-info">
            <span class="member-avatar">${r.nick[0]}</span>
            <div>
              <strong>${escapeHtml(r.nick)}</strong> (${u.school} · ${u.major} · ${u.year})
              <div style="font-size:0.75rem;color:var(--text-secondary)">${(u.keywords || []).join(', ')}</div>
            </div>
          </div>
          <div class="request-item-actions">
            <button class="btn-accept" data-action="accept">승낙</button>
            <button class="btn-reject" data-action="reject">거절</button>
          </div>
        </div>`;
    }).join('');
  } else {
    reqSection.classList.add('hidden');
  }

  // Actions
  const actionsEl = document.getElementById('gatherDetailActions');
  if (isMember) {
    actionsEl.innerHTML = `<button class="btn btn-primary" id="gatherChatEnter" data-gid="${g.id}">채팅방 입장</button>` +
      (!isHost ? `<button class="btn btn-ghost" id="gatherLeave" data-gid="${g.id}">모임 나가기</button>` : '');
  } else if (hasRequested) {
    actionsEl.innerHTML = '<button class="btn btn-ghost" disabled>신청 대기 중...</button>';
  } else if (isFull) {
    actionsEl.innerHTML = '<button class="btn btn-ghost" disabled>인원이 가득 찼습니다</button>';
  } else {
    actionsEl.innerHTML = `<button class="btn btn-primary" id="gatherApply" data-gid="${g.id}">가입 신청</button>`;
  }

  document.getElementById('gatherDetailModal').classList.add('active');
}

document.getElementById('gatherDetailModal').addEventListener('click', (e) => {
  if (e.target.id === 'gatherApply') {
    const g = gatherings.find(x => x.id === Number(e.target.dataset.gid));
    if (g && currentUser) {
      g.requests.push({ nick: currentUser.nick, date: new Date() });
      alert('가입 신청이 전송되었습니다! 개설자의 승인을 기다려주세요.');
      openGatherDetail(g.id);
    }
  }
  if (e.target.id === 'gatherLeave') {
    const g = gatherings.find(x => x.id === Number(e.target.dataset.gid));
    if (g && currentUser) {
      g.members = g.members.filter(m => m !== currentUser.nick);
      document.getElementById('gatherDetailModal').classList.remove('active');
      renderGatherings();
    }
  }
  if (e.target.id === 'gatherChatEnter') {
    const gid = Number(e.target.dataset.gid);
    document.getElementById('gatherDetailModal').classList.remove('active');
    switchTab('chat');
    openChatRoom(gid);
  }
  if (e.target.dataset.action === 'accept' || e.target.dataset.action === 'reject') {
    const item = e.target.closest('.request-item');
    const rname = item.dataset.rname;
    const gid = Number(item.dataset.gid);
    const g = gatherings.find(x => x.id === gid);
    if (!g) return;
    g.requests = g.requests.filter(r => r.nick !== rname);
    if (e.target.dataset.action === 'accept' && g.members.length < g.maxMembers) {
      g.members.push(rname);
      alert(rname + '님을 승낙했습니다!');
    }
    openGatherDetail(gid);
  }
});

document.getElementById('gatherDetailClose').addEventListener('click', () => {
  document.getElementById('gatherDetailModal').classList.remove('active');
});

// Create Gathering
document.getElementById('gatherModalClose').addEventListener('click', () => document.getElementById('gatherModal').classList.remove('active'));
document.getElementById('gatherCancelBtn').addEventListener('click', () => document.getElementById('gatherModal').classList.remove('active'));

document.getElementById('gatherSubmitBtn').addEventListener('click', () => {
  const title = document.getElementById('gatherTitle').value.trim();
  const category = document.getElementById('gatherCategory').value;
  const desc = document.getElementById('gatherDesc').value.trim();
  const maxMembers = Number(document.getElementById('gatherMax').value);
  const tagsStr = document.getElementById('gatherTags').value.trim();
  if (!title || !desc) { alert('모임 이름과 소개를 입력해주세요.'); return; }

  // AI가 홍보글 다듬기
  const promoDesc = generateGatherPromo(title, desc, category, maxMembers);

  gatherings.unshift({
    id: Date.now(),
    title, category,
    rawDesc: desc,
    desc: promoDesc,
    host: currentUser.nick,
    hostHidden: true,
    maxMembers,
    members: [currentUser.nick],
    requests: [],
    chatMessages: [],
    createdAt: new Date(),
  });
  document.getElementById('gatherTitle').value = '';
  document.getElementById('gatherDesc').value = '';
  document.getElementById('gatherTags').value = '';
  document.getElementById('gatherModal').classList.remove('active');
  renderGatherings();
});

// ===== CHAT SYSTEM =====
let currentChatGid = null;

function renderChatRooms() {
  const el = document.getElementById('chatRoomList');
  document.getElementById('chatListView').classList.remove('hidden');
  document.getElementById('chatRoomView').classList.add('hidden');

  const myRooms = gatherings.filter(g => currentUser && g.members.includes(currentUser.nick));
  if (myRooms.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128172;</div><div class="empty-state-text">참여 중인 채팅방이 없습니다.<br>모임에 가입하면 채팅방이 생겨요!</div></div>';
    return;
  }
  el.innerHTML = myRooms.map(g => {
    const lastMsg = g.chatMessages.length > 0 ? g.chatMessages[g.chatMessages.length - 1] : null;
    return `
      <div class="chat-room-item" data-gid="${g.id}">
        <div class="chat-room-info">
          <div class="chat-room-icon">${g.title[0]}</div>
          <div>
            <div class="chat-room-name">${escapeHtml(g.title)}</div>
            <div class="chat-room-last">${lastMsg ? escapeHtml(lastMsg.text).substring(0, 30) : '메시지가 없습니다'}</div>
          </div>
        </div>
        <div class="chat-room-meta">
          <div class="chat-room-time">${lastMsg ? formatDate(lastMsg.date) : ''}</div>
          <div style="font-size:0.75rem;color:var(--text-secondary)">${g.members.length}명</div>
        </div>
      </div>`;
  }).join('');
}

document.getElementById('chatRoomList').addEventListener('click', (e) => {
  const item = e.target.closest('.chat-room-item');
  if (item) openChatRoom(Number(item.dataset.gid));
});

function openChatRoom(gid) {
  const g = gatherings.find(x => x.id === gid);
  if (!g) return;
  currentChatGid = gid;
  document.getElementById('chatListView').classList.add('hidden');
  document.getElementById('chatRoomView').classList.remove('hidden');
  document.getElementById('chatRoomName').textContent = g.title;
  document.getElementById('chatMemberCount').textContent = g.members.length + '명';
  renderChatMessages(g);
}

function renderChatMessages(g) {
  const el = document.getElementById('chatMessages');
  if (g.chatMessages.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-text">첫 메시지를 보내보세요!</div></div>';
    return;
  }
  el.innerHTML = g.chatMessages.map(m => {
    const isMine = currentUser && m.author === currentUser.nick;
    return `
      <div class="chat-msg ${isMine ? 'mine' : 'other'}">
        ${!isMine ? `<div class="chat-msg-author">${escapeHtml(m.author)}</div>` : ''}
        <div class="chat-msg-bubble">${escapeHtml(m.text)}</div>
        <div class="chat-msg-time">${formatDate(m.date)}</div>
      </div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatGid) return;
  const g = gatherings.find(x => x.id === currentChatGid);
  if (!g) return;
  g.chatMessages.push({ author: currentUser ? currentUser.nick : '익명', text, date: new Date() });
  input.value = '';
  renderChatMessages(g);

  // Simulate reply
  setTimeout(() => {
    const replies = ['ㅋㅋㅋ 좋아요!', '오 그거 좋네요', '넵!', '저도 동의해요~', '언제 만나요?', '좋은 생각이에요!'];
    const others = g.members.filter(m => !currentUser || m !== currentUser.nick);
    if (others.length > 0) {
      g.chatMessages.push({
        author: others[Math.floor(Math.random() * others.length)],
        text: replies[Math.floor(Math.random() * replies.length)],
        date: new Date(),
      });
      if (currentChatGid === g.id) renderChatMessages(g);
    }
  }, 1500 + Math.random() * 2000);
}

document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChatMessage(); });
document.getElementById('chatBackBtn').addEventListener('click', () => { currentChatGid = null; renderChatRooms(); });
