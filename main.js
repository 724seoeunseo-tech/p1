// ===== VIRTUAL USER GENERATION (5 schools × 100 students) =====
const SCHOOLS = ['한국항공대','서강대','연세대','홍익대','이화여대'];
const MAJORS_BY_SCHOOL = {
  '한국항공대': ['항공우주공학','항공전자공학','소프트웨어학','항공교통물류학','기계공학','경영학','항공운항학','항공재료공학'],
  '서강대': ['컴퓨터공학','경영학','경제학','심리학','영문학','화학','물리학','수학','사회학','철학'],
  '연세대': ['컴퓨터공학','경영학','의예과','전기전자공학','심리학','경제학','국문학','화학공학','생명공학','정치외교학'],
  '홍익대': ['시각디자인','산업디자인','건축학','미술학','경영학','컴퓨터공학','영문학','광고홍보학','도예유리과','섬유미술패션디자인'],
  '이화여대': ['컴퓨터공학','경영학','국제학','심리학','약학','간호학','영문학','미디어학','화학','교육학'],
};
const YEARS = ['1학년','2학년','3학년','4학년'];
const GENDERS_BY_SCHOOL = { '이화여대': ['여성'], default: ['남성','여성'] };
const ALL_KEYWORDS = ['운동','독서','게임','음악','영화','여행','사진','요리','그림','댄스','등산','캠핑','한식','일식','중식','양식','카페','디저트','매운음식','치킨','피자','분식','활발한','조용한','유머러스','다정한','지적인','감성적','모험적','계획적'];
const LAST_NAMES = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','전'];
const MALE_FIRST = ['민준','서준','예준','도윤','시우','하준','주원','지호','지후','준서','현우','도현','수호','지훈','우진','태민','성민','재현','건우','정우'];
const FEMALE_FIRST = ['서연','서윤','지우','서현','하은','하윤','민서','지유','윤서','채원','수빈','지민','예은','소율','다은','하린','유진','소희','지현','예진'];
const BIOS = [
  '대학생활 열심히 하는 중!','맛집 탐방이 취미예요','운동 같이 할 사람 구해요','카페에서 공부하는 걸 좋아해요',
  '코딩하면서 밤새는 사람','영화 보는 게 제일 좋아요','여행 계획 세우는 중!','음악 없이 못 살아요',
  '게임 같이 할 친구 구함','독서 모임 관심 있어요','사진 찍는 거 좋아해요','요리 배우고 싶어요',
  '등산 초보인데 같이 가요','캠핑 러버입니다','그림 그리는 걸 좋아해요','댄스 동아리 소속이에요',
  '스터디 같이 해요!','자취 생활 꿀팁 공유','동아리 활동 열심히 하는 중','취업 준비 화이팅!',
];
const LOCATIONS = ['서울 마포구','서울 서대문구','서울 강남구','서울 관악구','서울 성동구','경기 고양시','경기 성남시','서울 동대문구','서울 용산구','서울 종로구','인천 연수구','경기 수원시'];
const INSTA_PREFIXES = ['_','xx','0','dear_','hi_','the_','my','love_'];

function generateUsers() {
  const users = [];
  let id = 1;
  SCHOOLS.forEach(school => {
    const majors = MAJORS_BY_SCHOOL[school];
    const genders = GENDERS_BY_SCHOOL[school] || GENDERS_BY_SCHOOL.default;
    for (let i = 0; i < 100; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const firstNames = gender === '남성' ? MALE_FIRST : FEMALE_FIRST;
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const name = lastName + firstName;
      const major = majors[Math.floor(Math.random() * majors.length)];
      const year = YEARS[Math.floor(Math.random() * YEARS.length)];
      const age = String(19 + Math.floor(Math.random() * 8));
      const height = String(gender === '남성' ? 165 + Math.floor(Math.random() * 20) : 155 + Math.floor(Math.random() * 16)) + 'cm';
      const kw = [...ALL_KEYWORDS].sort(() => .5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 4));
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const instaId = INSTA_PREFIXES[Math.floor(Math.random() * INSTA_PREFIXES.length)] + firstName.toLowerCase() + (Math.random() < 0.5 ? Math.floor(Math.random() * 100) : '');
      users.push({
        id: id++, name, email: name.toLowerCase() + id + '@univer.kr',
        school, major, year, age, gender, bio: BIOS[Math.floor(Math.random() * BIOS.length)],
        keywords: kw, photos: [],
        height, location, insta: instaId,
        showHeight: Math.random() > 0.3, showLocation: Math.random() > 0.3, showInsta: Math.random() > 0.2,
      });
    }
  });
  return users;
}

const ALL_USERS = generateUsers();
function getUserById(id) { return ALL_USERS.find(u => u.id === id); }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function formatDate(date) {
  const diff = Date.now() - date;
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return m + '분 전';
  const h = Math.floor(m / 60);
  if (h < 24) return h + '시간 전';
  const d2 = Math.floor(h / 24);
  if (d2 < 7) return d2 + '일 전';
  return new Date(date).toLocaleDateString('ko-KR');
}

// ===== SPLASH =====
setTimeout(() => document.getElementById('splash').style.display = 'none', 3600);

// ===== AUTH =====
let currentUser = null;
const loginCard = document.getElementById('loginCard');
const signupCard = document.getElementById('signupCard');
document.getElementById('goSignup').addEventListener('click', (e) => { e.preventDefault(); loginCard.classList.add('hidden'); signupCard.classList.remove('hidden'); });
document.getElementById('goLogin').addEventListener('click', (e) => { e.preventDefault(); signupCard.classList.add('hidden'); loginCard.classList.remove('hidden'); });

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPassword').value.trim();
  if (!email || !pw) { alert('이메일과 비밀번호를 입력해주세요.'); return; }
  currentUser = { id: 9999, email, univ: '서강대' };
  currentUser.profile = { name: email.split('@')[0], school: '서강대', major: '컴퓨터공학', year: '3학년', age: '23', gender: '남성', bio: '안녕하세요!', keywords: ['게임','음악','카페'], photos: [], height: '175cm', location: '서울 마포구', insta: 'univer_user', showHeight: true, showLocation: true, showInsta: true };
  enterApp();
});

document.getElementById('signupBtn').addEventListener('click', () => {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const univ = document.getElementById('signupUniv').value;
  const pw = document.getElementById('signupPassword').value.trim();
  const pwc = document.getElementById('signupPasswordConfirm').value.trim();
  if (!name || !email || !univ || !pw) { alert('모든 항목을 입력해주세요.'); return; }
  if (pw.length < 8) { alert('비밀번호는 8자 이상이어야 합니다.'); return; }
  if (pw !== pwc) { alert('비밀번호가 일치하지 않습니다.'); return; }
  currentUser = { id: 9999, name, email, univ };
  enterProfile(false);
});

document.getElementById('googleLoginBtn').addEventListener('click', () => {
  currentUser = { id: 9999, email: 'user@gmail.com', univ: '서강대' };
  currentUser.profile = { name: '구글유저', school: '서강대', major: '경영학', year: '2학년', age: '22', gender: '여성', bio: '', keywords: ['카페','영화','여행'], photos: [], height: '163cm', location: '서울 서대문구', insta: 'google_user', showHeight: true, showLocation: true, showInsta: true };
  enterApp();
});

