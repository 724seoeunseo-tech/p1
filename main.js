// Sample data
const CATEGORY_LABELS = {
  free: '자유게시판',
  question: '질문답변',
  info: '정보공유',
  review: '후기',
};

const NICKNAMES = [
  '하늘바라기', '코딩마스터', '여행러버', '맛집탐험가', '음악덕후',
  '게임왕', '독서광', '운동매니아', '사진작가', '요리사',
];

const SAMPLE_TITLES = [
  { cat: 'free', title: '오늘 날씨가 정말 좋네요', content: '창밖을 보니 하늘이 맑고 기분이 좋아지는 날이에요. 이런 날은 산책이라도 나가고 싶네요. 여러분은 오늘 뭐 하세요?' },
  { cat: 'question', title: 'JavaScript 비동기 처리 질문이요', content: 'async/await를 사용할 때 에러 처리를 어떻게 하는 게 좋을까요? try-catch를 쓰는 게 맞는지, 아니면 .catch()를 사용하는 게 더 나은지 궁금합니다.' },
  { cat: 'info', title: '유용한 무료 디자인 도구 모음', content: 'Figma, Canva, Photopea 등 무료로 사용할 수 있는 디자인 도구들을 정리해봤어요. 특히 Figma는 협업할 때 정말 편리합니다.' },
  { cat: 'free', title: '주말에 본 영화 추천해요', content: '이번 주말에 영화를 봤는데 정말 재미있었어요! 스릴러 장르인데 반전이 대박이에요. 스포 없이 추천합니다.' },
  { cat: 'review', title: '새로 산 키보드 후기', content: '기계식 키보드를 새로 샀는데 타건감이 정말 좋아요. 적축이라 사무실에서도 부담 없이 쓸 수 있고, LED도 이쁘네요.' },
  { cat: 'question', title: 'CSS Grid vs Flexbox 언제 뭘 써야 하나요?', content: '레이아웃을 잡을 때 Grid와 Flexbox 중 어떤 걸 써야 할지 항상 고민돼요. 기준이 있을까요?' },
  { cat: 'info', title: '개발자 필수 VS Code 확장 프로그램', content: 'Prettier, ESLint, GitLens 등 개발할 때 꼭 필요한 VS Code 확장 프로그램 목록을 정리해봤습니다.' },
  { cat: 'free', title: '점심 뭐 먹을지 고민...', content: '매일 점심 메뉴 고르는 게 제일 어려워요. 오늘은 뭘 먹을까요? 추천 부탁드립니다 ㅎㅎ' },
  { cat: 'review', title: '제주도 3박 4일 여행 후기', content: '지난 주에 제주도 다녀왔는데 너무 좋았어요. 특히 성산일출봉에서 본 일출이 정말 감동적이었습니다.' },
  { cat: 'question', title: 'React와 Vue 중에 뭘 배울까요?', content: '프론트엔드 프레임워크를 배우려고 하는데 React와 Vue 중 어떤 걸 먼저 배우는 게 좋을까요?' },
  { cat: 'info', title: '2024 개발 트렌드 정리', content: 'AI, 클라우드 네이티브, 엣지 컴퓨팅 등 올해 주목할 개발 트렌드를 정리해봤어요.' },
  { cat: 'free', title: '코딩하다가 생긴 웃긴 일', content: '세미콜론 하나 빼먹어서 3시간 디버깅한 사람 저만 있는 건 아니겠죠...?' },
  { cat: 'review', title: '온라인 강의 플랫폼 비교 후기', content: 'Udemy, Coursera, 인프런 등 여러 플랫폼을 써본 후기입니다. 각 플랫폼마다 장단점이 있더라고요.' },
  { cat: 'question', title: 'Git 브랜치 전략 어떻게 하시나요?', content: '팀 프로젝트에서 Git 브랜치를 어떻게 관리하는 게 좋을까요? Git Flow를 사용하시나요?' },
  { cat: 'free', title: '재택근무 꿀팁 공유합니다', content: '재택근무 2년차인데 생산성 높이는 팁 몇 가지 공유할게요. 제일 중요한 건 작업 공간 분리입니다.' },
];

function generatePosts() {
  const posts = [];
  for (let i = 0; i < SAMPLE_TITLES.length; i++) {
    const sample = SAMPLE_TITLES[i];
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    posts.push({
      id: i + 1,
      category: sample.cat,
      title: sample.title,
      content: sample.content,
      author: NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)],
      date: date,
      views: Math.floor(Math.random() * 500) + 10,
      likes: Math.floor(Math.random() * 50),
      comments: generateComments(Math.floor(Math.random() * 5)),
      tags: getRandomTags(),
    });
  }
  return posts;
}

function getRandomTags() {
  const allTags = ['일상', '개발', '취미', '여행', '맛집', '음악', '영화', '게임', '공부', '운동'];
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateComments(count) {
  const texts = [
    '좋은 글이네요!', '공감합니다 ㅎㅎ', '유용한 정보 감사합니다.',
    '저도 같은 생각이에요.', '오 대박 감사해요!',
  ];
  const comments = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    comments.push({
      author: NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)],
      text: texts[Math.floor(Math.random() * texts.length)],
      date: date,
    });
  }
  return comments;
}

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

// State
let posts = generatePosts();
let currentSort = 'latest';
let currentCategory = 'all';
let currentPage = 1;
let currentPostId = null;
const POSTS_PER_PAGE = 8;

// DOM
const postListEl = document.getElementById('postList');
const paginationEl = document.getElementById('pagination');
const writeModal = document.getElementById('writeModal');
const detailModal = document.getElementById('detailModal');