function enterProfile(isEdit) {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('myProfileView').classList.add('hidden');
  document.getElementById('profilePage').classList.remove('hidden');
  document.getElementById('profilePageTitle').textContent = isEdit ? '프로필 수정' : '프로필을 완성해주세요';
  if (currentUser.univ) document.getElementById('profSchool').value = currentUser.univ;
  if (isEdit && currentUser.profile) {
    const p = currentUser.profile;
    document.getElementById('profName').value = p.name || '';
    document.getElementById('profAge').value = p.age || '';
    document.getElementById('profGender').value = p.gender || '';
    document.getElementById('profSchool').value = p.school || '';
    document.getElementById('profMajor').value = p.major || '';
    document.getElementById('profYear').value = p.year || '';
    document.getElementById('profBio').value = p.bio || '';
    document.getElementById('bioCount').textContent = (p.bio || '').length;
    document.getElementById('profHeight').value = p.height || '';
    document.getElementById('profLocation').value = p.location || '';
    document.getElementById('profInsta').value = p.insta || '';
    if (p.showHeight !== undefined) document.getElementById('toggleHeight').checked = p.showHeight;
    if (p.showLocation !== undefined) document.getElementById('toggleLocation').checked = p.showLocation;
    if (p.showInsta !== undefined) document.getElementById('toggleInsta').checked = p.showInsta;
    // Restore keywords
    selectedKeywords = [...(p.keywords || [])];
    document.querySelectorAll('.keyword-btn').forEach(btn => {
      btn.classList.toggle('selected', selectedKeywords.includes(btn.dataset.val));
    });
    document.getElementById('keywordCount').textContent = selectedKeywords.length;
    // Restore photos
    profilePhotos = [...(p.photos || [])];
    renderPhotoSlots();
  }
  showStep(1);
}

function enterApp() {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  document.getElementById('myProfileView').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('userName').textContent = currentUser.profile ? currentUser.profile.name : (currentUser.name || '');
  switchTab('friends');
}

// ===== PROFILE SETUP =====
let selectedKeywords = [];
let profilePhotos = [];

// Multi-photo upload
const photoUploadArea = document.getElementById('photoUploadArea');
const photoInput = document.getElementById('photoInput');
const addPhotoSlot = document.getElementById('addPhotoSlot');

addPhotoSlot.addEventListener('click', () => {
  if (profilePhotos.length >= 6) { alert('최대 6장까지 업로드 가능합니다.'); return; }
  photoInput.click();
});

photoInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  const remaining = 6 - profilePhotos.length;
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      profilePhotos.push(ev.target.result);
      renderPhotoSlots();
    };
    reader.readAsDataURL(file);
  });
  photoInput.value = '';
});

function renderPhotoSlots() {
  photoUploadArea.innerHTML = '';
  profilePhotos.forEach((src, i) => {
    const slot = document.createElement('div');
    slot.className = 'photo-slot';
    slot.innerHTML = `<img src="${src}" /><button class="photo-remove" data-idx="${i}">&times;</button>`;
    photoUploadArea.appendChild(slot);
  });
  if (profilePhotos.length < 6) {
    const addSlot = document.createElement('div');
    addSlot.className = 'photo-slot';
    addSlot.id = 'addPhotoSlot';
    addSlot.innerHTML = '<span class="photo-placeholder">+</span>';
    addSlot.addEventListener('click', () => photoInput.click());
    photoUploadArea.appendChild(addSlot);
  }
}

photoUploadArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('photo-remove')) {
    profilePhotos.splice(Number(e.target.dataset.idx), 1);
    renderPhotoSlots();
  }
});

document.getElementById('profBio').addEventListener('input', (e) => { document.getElementById('bioCount').textContent = e.target.value.length; });

function showStep(n) {
  document.querySelectorAll('.profile-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + n).classList.remove('hidden');
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const st = document.querySelector(`.step[data-step="${n}"]`);
  if (st) st.classList.add('active');
}

document.getElementById('toStep2').addEventListener('click', () => {
  const name = document.getElementById('profName').value.trim();
  const age = document.getElementById('profAge').value;
  const gender = document.getElementById('profGender').value;
  const major = document.getElementById('profMajor').value.trim();
  if (!name || !age || !gender || !major) { alert('이름, 나이, 성별, 전공은 필수입니다.'); return; }
  showStep(2);
});
document.getElementById('backStep1').addEventListener('click', () => showStep(1));
document.getElementById('toStep3').addEventListener('click', () => {
  if (selectedKeywords.length < 3) { alert('키워드를 최소 3개 선택해주세요.'); return; }
  showStep(3);
});
document.getElementById('backStep2').addEventListener('click', () => showStep(2));
document.getElementById('toStep4').addEventListener('click', () => { renderPreview(); showStep(4); });
document.getElementById('backStep3').addEventListener('click', () => showStep(3));

document.querySelectorAll('.keyword-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.val;
    if (btn.classList.contains('selected')) { btn.classList.remove('selected'); selectedKeywords = selectedKeywords.filter(k => k !== v); }
    else { if (selectedKeywords.length >= 10) { alert('최대 10개'); return; } btn.classList.add('selected'); selectedKeywords.push(v); }
    document.getElementById('keywordCount').textContent = selectedKeywords.length;
  });
});

document.querySelectorAll('.toggle-input').forEach(t => {
  t.addEventListener('change', () => { t.closest('.toggle-label').querySelector('.toggle-text').textContent = t.checked ? '공개' : '비공개'; });
});

function renderPreview() {
  const n = document.getElementById('profName').value.trim(), s = document.getElementById('profSchool').value.trim(),
    mj = document.getElementById('profMajor').value.trim(), y = document.getElementById('profYear').value, a = document.getElementById('profAge').value,
    g = document.getElementById('profGender').value,
    b = document.getElementById('profBio').value.trim(), h = document.getElementById('profHeight').value.trim(),
    l = document.getElementById('profLocation').value.trim(), ig = document.getElementById('profInsta').value.trim();
  document.getElementById('previewName').textContent = n + ' (' + a + ', ' + g + ')';
  document.getElementById('previewSchool').textContent = s + ' / ' + mj + (y ? ' / ' + y : '');
  document.getElementById('previewBio').textContent = b || '자기소개가 없습니다.';
  document.getElementById('previewPhoto').innerHTML = profilePhotos.length > 0 ? `<img src="${profilePhotos[0]}" />` : '<span class="photo-placeholder">?</span>';
  document.getElementById('previewKeywords').innerHTML = selectedKeywords.map(k => `<span class="preview-keyword">${k}</span>`).join('');
  let ext = '';
  if (h && document.getElementById('toggleHeight').checked) ext += `<span class="preview-extra-item">${h}</span>`;
  if (l && document.getElementById('toggleLocation').checked) ext += `<span class="preview-extra-item">${l}</span>`;
  if (ig && document.getElementById('toggleInsta').checked) ext += `<span class="preview-extra-item"><a href="https://instagram.com/${encodeURIComponent(ig.replace('@',''))}" target="_blank">@${escapeHtml(ig.replace('@',''))}</a></span>`;
  document.getElementById('previewExtra').innerHTML = ext;
}

document.getElementById('profileComplete').addEventListener('click', () => {
  currentUser.profile = {
    name: document.getElementById('profName').value.trim(), age: document.getElementById('profAge').value,
    gender: document.getElementById('profGender').value,
    school: document.getElementById('profSchool').value.trim(), major: document.getElementById('profMajor').value.trim(),
    year: document.getElementById('profYear').value, bio: document.getElementById('profBio').value.trim(),
    keywords: [...selectedKeywords], photos: [...profilePhotos],
    height: document.getElementById('profHeight').value.trim(),
    location: document.getElementById('profLocation').value.trim(), insta: document.getElementById('profInsta').value.trim(),
    showHeight: document.getElementById('toggleHeight').checked, showLocation: document.getElementById('toggleLocation').checked,
    showInsta: document.getElementById('toggleInsta').checked,
  };
  currentUser.univ = currentUser.profile.school;
  currentUser.name = currentUser.profile.name;
  enterApp();
});

document.getElementById('logoutBtn').addEventListener('click', () => { currentUser = null; document.getElementById('app').classList.add('hidden'); document.getElementById('authPage').classList.remove('hidden'); document.getElementById('authPage').style.opacity = '1'; });

// My Profile Button → show profile view
document.getElementById('myProfileBtn').addEventListener('click', () => {
  if (!currentUser || !currentUser.profile) return;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('myProfileView').classList.remove('hidden');
  renderMyProfileView();
});

function renderMyProfileView() {
  const p = currentUser.profile;
  // Photo slider
  const photosEl = document.getElementById('myProfilePhotos');
  renderPhotoSlider(photosEl, p.photos || [], 0);
  // Preview
  const prev = document.getElementById('myProfilePreview');
  let instaHtml = '';
  if (p.insta && p.showInsta) instaHtml = `<span class="preview-extra-item"><a href="https://instagram.com/${encodeURIComponent(p.insta.replace('@',''))}" target="_blank">@${escapeHtml(p.insta.replace('@',''))}</a></span>`;
  prev.innerHTML = `
    <h3 class="preview-name">${escapeHtml(p.name)} (${p.age}, ${p.gender})</h3>
    <p class="preview-school">${p.school} / ${p.major}${p.year ? ' / ' + p.year : ''}</p>
    <p class="preview-bio">${escapeHtml(p.bio || '자기소개가 없습니다.')}</p>
    <div class="preview-keywords">${(p.keywords || []).map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>
    <div class="preview-extra">
      ${p.height && p.showHeight ? `<span class="preview-extra-item">${escapeHtml(p.height)}</span>` : ''}
      ${p.location && p.showLocation ? `<span class="preview-extra-item">${escapeHtml(p.location)}</span>` : ''}
      ${instaHtml}
    </div>`;
}

document.getElementById('myProfileBackBtn').addEventListener('click', () => { document.getElementById('myProfileView').classList.add('hidden'); document.getElementById('app').classList.remove('hidden'); });
document.getElementById('myProfileEditBtn').addEventListener('click', () => { document.getElementById('myProfileView').classList.add('hidden'); enterProfile(true); });

// ===== PHOTO SLIDER UTILITY =====
function renderPhotoSlider(container, photos, startIdx) {
  let idx = startIdx || 0;
  function render() {
    if (!photos || photos.length === 0) {
      container.innerHTML = '<div class="slider-placeholder">?</div>';
      return;
    }
    const dots = photos.map((_, i) => `<span class="slider-dot ${i === idx ? 'active' : ''}"></span>`).join('');
    container.innerHTML = `
      <button class="slider-btn slider-prev">&lsaquo;</button>
      <img class="slider-img" src="${photos[idx]}" />
      <button class="slider-btn slider-next">&rsaquo;</button>
      <div class="slider-dots">${dots}</div>`;
    container.querySelector('.slider-prev').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx - 1 + photos.length) % photos.length; render(); });
    container.querySelector('.slider-next').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % photos.length; render(); });
  }
  render();
}

// ===== TAB NAVIGATION =====
let currentTab = 'friends';
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.nav-link[data-tab="${tab}"]`);
  if (link) link.classList.add('active');
  if (tab === 'friends') { document.getElementById('tabFriends').classList.remove('hidden'); renderFriendsPage(); }
  else if (tab === 'gather') { document.getElementById('tabGather').classList.remove('hidden'); renderGatherings(); }
  else if (tab === 'chat') { document.getElementById('tabChat').classList.remove('hidden'); renderChatRooms(); }
  else if (tab === 'board') { document.getElementById('tabBoard').classList.remove('hidden'); initBoard(); renderPosts(); }
}
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', (e) => { e.preventDefault(); switchTab(l.dataset.tab); }));

function showSubPage(id) { document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); }

// ===== FRIENDS SYSTEM =====
let matched = new Set();
let sentOK = new Set();
let receivedRequests = new Set();
let dmChats = {};

// Simulate initial state
(function simulateRequests() {
  const schoolUsers = ALL_USERS.filter(u => u.school === '서강대');
  for (let i = 0; i < 8; i++) receivedRequests.add(schoolUsers[Math.floor(Math.random() * schoolUsers.length)].id);
  for (let i = 0; i < 5; i++) matched.add(schoolUsers[10 + i].id);
  // Init DM chats with some friends
  matched.forEach(fid => {
    const u = getUserById(fid);
    if (u && Math.random() > 0.5) {
      dmChats[fid] = [
        { author: fid, text: '안녕하세요! 반갑습니다 :)', date: new Date(Date.now() - 3600000 * 2) },
      ];
    }
  });
})();

// Recommendation settings state
let recSettings = { location: '', school: '', major: '', ageMin: '', ageMax: '', gender: '', heightMin: '', heightMax: '' };

function renderFriendsPage() {
  document.getElementById('requestBadge').textContent = receivedRequests.size;
  renderFriendList();
  renderSwipeCard();
}

function renderFriendList() {
  const el = document.getElementById('friendListContent');
  const query = document.getElementById('friendSearchInput').value.trim().toLowerCase();
  const friendIds = [...matched];

  if (query) {
    const results = ALL_USERS.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
    if (results.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">검색 결과가 없습니다.</div></div>'; return; }
    el.innerHTML = results.slice(0, 20).map(u => renderFriendListItem(u, matched.has(u.id))).join('');
    return;
  }

  if (friendIds.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128075;</div><div class="empty-state-text">아직 친구가 없습니다.<br>추천 친구에서 OK를 눌러보세요!</div></div>';
    return;
  }
  el.innerHTML = friendIds.map(id => {
    const u = getUserById(id);
    if (!u) return '';
    return renderFriendListItem(u, true);
  }).join('');
}

function renderFriendListItem(u, isFriend) {
  const dmBtn = isFriend ? `<button class="friend-dm-btn" data-uid="${u.id}" title="메시지 보내기">&#128172;</button>` : '';
  return `<div class="friend-item" data-uid="${u.id}">
    <div class="friend-info"><div class="friend-avatar">${u.name[0]}</div><div><div class="friend-name">${escapeHtml(u.name)} <span style="font-size:.8rem;color:var(--text-secondary)">${u.age}, ${u.gender}</span></div><div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div></div></div>
    <div class="friend-actions">${dmBtn}</div></div>`;
}