function getFilteredPosts() {
  let filtered = [...posts];
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  if (currentSort === 'latest') {
    filtered.sort((a, b) => b.date - a.date);
  } else if (currentSort === 'popular') {
    filtered.sort((a, b) => b.likes - a.likes);
  } else if (currentSort === 'comments') {
    filtered.sort((a, b) => b.comments.length - a.comments.length);
  }
  return filtered;
}

function renderPosts() {
  const filtered = getFilteredPosts();
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);

  if (pagePosts.length === 0) {
    postListEl.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8;">게시글이 없습니다.</div>';
    paginationEl.innerHTML = '';
    return;
  }

  postListEl.innerHTML = pagePosts.map(post => `
    <div class="post-item" data-id="${post.id}">
      <div class="post-item-header">
        <span class="post-category">${CATEGORY_LABELS[post.category]}</span>
        <span class="post-title">${escapeHtml(post.title)}</span>
        ${post.comments.length > 0 ? `<span class="post-comment-count">[${post.comments.length}]</span>` : ''}
      </div>
      <div class="post-meta">
        <span>${post.author}</span>
        <span>${formatDate(post.date)}</span>
        <span>조회 ${post.views}</span>
        <span>&#9829; ${post.likes}</span>
      </div>
    </div>
  `).join('');

  paginationEl.innerHTML = Array.from({ length: totalPages }, (_, i) =>
    `<button class="page-btn ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`
  ).join('');
}

function openDetail(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  currentPostId = postId;
  post.views++;

  document.getElementById('detailTitle').textContent = post.title;
  document.getElementById('detailMeta').innerHTML =
    `<span>${CATEGORY_LABELS[post.category]}</span><span>${post.author}</span><span>${formatDate(post.date)}</span><span>조회 ${post.views}</span>`;
  document.getElementById('detailContent').textContent = post.content;
  document.getElementById('detailTags').innerHTML =
    post.tags.map(t => `<span class="tag">#${t}</span>`).join('');
  document.getElementById('likeCount').textContent = post.likes;

  const likeBtn = document.getElementById('likeBtn');
  likeBtn.classList.remove('liked');

  renderComments(post);
  detailModal.classList.add('active');
}

function renderComments(post) {
  const commentListEl = document.getElementById('commentList');
  if (post.comments.length === 0) {
    commentListEl.innerHTML = '<div style="color:#94a3b8;font-size:0.85rem;">아직 댓글이 없습니다.</div>';
    return;
  }
  commentListEl.innerHTML = post.comments.map(c => `
    <div class="comment-item">
      <div class="comment-author">${escapeHtml(c.author)}</div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
      <div class="comment-time">${formatDate(c.date)}</div>
    </div>
  `).join('');
}

// Event listeners
document.getElementById('writeBtn').addEventListener('click', () => {
  writeModal.classList.add('active');
});

document.getElementById('modalClose').addEventListener('click', () => {
  writeModal.classList.remove('active');
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  writeModal.classList.remove('active');
});

document.getElementById('detailClose').addEventListener('click', () => {
  detailModal.classList.remove('active');
  currentPostId = null;
});

document.getElementById('submitBtn').addEventListener('click', () => {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const category = document.getElementById('postCategory').value;
  const tagsStr = document.getElementById('postTags').value.trim();

  if (!title || !content) {
    alert('제목과 내용을 입력해주세요.');
    return;
  }

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
  const newPost = {
    id: posts.length + 1,
    category,
    title,
    content,
    author: '나',
    date: new Date(),
    views: 0,
    likes: 0,
    comments: [],
    tags,
  };
  posts.unshift(newPost);
  currentPage = 1;
  renderPosts();

  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
  document.getElementById('postTags').value = '';
  writeModal.classList.remove('active');
});

postListEl.addEventListener('click', (e) => {
  const item = e.target.closest('.post-item');
  if (item) {
    openDetail(Number(item.dataset.id));
  }
});

paginationEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('page-btn')) {
    currentPage = Number(e.target.dataset.page);
    renderPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    currentPage = 1;
    renderPosts();
  });
});

document.querySelectorAll('.category-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    currentCategory = item.dataset.category;
    currentPage = 1;
    renderPosts();
  });
});

document.getElementById('likeBtn').addEventListener('click', () => {
  const post = posts.find(p => p.id === currentPostId);
  if (!post) return;
  const btn = document.getElementById('likeBtn');
  if (btn.classList.contains('liked')) {
    post.likes--;
    btn.classList.remove('liked');
  } else {
    post.likes++;
    btn.classList.add('liked');
  }
  document.getElementById('likeCount').textContent = post.likes;
  renderPosts();
});

document.getElementById('commentBtn').addEventListener('click', () => {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text) return;
  const post = posts.find(p => p.id === currentPostId);
  if (!post) return;
  post.comments.push({ author: '나', text, date: new Date() });
  renderComments(post);
  renderPosts();
  input.value = '';
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) {
    posts = generatePosts();
  } else {
    posts = generatePosts().filter(p =>
      p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query)
    );
  }
  currentPage = 1;
  renderPosts();
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

// Close modals on overlay click
[writeModal, detailModal].forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      currentPostId = null;
    }
  });
});

// Nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const text = link.textContent;
    if (text === '전체') { currentCategory = 'all'; currentSort = 'latest'; }
    else if (text === '인기') { currentCategory = 'all'; currentSort = 'popular'; }
    else if (text === '질문') { currentCategory = 'question'; currentSort = 'latest'; }
    else if (text === '자유') { currentCategory = 'free'; currentSort = 'latest'; }
    currentPage = 1;
    renderPosts();
  });
});

// Init
renderPosts();