document.getElementById('friendSearchBtn').addEventListener('click', renderFriendList);
document.getElementById('friendSearchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderFriendList(); });

// Friend Requests
document.getElementById('friendRequestsBtn').addEventListener('click', () => { showSubPage('tabFriendRequests'); renderFriendRequests(); });
document.getElementById('friendReqBack').addEventListener('click', () => { showSubPage('tabFriends'); renderFriendsPage(); });

function renderFriendRequests() {
  const el = document.getElementById('friendReqList');
  const reqs = [...receivedRequests];
  if (reqs.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128232;</div><div class="empty-state-text">받은 요청이 없습니다.</div></div>'; return; }
  el.innerHTML = reqs.map(uid => {
    const u = getUserById(uid);
    if (!u) return '';
    return `<div class="friend-item" data-uid="${u.id}">
      <div class="friend-info"><div class="friend-avatar">${u.name[0]}</div><div><div class="friend-name">${escapeHtml(u.name)} <span style="font-size:.8rem;color:var(--text-secondary)">${u.age}, ${u.gender}</span></div><div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div>
      <div style="margin-top:3px">${u.keywords.slice(0, 3).map(k => `<span class="preview-keyword" style="font-size:.7rem;padding:2px 6px">${k}</span>`).join(' ')}</div></div></div>
      <div class="friend-actions"><button class="btn-accept req-accept" data-uid="${u.id}">승낙</button><button class="btn-reject req-reject" data-uid="${u.id}">거절</button></div>
    </div>`;
  }).join('');
}

// School Friends
document.getElementById('goSchoolFriends').addEventListener('click', () => { showSubPage('tabSchoolFriends'); setupSchoolFriends(); });
document.getElementById('schoolFriendsBack').addEventListener('click', () => { showSubPage('tabFriends'); renderFriendsPage(); });

function setupSchoolFriends() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : currentUser.univ || '서강대';
  document.getElementById('schoolFriendsTitle').textContent = mySchool + ' 친구';
  const majors = MAJORS_BY_SCHOOL[mySchool] || [];
  document.getElementById('filterMajor').innerHTML = '<option value="">전체 전공</option>' + majors.map(m => `<option>${m}</option>`).join('');
  renderSchoolFriendList();
}

function renderSchoolFriendList() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : currentUser.univ || '서강대';
  const majorF = document.getElementById('filterMajor').value;
  const yearF = document.getElementById('filterYear').value;
  let users = ALL_USERS.filter(u => u.school === mySchool);
  if (majorF) users = users.filter(u => u.major === majorF);
  if (yearF) users = users.filter(u => u.year === yearF);
  const el = document.getElementById('schoolFriendList');
  if (users.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">조건에 맞는 친구가 없습니다.</div></div>'; return; }
  el.innerHTML = users.slice(0, 50).map(u => {
    const isM = matched.has(u.id), isSent = sentOK.has(u.id);
    let actions = '';
    if (isM) actions = '<span style="color:var(--primary);font-size:.8rem;font-weight:600">친구</span>';
    else if (isSent) actions = '<button class="btn btn-ghost btn-sm" disabled>OK 전송</button>';
    else actions = `<button class="btn btn-primary btn-sm school-ok" data-uid="${u.id}">OK</button>`;
    return `<div class="friend-item" data-uid="${u.id}">
      <div class="friend-info"><div class="friend-avatar">${u.name[0]}</div><div><div class="friend-name">${escapeHtml(u.name)} <span style="font-size:.8rem;color:var(--text-secondary)">${u.age}, ${u.gender}</span></div><div class="friend-detail">${u.major} · ${u.year}</div>
      <div style="margin-top:3px">${u.keywords.slice(0, 3).map(k => `<span class="preview-keyword" style="font-size:.7rem;padding:2px 6px">${k}</span>`).join(' ')}</div></div></div>
      <div class="friend-actions">${actions}</div></div>`;
  }).join('');
}

document.getElementById('filterMajor').addEventListener('change', renderSchoolFriendList);
document.getElementById('filterYear').addEventListener('change', renderSchoolFriendList);

// Select All OK
document.getElementById('selectAllSchool').addEventListener('click', () => {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : '서강대';
  const majorF = document.getElementById('filterMajor').value;
  const yearF = document.getElementById('filterYear').value;
  let users = ALL_USERS.filter(u => u.school === mySchool && !matched.has(u.id) && !sentOK.has(u.id));
  if (majorF) users = users.filter(u => u.major === majorF);
  if (yearF) users = users.filter(u => u.year === yearF);
  users.forEach(u => {
    sentOK.add(u.id);
    if (Math.random() < 0.25) { matched.add(u.id); sentOK.delete(u.id); }
  });
  const matchCount = users.filter(u => matched.has(u.id)).length;
  alert(`${users.length}명에게 OK를 보냈습니다! ${matchCount}명과 친구가 되었어요!`);
  renderSchoolFriendList();
});

// Recommend (Tinder Swipe) - on the right side of friends tab
let swipeQueue = [];
let swipeIndex = 0;

function setupSwipe() {
  const myKw = currentUser && currentUser.profile ? currentUser.profile.keywords : [];
  let candidates = ALL_USERS.filter(u => !matched.has(u.id) && !sentOK.has(u.id) && u.id !== (currentUser ? currentUser.id : -1));
  // Apply recommendation settings
  if (recSettings.school) candidates = candidates.filter(u => u.school === recSettings.school);
  if (recSettings.major) candidates = candidates.filter(u => u.major.includes(recSettings.major));
  if (recSettings.location) candidates = candidates.filter(u => u.location && u.location.includes(recSettings.location));
  if (recSettings.gender) candidates = candidates.filter(u => u.gender === recSettings.gender);
  if (recSettings.ageMin) candidates = candidates.filter(u => Number(u.age) >= Number(recSettings.ageMin));
  if (recSettings.ageMax) candidates = candidates.filter(u => Number(u.age) <= Number(recSettings.ageMax));
  if (recSettings.heightMin) candidates = candidates.filter(u => parseInt(u.height) >= Number(recSettings.heightMin));
  if (recSettings.heightMax) candidates = candidates.filter(u => parseInt(u.height) <= Number(recSettings.heightMax));
  // Sort by keyword overlap
  candidates.sort((a, b) => {
    const sa = a.keywords.filter(k => myKw.includes(k)).length;
    const sb = b.keywords.filter(k => myKw.includes(k)).length;
    return sb - sa;
  });
  swipeQueue = candidates.slice(0, 100);
  swipeIndex = 0;
}

function renderSwipeCard() {
  setupSwipe();
  const el = document.getElementById('swipeContainer');
  if (swipeIndex >= swipeQueue.length) {
    el.innerHTML = '<div class="swipe-empty"><div style="font-size:3rem;margin-bottom:12px">&#128149;</div>더 이상 추천 친구가 없습니다.<br>나중에 다시 확인해보세요!</div>';
    return;
  }
  showCurrentSwipe();
}

function showCurrentSwipe() {
  const el = document.getElementById('swipeContainer');
  if (swipeIndex >= swipeQueue.length) {
    el.innerHTML = '<div class="swipe-empty"><div style="font-size:3rem;margin-bottom:12px">&#128149;</div>더 이상 추천 친구가 없습니다.</div>';
    return;
  }
  const u = swipeQueue[swipeIndex];
  const instaHtml = u.insta && u.showInsta ? `<div class="swipe-card-insta"><a href="https://instagram.com/${encodeURIComponent(u.insta.replace('@',''))}" target="_blank">@${escapeHtml(u.insta.replace('@',''))}</a></div>` : '';
  el.innerHTML = `
    <div class="swipe-card">
      <div class="swipe-card-photo">${u.name[0]}</div>
      <div class="swipe-card-body">
        <div class="swipe-card-name">${escapeHtml(u.name)} <span style="color:var(--text-secondary);font-size:.9rem">${u.age}, ${u.gender}</span></div>
        <div class="swipe-card-info">${u.school} · ${u.major} · ${u.year}</div>
        <div class="swipe-card-bio">${escapeHtml(u.bio)}</div>
        <div class="swipe-card-keywords">${u.keywords.map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>
        ${u.showHeight ? `<div style="font-size:.85rem;color:var(--text-secondary);margin-top:6px">${u.height}</div>` : ''}
        ${instaHtml}
      </div>
    </div>
    <div class="swipe-actions">
      <button class="swipe-btn no" id="swipeNo" title="NO">&#10007;</button>
      <button class="swipe-btn yes" id="swipeOk" title="OK">&#9829;</button>
    </div>`;
  document.getElementById('swipeNo').addEventListener('click', () => { swipeIndex++; showCurrentSwipe(); });
  document.getElementById('swipeOk').addEventListener('click', () => {
    const uid = swipeQueue[swipeIndex].id;
    sentOK.add(uid);
    if (Math.random() < 0.3) { matched.add(uid); sentOK.delete(uid); alert(swipeQueue[swipeIndex].name + '님도 OK! 친구가 되었어요!'); renderFriendList(); }
    swipeIndex++; showCurrentSwipe();
  });
}

// Recommendation Settings
document.getElementById('recommendSettingsBtn').addEventListener('click', () => {
  showSubPage('tabRecommendSettings');
  document.getElementById('recLocation').value = recSettings.location;
  document.getElementById('recSchool').value = recSettings.school;
  document.getElementById('recMajor').value = recSettings.major;
  document.getElementById('recAgeMin').value = recSettings.ageMin;
  document.getElementById('recAgeMax').value = recSettings.ageMax;
  document.getElementById('recGender').value = recSettings.gender;
  document.getElementById('recHeightMin').value = recSettings.heightMin;
  document.getElementById('recHeightMax').value = recSettings.heightMax;
});
document.getElementById('recSettingsBack').addEventListener('click', () => { showSubPage('tabFriends'); renderFriendsPage(); });
document.getElementById('recSettingsReset').addEventListener('click', () => {
  recSettings = { location: '', school: '', major: '', ageMin: '', ageMax: '', gender: '', heightMin: '', heightMax: '' };
  ['recLocation','recSchool','recMajor','recAgeMin','recAgeMax','recGender','recHeightMin','recHeightMax'].forEach(id => document.getElementById(id).value = '');
});
document.getElementById('recSettingsApply').addEventListener('click', () => {
  recSettings = {
    location: document.getElementById('recLocation').value.trim(),
    school: document.getElementById('recSchool').value,
    major: document.getElementById('recMajor').value.trim(),
    ageMin: document.getElementById('recAgeMin').value,
    ageMax: document.getElementById('recAgeMax').value,
    gender: document.getElementById('recGender').value,
    heightMin: document.getElementById('recHeightMin').value,
    heightMax: document.getElementById('recHeightMax').value,
  };
  alert('추천 설정이 적용되었습니다!');
  showSubPage('tabFriends');
  renderFriendsPage();
});

// Delegated click handlers
document.addEventListener('click', (e) => {
  // School OK
  if (e.target.classList.contains('school-ok')) {
    const uid = Number(e.target.dataset.uid);
    sentOK.add(uid);
    if (Math.random() < 0.25) { matched.add(uid); sentOK.delete(uid); const u = getUserById(uid); alert((u ? u.name : '') + '님도 OK! 친구가 되었어요!'); }
    renderSchoolFriendList();
  }
  // Friend request accept/reject
  if (e.target.classList.contains('req-accept')) { const uid = Number(e.target.dataset.uid); receivedRequests.delete(uid); matched.add(uid); const u = getUserById(uid); alert((u ? u.name : '') + '님과 친구가 되었습니다!'); renderFriendRequests(); }
  if (e.target.classList.contains('req-reject')) { receivedRequests.delete(Number(e.target.dataset.uid)); renderFriendRequests(); }
  // DM button
  if (e.target.classList.contains('friend-dm-btn')) { e.stopPropagation(); openDmChat(Number(e.target.dataset.uid)); return; }
  // Friend item click → profile
  const fi = e.target.closest('.friend-item');
  if (fi && !e.target.closest('.friend-actions') && fi.dataset.uid) openUserProfile(Number(fi.dataset.uid));
  // Gather accept/reject
  if (e.target.classList.contains('gather-accept')) {
    const g = gatherings.find(x => x.id === Number(e.target.dataset.gid));
    if (g) { const uid = Number(e.target.dataset.uid); g.applicants = g.applicants.filter(a => a.uid !== uid); g.members.push(uid); openGatherDetail(g.id); }
  }
  if (e.target.classList.contains('gather-reject')) {
    const g = gatherings.find(x => x.id === Number(e.target.dataset.gid));
    if (g) { g.applicants = g.applicants.filter(a => a.uid !== Number(e.target.dataset.uid)); openGatherDetail(g.id); }
  }
});

// User Profile Modal
function openUserProfile(uid) {
  const u = getUserById(uid);
  if (!u) return;
  // Photo slider
  renderPhotoSlider(document.getElementById('userProfilePhotos'), u.photos || [], 0);
  // Card
  let instaHtml = '';
  if (u.insta && u.showInsta) instaHtml = `<div style="margin-top:10px"><a href="https://instagram.com/${encodeURIComponent(u.insta.replace('@',''))}" target="_blank" style="color:var(--primary);font-weight:600">@${escapeHtml(u.insta.replace('@',''))}</a></div>`;
  document.getElementById('userProfileCard').innerHTML = `
    <div class="preview-photo"><span class="photo-placeholder">${u.name[0]}</span></div>
    <h3 class="preview-name">${escapeHtml(u.name)} <span style="font-size:.9rem;color:var(--text-secondary)">${u.age}, ${u.gender}</span></h3>
    <p class="preview-school">${u.school} / ${u.major} / ${u.year}</p>
    <p class="preview-bio">${escapeHtml(u.bio)}</p>
    <div class="preview-keywords">${u.keywords.map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>
    <div class="preview-extra">
      ${u.showHeight ? `<span class="preview-extra-item">${u.height}</span>` : ''}
      ${u.showLocation ? `<span class="preview-extra-item">${escapeHtml(u.location)}</span>` : ''}
    </div>
    ${instaHtml}`;
  const isF = matched.has(uid), isSent = sentOK.has(uid);
  let actHtml = '';
  if (isF) actHtml = `<button class="btn btn-ghost" onclick="document.getElementById('userProfileModal').classList.remove('active')">닫기</button><button class="friend-dm-btn" data-uid="${uid}" style="width:auto;height:auto;padding:8px 16px;border-radius:10px">메시지</button>`;
  else if (isSent) actHtml = '<button class="btn btn-ghost" disabled>OK 전송됨</button>';
  else actHtml = `<button class="btn btn-primary school-ok" data-uid="${uid}">OK</button><button class="btn btn-ghost" onclick="document.getElementById('userProfileModal').classList.remove('active')">NO</button>`;
  document.getElementById('userProfileActions').innerHTML = actHtml;
  document.getElementById('userProfileModal').classList.add('active');
}
document.getElementById('userProfileClose').addEventListener('click', () => document.getElementById('userProfileModal').classList.remove('active'));

// ===== DM CHAT =====
function openDmChat(friendId) {
  document.getElementById('userProfileModal').classList.remove('active');
  switchTab('chat');
  currentChatType = 'dm';
  currentChatId = friendId;
  const u = getUserById(friendId);
  document.getElementById('chatListView').classList.add('hidden');
  document.getElementById('chatRoomView').classList.remove('hidden');
  document.getElementById('chatRoomName').textContent = u ? u.name : '채팅';
  document.getElementById('chatMemberCount').textContent = '';
  if (!dmChats[friendId]) dmChats[friendId] = [];
  renderDmMsgs(friendId);
}

function renderDmMsgs(friendId) {
  const msgs = dmChats[friendId] || [];
  const el = document.getElementById('chatMessages');
  if (msgs.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">첫 메시지를 보내보세요!</div></div>'; return; }
  el.innerHTML = msgs.map(m => {
    const mine = m.author === (currentUser ? currentUser.id : -1);
    const authorName = mine ? '나' : (getUserById(m.author)?.name || '');
    return `<div class="chat-msg ${mine ? 'mine' : 'other'}">${!mine ? `<div class="chat-msg-author">${escapeHtml(authorName)}</div>` : ''}<div class="chat-msg-bubble">${escapeHtml(m.text)}</div><div class="chat-msg-time">${formatDate(m.date)}</div></div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

// ===== GATHERING SYSTEM =====
const GATHER_CATS = { study:'스터디', hobby:'취미', food:'맛집탐방', exercise:'운동', travel:'여행', project:'프로젝트', etc:'기타' };
const GATHER_EMOJIS = { study:'📚', hobby:'🎨', food:'🍽️', exercise:'💪', travel:'✈️', project:'💻', etc:'✨' };

let gatherings = [
  { id:1, title:'알고리즘 스터디', category:'study', purpose:'코딩 실력 향상', desc:'매주 토요일 백준 문제 풀기. 초보 환영.', condition:'프로그래밍 기초 가능자', question:'주로 사용하는 언어가 무엇인가요?', maxMembers:10, deadline:'2026-04-01', hostId:ALL_USERS[10].id, members:[ALL_USERS[10].id, ALL_USERS[11].id, ALL_USERS[12].id], applicants:[], chatMessages:[{author:ALL_USERS[10].id, text:'이번주 문제 올렸어요!', date:new Date(Date.now()-3600000)}, {author:ALL_USERS[11].id, text:'넵 확인했습니다!', date:new Date(Date.now()-1800000)}], isClosed:false, createdAt:new Date(Date.now()-86400000*3) },
  { id:2, title:'맛집 탐방 모임', category:'food', purpose:'학교 근처 맛집 개척', desc:'매주 금요일 저녁 맛집 탐방. 사진 찍고 리뷰 남기기!', condition:'먹는 거 좋아하는 사람', question:'좋아하는 음식 장르는?', maxMembers:8, deadline:'2026-03-30', hostId:ALL_USERS[30].id, members:[ALL_USERS[30].id, ALL_USERS[31].id], applicants:[], chatMessages:[{author:ALL_USERS[30].id, text:'이번주 금요일 홍대 맛집 가요!', date:new Date(Date.now()-7200000)}], isClosed:false, createdAt:new Date(Date.now()-86400000) },
  { id:3, title:'주말 등산 번개', category:'exercise', purpose:'건강한 주말', desc:'이번 주말 북한산 등산! 도시락 가져오세요.', condition:'체력 상관없이 누구나', question:'등산 경험이 있으신가요?', maxMembers:5, deadline:'2026-03-15', hostId:ALL_USERS[50].id, members:[ALL_USERS[50].id, ALL_USERS[51].id], applicants:[], chatMessages:[], isClosed:false, createdAt:new Date(Date.now()-86400000*0.5) },
  { id:4, title:'영어 회화 스터디', category:'study', purpose:'영어 실력 향상', desc:'매주 수요일 저녁 영어 프리토킹. 레벨 무관.', condition:'영어에 관심 있는 누구나', question:'현재 영어 실력은 어느 정도인가요?', maxMembers:6, deadline:'2026-04-15', hostId:ALL_USERS[100].id, members:[ALL_USERS[100].id, ALL_USERS[101].id, ALL_USERS[102].id], applicants:[], chatMessages:[{author:ALL_USERS[100].id, text:'다음주 주제는 여행입니다!', date:new Date(Date.now()-5400000)}], isClosed:false, createdAt:new Date(Date.now()-86400000*2) },
  { id:5, title:'사진 동아리 모집', category:'hobby', purpose:'사진 찍고 공유하기', desc:'주말마다 출사 나가요! DSLR, 미러리스, 폰카 모두 환영.', condition:'카메라 있는 분', question:'주로 어떤 사진을 찍나요?', maxMembers:12, deadline:'2026-04-20', hostId:ALL_USERS[200].id, members:[ALL_USERS[200].id, ALL_USERS[201].id, ALL_USERS[202].id, ALL_USERS[203].id], applicants:[], chatMessages:[{author:ALL_USERS[200].id, text:'이번 주말 경복궁 출사 갈 사람~', date:new Date(Date.now()-1200000)}, {author:ALL_USERS[201].id, text:'저요! 몇시에 만나요?', date:new Date(Date.now()-600000)}], isClosed:false, createdAt:new Date(Date.now()-86400000*5) },
];

function generatePromo(g) {
  const e = GATHER_EMOJIS[g.category] || '✨';
  return `${e} [${GATHER_CATS[g.category]}] ${g.title}\n\n📌 목적: ${g.purpose}\n\n${g.desc}\n\n✅ 가입 조건: ${g.condition}\n👥 모집 인원: ${g.maxMembers}명\n📅 모집 마감: ${g.deadline || '미정'}\n\n🔥 관심 있으신 분은 가입 신청해주세요!\n※ 승인제로 운영됩니다.`;
}

function renderGatherings() {
  const el = document.getElementById('gatherList');
  const q = (document.getElementById('gatherSearch').value || '').trim().toLowerCase();
  let list = gatherings;
  if (q) list = list.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
  if (list.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><div class="empty-state-text">모임이 없습니다.</div></div>'; return; }
  el.innerHTML = list.map(g => `
    <div class="gather-card" data-gid="${g.id}">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="gather-card-cat">${GATHER_EMOJIS[g.category] || '✨'} ${GATHER_CATS[g.category]}</span><span class="gather-card-status ${g.isClosed ? 'closed' : 'open'}">${g.isClosed ? '마감' : '모집중'}</span></div>
      <div class="gather-card-title">${escapeHtml(g.title)}</div>
      <div class="gather-card-desc">${escapeHtml(g.purpose)}</div>
      <div class="gather-card-footer"><span>익명 · ${formatDate(g.createdAt)}</span><span class="gather-card-members">${g.members.length}/${g.maxMembers}명</span></div>
    </div>`).join('');
}

document.getElementById('gatherList').addEventListener('click', (e) => { const c = e.target.closest('.gather-card'); if (c) openGatherDetail(Number(c.dataset.gid)); });
document.getElementById('gatherSearchBtn').addEventListener('click', renderGatherings);
document.getElementById('gatherSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderGatherings(); });

function openGatherDetail(gid) {
  const g = gatherings.find(x => x.id === gid);
  if (!g) return;
  showSubPage('tabGatherDetail');
  document.getElementById('gatherDetailTitle').textContent = g.title;
  const isHost = currentUser && currentUser.id === g.hostId;
  const isMember = currentUser && g.members.includes(currentUser.id);
  const hasApplied = currentUser && g.applicants.some(a => a.uid === currentUser.id);

  let html = `<div class="gather-detail-section"><div class="gather-promo">${escapeHtml(generatePromo(g))}</div></div>`;

  if (isMember) {
    html += `<div class="gather-detail-section"><h3>멤버 (${g.members.length}/${g.maxMembers})</h3>` +
      g.members.map(uid => { const u = getUserById(uid); return u ? `<span class="preview-keyword" style="margin:2px">${escapeHtml(u.name)}</span>` : ''; }).join('') + '</div>';
  }

  if (isHost && g.applicants.length > 0) {
    html += `<div class="gather-detail-section"><h3>가입 신청 (${g.applicants.length}명)</h3>` +
      g.applicants.map(a => {
        const u = getUserById(a.uid);
        if (!u) return '';
        return `<div class="applicant-item">
          <div class="applicant-info"><strong>${escapeHtml(u.name)}</strong> (${u.school} · ${u.major} · ${u.year})
          <div style="font-size:.75rem;color:var(--text-secondary)">${u.keywords.slice(0,4).join(', ')}</div>
          <div class="applicant-answer">답변: "${escapeHtml(a.answer)}"</div></div>
          <div class="friend-actions"><button class="btn-accept gather-accept" data-gid="${g.id}" data-uid="${a.uid}">승낙</button><button class="btn-reject gather-reject" data-gid="${g.id}" data-uid="${a.uid}">거절</button></div>
        </div>`;
      }).join('') + '</div>';
  }

  html += '<div style="display:flex;gap:8px;margin-top:16px">';
  if (isMember) {
    html += `<button class="btn btn-primary" id="enterGatherChat" data-gid="${g.id}">채팅방 입장</button>`;
    if (isHost && !g.isClosed) html += `<button class="btn btn-danger" id="closeGather" data-gid="${g.id}">모집 마감</button>`;
  } else if (hasApplied) {
    html += '<button class="btn btn-ghost" disabled>신청 대기 중</button>';
  } else if (g.isClosed) {
    html += '<button class="btn btn-ghost" disabled>모집 마감</button>';
  } else {
    html += `<button class="btn btn-primary" id="applyGather" data-gid="${g.id}">가입 신청</button>`;
  }
  html += '</div>';

  document.getElementById('gatherDetailContent').innerHTML = html;

  const enterBtn = document.getElementById('enterGatherChat');
  if (enterBtn) enterBtn.addEventListener('click', () => { openGroupChat(g.id); });
  const applyBtn = document.getElementById('applyGather');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    document.getElementById('gatherApplyQuestion').textContent = g.question || '지원 동기를 알려주세요.';
    document.getElementById('gatherApplyAnswer').value = '';
    document.getElementById('gatherApplyModal').classList.add('active');
    document.getElementById('gatherApplyModal').dataset.gid = g.id;
  });
  const closeBtn = document.getElementById('closeGather');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    if (confirm('모집을 마감하시겠습니까?')) { g.isClosed = true; alert('모집이 마감되었습니다!'); openGatherDetail(g.id); }
  });
}

document.getElementById('gatherDetailBack').addEventListener('click', () => { showSubPage('tabGather'); renderGatherings(); });

// Apply modal
document.getElementById('gatherApplyClose').addEventListener('click', () => document.getElementById('gatherApplyModal').classList.remove('active'));
document.getElementById('gatherApplyCancelBtn').addEventListener('click', () => document.getElementById('gatherApplyModal').classList.remove('active'));
document.getElementById('gatherApplySubmitBtn').addEventListener('click', () => {
  const gid = Number(document.getElementById('gatherApplyModal').dataset.gid);
  const answer = document.getElementById('gatherApplyAnswer').value.trim();
  if (!answer) { alert('답변을 입력해주세요.'); return; }
  const g = gatherings.find(x => x.id === gid);
  if (g && currentUser) { g.applicants.push({ uid: currentUser.id, answer, date: new Date() }); }
  document.getElementById('gatherApplyModal').classList.remove('active');
  alert('가입 신청이 전송되었습니다!');
  openGatherDetail(gid);
});

// Create Gathering
document.getElementById('createGatherBtn').addEventListener('click', () => showSubPage('tabCreateGather'));
document.getElementById('createGatherBack').addEventListener('click', () => { showSubPage('tabGather'); renderGatherings(); });
document.getElementById('gatherSubmitBtn').addEventListener('click', () => {
  const title = document.getElementById('gatherTitle').value.trim();
  const category = document.getElementById('gatherCategory').value;
  const purpose = document.getElementById('gatherPurpose').value.trim();
  const desc = document.getElementById('gatherDesc').value.trim();
  const condition = document.getElementById('gatherCondition').value.trim();
  const question = document.getElementById('gatherQuestion').value.trim();
  const maxMembers = Number(document.getElementById('gatherMax').value);
  const deadline = document.getElementById('gatherDeadline').value;
  if (!title || !purpose || !desc) { alert('모임 이름, 목적, 설명을 입력해주세요.'); return; }
  gatherings.unshift({
    id: Date.now(), title, category, purpose, desc, condition: condition || '없음', question: question || '지원 동기를 알려주세요.',
    maxMembers, deadline, hostId: currentUser.id, members: [currentUser.id], applicants: [], chatMessages: [], isClosed: false, createdAt: new Date(),
  });
  ['gatherTitle','gatherPurpose','gatherDesc','gatherCondition','gatherQuestion'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  alert('모임이 개설되었습니다! AI가 홍보글을 생성했어요.');
  showSubPage('tabGather'); renderGatherings();
});

// ===== CHAT =====
let currentChatType = null; // 'group' or 'dm'
let currentChatId = null;
let chatTabFilter = 'group';

function renderChatRooms() {
  document.getElementById('chatListView').classList.remove('hidden');
  document.getElementById('chatRoomView').classList.add('hidden');
  currentChatType = null;
  currentChatId = null;

  // Set active tab
  document.querySelectorAll('[data-ctab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ctab === chatTabFilter);
  });

  const el = document.getElementById('chatRoomList');
  if (chatTabFilter === 'group') {
    const myRooms = gatherings.filter(g => currentUser && g.members.includes(currentUser.id));
    if (myRooms.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><div class="empty-state-text">참여 중인 모임 채팅이 없습니다.</div></div>'; return; }
    el.innerHTML = myRooms.map(g => {
      const last = g.chatMessages.length > 0 ? g.chatMessages[g.chatMessages.length - 1] : null;
      const lastAuthor = last ? getUserById(last.author) : null;
      return `<div class="chat-room-item" data-type="group" data-gid="${g.id}"><div class="chat-room-info"><div class="chat-room-icon">${GATHER_EMOJIS[g.category] || '💬'}</div><div><div class="chat-room-name">${escapeHtml(g.title)}</div><div class="chat-room-last">${last ? (lastAuthor ? lastAuthor.name + ': ' : '') + escapeHtml(last.text).substring(0, 25) : '메시지 없음'}</div></div></div>
      <div class="chat-room-meta"><div class="chat-room-time">${last ? formatDate(last.date) : ''}</div><div style="font-size:.75rem;color:var(--text-secondary)">${g.members.length}명</div></div></div>`;
    }).join('');
  } else {
    // DM list
    const dmFriends = [...matched].filter(fid => dmChats[fid] && dmChats[fid].length > 0);
    // Also show all friends even without messages
    const allFriends = [...matched];
    if (allFriends.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128172;</div><div class="empty-state-text">친구를 추가하면 개인 채팅을 할 수 있습니다.</div></div>'; return; }
    // Sort: those with messages first
    allFriends.sort((a, b) => {
      const aLast = dmChats[a] && dmChats[a].length > 0 ? dmChats[a][dmChats[a].length - 1].date : 0;
      const bLast = dmChats[b] && dmChats[b].length > 0 ? dmChats[b][dmChats[b].length - 1].date : 0;
      return bLast - aLast;
    });
    el.innerHTML = allFriends.map(fid => {
      const u = getUserById(fid);
      if (!u) return '';
      const msgs = dmChats[fid] || [];
      const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      return `<div class="chat-room-item" data-type="dm" data-uid="${fid}"><div class="chat-room-info"><div class="chat-room-icon dm">${u.name[0]}</div><div><div class="chat-room-name">${escapeHtml(u.name)}</div><div class="chat-room-last">${last ? escapeHtml(last.text).substring(0, 25) : '대화를 시작하세요'}</div></div></div>
      <div class="chat-room-meta"><div class="chat-room-time">${last ? formatDate(last.date) : ''}</div></div></div>`;
    }).join('');
  }
}

// Chat tab buttons
document.querySelectorAll('[data-ctab]').forEach(btn => {
  btn.addEventListener('click', () => { chatTabFilter = btn.dataset.ctab; renderChatRooms(); });
});

document.getElementById('chatRoomList').addEventListener('click', (e) => {
  const item = e.target.closest('.chat-room-item');
  if (!item) return;
  if (item.dataset.type === 'group') openGroupChat(Number(item.dataset.gid));
  else if (item.dataset.type === 'dm') openDmChat(Number(item.dataset.uid));
});

function openGroupChat(gid) {
  const g = gatherings.find(x => x.id === gid);
  if (!g) return;
  // Make sure we're on chat tab
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('tabChat').classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const chatLink = document.querySelector('.nav-link[data-tab="chat"]');
  if (chatLink) chatLink.classList.add('active');

  currentChatType = 'group';
  currentChatId = gid;
  document.getElementById('chatListView').classList.add('hidden');
  document.getElementById('chatRoomView').classList.remove('hidden');
  document.getElementById('chatRoomName').textContent = g.title;
  document.getElementById('chatMemberCount').textContent = g.members.length + '명';
  renderGroupMsgs(g);
}

function renderGroupMsgs(g) {
  const el = document.getElementById('chatMessages');
  if (g.chatMessages.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">첫 메시지를 보내보세요!</div></div>'; return; }
  el.innerHTML = g.chatMessages.map(m => {
    const mine = currentUser && m.author === currentUser.id;
    const u = getUserById(m.author);
    return `<div class="chat-msg ${mine ? 'mine' : 'other'}">${!mine ? `<div class="chat-msg-author">${u ? escapeHtml(u.name) : '알 수 없음'}</div>` : ''}<div class="chat-msg-bubble">${escapeHtml(m.text)}</div><div class="chat-msg-time">${formatDate(m.date)}</div></div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatType) return;
  input.value = '';

  if (currentChatType === 'group') {
    const g = gatherings.find(x => x.id === currentChatId);
    if (!g) return;
    g.chatMessages.push({ author: currentUser.id, text, date: new Date() });
    renderGroupMsgs(g);
    // Auto reply
    setTimeout(() => {
      const others = g.members.filter(m => m !== currentUser.id);
      if (others.length > 0) {
        const responder = others[Math.floor(Math.random() * others.length)];
        g.chatMessages.push({ author: responder, text: ['ㅋㅋ 좋아요!','넵!','저도요~','오 그거 좋네요','언제 만나요?','좋은 생각이에요!','동의합니다~'][Math.floor(Math.random() * 7)], date: new Date() });
        if (currentChatType === 'group' && currentChatId === g.id) renderGroupMsgs(g);
      }
    }, 1500 + Math.random() * 2000);
  } else if (currentChatType === 'dm') {
    const fid = currentChatId;
    if (!dmChats[fid]) dmChats[fid] = [];
    dmChats[fid].push({ author: currentUser.id, text, date: new Date() });
    renderDmMsgs(fid);
    // Auto reply
    setTimeout(() => {
      dmChats[fid].push({ author: fid, text: ['안녕하세요!','ㅋㅋ','오 반가워요!','넵 좋아요!','그렇군요~','나중에 만나요!','좋은 하루 되세요!'][Math.floor(Math.random() * 7)], date: new Date() });
      if (currentChatType === 'dm' && currentChatId === fid) renderDmMsgs(fid);
    }, 1500 + Math.random() * 2000);
  }
}

document.getElementById('chatSendBtn').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
document.getElementById('chatBackBtn').addEventListener('click', () => { currentChatType = null; currentChatId = null; renderChatRooms(); });

// ===== BOARD (School-specific) =====
const CAT_LABELS = { free:'자유게시판', question:'질문답변', info:'정보공유', review:'대학생활' };

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
      allPosts.push({
        id: pid++, school, category: cats[i % 4], title, content: title + ' 관련 내용입니다.\n\n자세한 내용은 댓글로 남겨주세요!',
        authorId: author.id, authorName: author.name, date: d, views: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 50), comments: []
      });
    });
  });
  return allPosts;
}

let posts = generatePosts();
let currentSort = 'latest', currentPage = 1, currentPostId = null;
let boardSchool = '';
const writeModal = document.getElementById('writeModal'), detailModal = document.getElementById('detailModal');

function initBoard() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : '서강대';
  const sel = document.getElementById('boardSchoolFilter');
  if (!boardSchool) {
    boardSchool = mySchool;
    sel.value = mySchool;
  }
  // Can only write to own school
  const writeBtn = document.getElementById('writeBtn');
  writeBtn.style.display = (boardSchool === mySchool) ? '' : 'none';
}

document.getElementById('boardSchoolFilter').addEventListener('change', (e) => {
  boardSchool = e.target.value;
  currentPage = 1;
  initBoard();
  renderPosts();
});

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
document.getElementById('commentBtn').addEventListener('click', () => {
  const t = document.getElementById('commentInput').value.trim(); if (!t) return;
  const p = posts.find(x => x.id === currentPostId);
  if (p) {
    p.comments.push({ authorName: currentUser.profile ? currentUser.profile.name : '익명', text: t });
    document.getElementById('commentInput').value = '';
    renderComments(p);
  }
});

// Close modals
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('active'); }));
