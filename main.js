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
const ALL_KEYWORDS = ['운동','독서','게임','음악','영화','여행','사진','요리','그림','댄스','등산','캠핑','한식','일식','중식','양식','카페','디저트','매운음식','치킨','피자','분식','활발한','조용한','유머러스','다정한','지적인','감성적','모험적','계획적'];
const FIRST_NAMES = ['민준','서준','예준','도윤','시우','하준','주원','지호','지후','준서','현우','도현','수호','지훈','서연','서윤','지우','서현','하은','하윤','민서','지유','윤서','채원','수빈','지민','예은','소율','다은','하린'];
const LAST_NAMES = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','전'];
const BIOS = [
  '대학생활 열심히 하는 중!','맛집 탐방이 취미예요','운동 같이 할 사람 구해요','카페에서 공부하는 걸 좋아해요',
  '코딩하면서 밤새는 사람','영화 보는 게 제일 좋아요','여행 계획 세우는 중!','음악 없이 못 살아요',
  '게임 같이 할 친구 구함','독서 모임 관심 있어요','사진 찍는 거 좋아해요','요리 배우고 싶어요',
  '등산 초보인데 같이 가요','캠핑 러버입니다','그림 그리는 걸 좋아해요','댄스 동아리 소속이에요',
  '스터디 같이 해요!','자취 생활 꿀팁 공유','동아리 활동 열심히 하는 중','취업 준비 화이팅!',
];

function generateUsers() {
  const users = [];
  let id = 1;
  SCHOOLS.forEach(school => {
    const majors = MAJORS_BY_SCHOOL[school];
    for (let i = 0; i < 100; i++) {
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const name = lastName + firstName;
      const major = majors[Math.floor(Math.random() * majors.length)];
      const year = YEARS[Math.floor(Math.random() * YEARS.length)];
      const age = String(19 + Math.floor(Math.random() * 8));
      const kw = [...ALL_KEYWORDS].sort(() => .5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 4));
      const nick = name + String(id).padStart(3, '0');
      users.push({
        id: id++, nick, name, email: nick.toLowerCase() + '@' + school.replace(/[^a-z]/gi, '') + '.ac.kr',
        school, major, year, age, bio: BIOS[Math.floor(Math.random() * BIOS.length)],
        keywords: kw, photo: null,
      });
    }
  });
  return users;
}

const ALL_USERS = generateUsers();
function getUserInfo(nick) { return ALL_USERS.find(u => u.nick === nick) || { nick, school: '', major: '', year: '', age: '', bio: '', keywords: [] }; }
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
  currentUser = { nick: email.split('@')[0], email, univ: '서강대' };
  currentUser.profile = { name: currentUser.nick, school: '서강대', major: '컴퓨터공학', year: '3학년', age: '23', bio: '', keywords: ['게임','음악','카페'], photo: null };
  enterApp();
});

document.getElementById('signupBtn').addEventListener('click', () => {
  const nick = document.getElementById('signupNick').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const univ = document.getElementById('signupUniv').value;
  const pw = document.getElementById('signupPassword').value.trim();
  const pwc = document.getElementById('signupPasswordConfirm').value.trim();
  if (!nick || !email || !univ || !pw) { alert('모든 항목을 입력해주세요.'); return; }
  if (pw.length < 8) { alert('비밀번호는 8자 이상이어야 합니다.'); return; }
  if (pw !== pwc) { alert('비밀번호가 일치하지 않습니다.'); return; }
  currentUser = { nick, email, univ };
  enterProfile(false);
});

document.getElementById('googleLoginBtn').addEventListener('click', () => {
  currentUser = { nick: '구글유저', email: 'user@gmail.com', univ: '서강대' };
  currentUser.profile = { name: '구글유저', school: '서강대', major: '경영학', year: '2학년', age: '22', bio: '', keywords: ['카페','영화'], photo: null };
  enterApp();
});

function enterProfile(isEdit) {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('profilePage').classList.remove('hidden');
  document.getElementById('profilePageTitle').textContent = isEdit ? '프로필 수정' : '프로필을 완성해주세요';
  if (currentUser.univ) document.getElementById('profSchool').value = currentUser.univ;
  if (isEdit && currentUser.profile) {
    const p = currentUser.profile;
    document.getElementById('profName').value = p.name || '';
    document.getElementById('profAge').value = p.age || '';
    document.getElementById('profSchool').value = p.school || '';
    document.getElementById('profMajor').value = p.major || '';
    document.getElementById('profYear').value = p.year || '';
    document.getElementById('profBio').value = p.bio || '';
    document.getElementById('bioCount').textContent = (p.bio || '').length;
    document.getElementById('profHeight').value = p.height || '';
    document.getElementById('profLocation').value = p.location || '';
    document.getElementById('profInsta').value = p.insta || '';
  }
  showStep(1);
}

function enterApp() {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('userName').textContent = currentUser.nick;
  switchTab('friends');
}

// ===== PROFILE SETUP =====
let selectedKeywords = [];
let profilePhoto = null;

document.getElementById('photoBtn').addEventListener('click', () => document.getElementById('photoInput').click());
document.getElementById('photoPreview').addEventListener('click', () => document.getElementById('photoInput').click());
document.getElementById('photoInput').addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { profilePhoto = ev.target.result; document.getElementById('photoPreview').innerHTML = `<img src="${profilePhoto}" />`; };
  reader.readAsDataURL(file);
});
document.getElementById('profBio').addEventListener('input', (e) => { document.getElementById('bioCount').textContent = e.target.value.length; });

function showStep(n) {
  document.querySelectorAll('.profile-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + n).classList.remove('hidden');
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.step[data-step="${n}"]`).classList.add('active');
}

document.getElementById('toStep2').addEventListener('click', () => {
  if (!document.getElementById('profName').value.trim() || !document.getElementById('profAge').value || !document.getElementById('profMajor').value.trim() || !document.getElementById('profYear').value) { alert('모든 기본 정보를 입력해주세요.'); return; }
  showStep(2);
});
document.getElementById('backStep1').addEventListener('click', () => showStep(1));
document.getElementById('toStep3').addEventListener('click', () => showStep(3));
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
    b = document.getElementById('profBio').value.trim(), h = document.getElementById('profHeight').value.trim(),
    l = document.getElementById('profLocation').value.trim(), ig = document.getElementById('profInsta').value.trim();
  document.getElementById('previewName').textContent = n + ' (' + a + ')';
  document.getElementById('previewSchool').textContent = s + ' / ' + mj + ' / ' + y;
  document.getElementById('previewBio').textContent = b || '자기소개가 없습니다.';
  document.getElementById('previewPhoto').innerHTML = profilePhoto ? `<img src="${profilePhoto}" />` : '<span class="photo-placeholder">?</span>';
  document.getElementById('previewKeywords').innerHTML = selectedKeywords.map(k => `<span class="preview-keyword">${k}</span>`).join('');
  let ext = '';
  if (h && document.getElementById('toggleHeight').checked) ext += `<span class="preview-extra-item">${h}</span>`;
  if (l && document.getElementById('toggleLocation').checked) ext += `<span class="preview-extra-item">${l}</span>`;
  if (ig && document.getElementById('toggleInsta').checked) ext += `<span class="preview-extra-item">${ig}</span>`;
  document.getElementById('previewExtra').innerHTML = ext;
}

document.getElementById('profileComplete').addEventListener('click', () => {
  currentUser.profile = {
    name: document.getElementById('profName').value.trim(), age: document.getElementById('profAge').value,
    school: document.getElementById('profSchool').value.trim(), major: document.getElementById('profMajor').value.trim(),
    year: document.getElementById('profYear').value, bio: document.getElementById('profBio').value.trim(),
    keywords: [...selectedKeywords], height: document.getElementById('profHeight').value.trim(),
    location: document.getElementById('profLocation').value.trim(), insta: document.getElementById('profInsta').value.trim(),
    showHeight: document.getElementById('toggleHeight').checked, showLocation: document.getElementById('toggleLocation').checked,
    showInsta: document.getElementById('toggleInsta').checked, photo: profilePhoto,
  };
  currentUser.univ = currentUser.profile.school;
  enterApp();
});

document.getElementById('logoutBtn').addEventListener('click', () => { currentUser = null; document.getElementById('app').classList.add('hidden'); document.getElementById('authPage').classList.remove('hidden'); document.getElementById('authPage').style.opacity = '1'; });
document.getElementById('myProfileBtn').addEventListener('click', () => enterProfile(true));

// ===== TAB NAVIGATION =====
let currentTab = 'friends';
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.nav-link[data-tab="${tab}"]`);
  if (link) link.classList.add('active');
  if (tab === 'friends') { document.getElementById('tabFriends').classList.remove('hidden'); renderMyFriends(); }
  else if (tab === 'gather') { document.getElementById('tabGather').classList.remove('hidden'); renderGatherings(); }
  else if (tab === 'chat') { document.getElementById('tabChat').classList.remove('hidden'); renderChatRooms(); }
  else if (tab === 'board') { document.getElementById('tabBoard').classList.remove('hidden'); renderPosts(); }
}
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', (e) => { e.preventDefault(); switchTab(l.dataset.tab); }));

function showSubPage(id) { document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); }

// ===== FRIENDS SYSTEM =====
let matched = new Set(); // 친구
let sentRequests = new Set(); // 내가 보낸 요청
let receivedRequests = new Set(); // 받은 요청 (시뮬)

// 시뮬: 랜덤으로 친구요청 받아놓기
(function simulateRequests() {
  const mySchool = '서강대';
  const schoolUsers = ALL_USERS.filter(u => u.school === mySchool);
  for (let i = 0; i < 5; i++) {
    receivedRequests.add(schoolUsers[Math.floor(Math.random() * schoolUsers.length)].nick);
  }
  // 미리 매칭된 친구 2명
  matched.add(schoolUsers[10].nick);
  matched.add(schoolUsers[20].nick);
})();

function renderMyFriends() {
  document.getElementById('requestBadge').textContent = receivedRequests.size;
  const el = document.getElementById('friendContent');
  const query = document.getElementById('friendSearchInput').value.trim().toLowerCase();

  // 검색 결과
  if (query) {
    const results = ALL_USERS.filter(u => u.nick.toLowerCase().includes(query) && u.nick !== (currentUser ? currentUser.nick : ''));
    if (results.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">검색 결과가 없습니다.</div></div>'; return; }
    el.innerHTML = '<div class="friend-list">' + results.slice(0, 20).map(u => renderFriendItem(u, 'search')).join('') + '</div>';
    return;
  }

  // 내 친구 목록
  const friendList = [...matched];
  if (friendList.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128075;</div><div class="empty-state-text">아직 친구가 없습니다.<br>친구 추가 버튼을 눌러보세요!</div></div>';
    return;
  }
  el.innerHTML = '<div class="friend-list">' + friendList.map(nick => {
    const u = getUserInfo(nick);
    return `<div class="friend-item" data-nick="${escapeHtml(nick)}">
      <div class="friend-info"><div class="friend-avatar">${nick[0]}</div><div><div class="friend-name">${escapeHtml(nick)}</div><div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div></div></div>
    </div>`;
  }).join('') + '</div>';
}

function renderFriendItem(u, mode) {
  const isMatched = matched.has(u.nick);
  const isSent = sentRequests.has(u.nick);
  let actions = '';
  if (mode === 'search' || mode === 'school') {
    if (isMatched) actions = '<span style="color:var(--primary);font-size:.8rem;font-weight:600">친구</span>';
    else if (isSent) actions = '<button class="btn btn-ghost btn-sm" disabled>요청됨</button>';
    else actions = `<button class="btn btn-primary btn-sm friend-ok" data-nick="${escapeHtml(u.nick)}">OK</button><button class="btn btn-ghost btn-sm friend-no" data-nick="${escapeHtml(u.nick)}">NO</button><button class="btn btn-outline btn-sm friend-req" data-nick="${escapeHtml(u.nick)}">+ 요청</button>`;
  }
  return `<div class="friend-item" data-nick="${escapeHtml(u.nick)}">
    <div class="friend-info"><div class="friend-avatar">${u.nick[0]}</div><div><div class="friend-name">${escapeHtml(u.nick)} <span style="font-size:.8rem;color:var(--text-secondary)">${u.age}</span></div><div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div>
    <div style="margin-top:3px">${u.keywords.slice(0, 3).map(k => `<span class="preview-keyword" style="font-size:.7rem;padding:2px 6px">${k}</span>`).join(' ')}</div></div></div>
    <div class="friend-actions">${actions}</div></div>`;
}

document.getElementById('friendSearchBtn').addEventListener('click', renderMyFriends);
document.getElementById('friendSearchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderMyFriends(); });

document.getElementById('addFriendBtn').addEventListener('click', () => showSubPage('tabFriendAdd'));
document.getElementById('friendAddBack').addEventListener('click', () => { showSubPage('tabFriends'); renderMyFriends(); });

document.getElementById('friendRequestsBtn').addEventListener('click', () => { showSubPage('tabFriendRequests'); renderFriendRequests(); });
document.getElementById('friendReqBack').addEventListener('click', () => { showSubPage('tabFriends'); renderMyFriends(); });

// School Friends
document.getElementById('goSchoolFriends').addEventListener('click', () => { showSubPage('tabSchoolFriends'); setupSchoolFriends(); });
document.getElementById('schoolFriendsBack').addEventListener('click', () => showSubPage('tabFriendAdd'));

function setupSchoolFriends() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : currentUser.univ || '서강대';
  document.getElementById('schoolFriendsTitle').textContent = mySchool + ' 친구';
  const majors = MAJORS_BY_SCHOOL[mySchool] || [];
  const majorSelect = document.getElementById('filterMajor');
  majorSelect.innerHTML = '<option value="">전체 전공</option>' + majors.map(m => `<option>${m}</option>`).join('');
  renderSchoolFriendList();
}

function renderSchoolFriendList() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : currentUser.univ || '서강대';
  const majorFilter = document.getElementById('filterMajor').value;
  const yearFilter = document.getElementById('filterYear').value;
  let users = ALL_USERS.filter(u => u.school === mySchool);
  if (majorFilter) users = users.filter(u => u.major === majorFilter);
  if (yearFilter) users = users.filter(u => u.year === yearFilter);
  const el = document.getElementById('schoolFriendList');
  if (users.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">조건에 맞는 친구가 없습니다.</div></div>'; return; }
  el.innerHTML = users.slice(0, 50).map(u => renderFriendItem(u, 'school')).join('');
}

document.getElementById('filterMajor').addEventListener('change', renderSchoolFriendList);
document.getElementById('filterYear').addEventListener('change', renderSchoolFriendList);

// Recommend (Tinder Swipe)
let swipeQueue = [];
let swipeIndex = 0;

document.getElementById('goRecommend').addEventListener('click', () => { showSubPage('tabRecommend'); setupSwipe(); });
document.getElementById('recommendBack').addEventListener('click', () => showSubPage('tabFriendAdd'));

function setupSwipe() {
  const myKw = currentUser && currentUser.profile ? currentUser.profile.keywords : [];
  let candidates = ALL_USERS.filter(u => !matched.has(u.nick) && !sentRequests.has(u.nick) && u.nick !== (currentUser ? currentUser.nick : ''));
  candidates.sort((a, b) => {
    const sa = a.keywords.filter(k => myKw.includes(k)).length;
    const sb = b.keywords.filter(k => myKw.includes(k)).length;
    return sb - sa;
  });
  swipeQueue = candidates.slice(0, 100);
  swipeIndex = 0;
  renderSwipeCard();
}

function renderSwipeCard() {
  const el = document.getElementById('swipeContainer');
  if (swipeIndex >= swipeQueue.length) {
    el.innerHTML = '<div class="swipe-empty"><div style="font-size:3rem;margin-bottom:12px">&#128149;</div>더 이상 추천 친구가 없습니다.<br>나중에 다시 확인해보세요!</div>';
    return;
  }
  const u = swipeQueue[swipeIndex];
  el.innerHTML = `
    <div class="swipe-card">
      <div class="swipe-card-photo">${u.nick[0]}</div>
      <div class="swipe-card-body">
        <div class="swipe-card-name">${escapeHtml(u.nick)} <span style="color:var(--text-secondary);font-size:.9rem">${u.age}</span></div>
        <div class="swipe-card-info">${u.school} · ${u.major} · ${u.year}</div>
        <div class="swipe-card-bio">${escapeHtml(u.bio)}</div>
        <div class="swipe-card-keywords">${u.keywords.map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>
      </div>
    </div>
    <div class="swipe-actions">
      <button class="swipe-btn no" id="swipeNo" title="NO">&#10007;</button>
      <button class="swipe-btn add" id="swipeAdd" title="친구 요청">+</button>
      <button class="swipe-btn yes" id="swipeOk" title="OK">&#9829;</button>
    </div>`;
  document.getElementById('swipeNo').addEventListener('click', () => { swipeIndex++; renderSwipeCard(); });
  document.getElementById('swipeOk').addEventListener('click', () => {
    const nick = swipeQueue[swipeIndex].nick;
    sentRequests.add(nick);
    // 시뮬: 30% 확률로 상대도 OK → 매칭
    if (Math.random() < 0.3) { matched.add(nick); sentRequests.delete(nick); alert(nick + '님도 OK! 친구가 되었어요!'); }
    swipeIndex++; renderSwipeCard();
  });
  document.getElementById('swipeAdd').addEventListener('click', () => {
    sentRequests.add(swipeQueue[swipeIndex].nick);
    alert('친구 요청을 보냈습니다!');
    swipeIndex++; renderSwipeCard();
  });
}

// Friend Requests
function renderFriendRequests() {
  const el = document.getElementById('friendReqList');
  const reqs = [...receivedRequests];
  if (reqs.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128232;</div><div class="empty-state-text">받은 요청이 없습니다.</div></div>'; return; }
  el.innerHTML = reqs.map(nick => {
    const u = getUserInfo(nick);
    return `<div class="friend-item" data-nick="${escapeHtml(nick)}">
      <div class="friend-info"><div class="friend-avatar">${nick[0]}</div><div><div class="friend-name">${escapeHtml(nick)}</div><div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div></div></div>
      <div class="friend-actions"><button class="btn-accept req-accept" data-nick="${escapeHtml(nick)}">승낙</button><button class="btn-reject req-reject" data-nick="${escapeHtml(nick)}">거절</button></div>
    </div>`;
  }).join('');
}

// Delegated click handlers for friend actions
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('friend-ok')) { sentRequests.add(e.target.dataset.nick); if (Math.random() < 0.3) { matched.add(e.target.dataset.nick); sentRequests.delete(e.target.dataset.nick); alert(e.target.dataset.nick + '님도 OK! 친구가 되었어요!'); } else { alert('OK 전송! 상대 응답을 기다려주세요.'); } renderSchoolFriendList(); renderMyFriends(); }
  if (e.target.classList.contains('friend-no')) { e.target.closest('.friend-item').style.opacity = '.3'; }
  if (e.target.classList.contains('friend-req')) { sentRequests.add(e.target.dataset.nick); alert('친구 요청을 보냈습니다!'); renderSchoolFriendList(); renderMyFriends(); }
  if (e.target.classList.contains('req-accept')) { const n = e.target.dataset.nick; receivedRequests.delete(n); matched.add(n); alert(n + '님과 친구가 되었습니다!'); renderFriendRequests(); }
  if (e.target.classList.contains('req-reject')) { receivedRequests.delete(e.target.dataset.nick); renderFriendRequests(); }
  // Friend item click → profile
  const fi = e.target.closest('.friend-item');
  if (fi && !e.target.closest('.friend-actions') && fi.dataset.nick) openUserProfile(fi.dataset.nick);
});

function openUserProfile(nick) {
  const u = getUserInfo(nick);
  document.getElementById('userProfileCard').innerHTML = `
    <div class="preview-photo"><span class="photo-placeholder">${nick[0]}</span></div>
    <h3 class="preview-name">${escapeHtml(u.nick)} <span style="font-size:.9rem;color:var(--text-secondary)">${u.age}</span></h3>
    <p class="preview-school">${u.school} / ${u.major} / ${u.year}</p>
    <p class="preview-bio">${escapeHtml(u.bio)}</p>
    <div class="preview-keywords">${u.keywords.map(k => `<span class="preview-keyword">${k}</span>`).join('')}</div>`;
  const isF = matched.has(nick), isSent = sentRequests.has(nick);
  document.getElementById('userProfileActions').innerHTML = isF
    ? '<button class="btn btn-ghost" onclick="document.getElementById(\'userProfileModal\').classList.remove(\'active\')">닫기</button>'
    : isSent ? '<button class="btn btn-ghost" disabled>요청됨</button>'
    : `<button class="btn btn-primary friend-ok" data-nick="${escapeHtml(nick)}">OK</button><button class="btn btn-ghost friend-no" data-nick="${escapeHtml(nick)}">NO</button><button class="btn btn-outline friend-req" data-nick="${escapeHtml(nick)}">+ 요청</button>`;
  document.getElementById('userProfileModal').classList.add('active');
}
document.getElementById('userProfileClose').addEventListener('click', () => document.getElementById('userProfileModal').classList.remove('active'));

// ===== GATHERING SYSTEM =====
const GATHER_CATS = { study:'스터디', hobby:'취미', food:'맛집탐방', exercise:'운동', travel:'여행', project:'프로젝트', etc:'기타' };
const GATHER_EMOJIS = { study:'📚', hobby:'🎨', food:'🍽️', exercise:'💪', travel:'✈️', project:'💻', etc:'✨' };

let gatherings = [
  { id:1, title:'알고리즘 스터디', category:'study', purpose:'코딩 실력 향상', desc:'매주 토요일 백준 문제 풀기. 초보 환영.', condition:'프로그래밍 기초 가능자', question:'주로 사용하는 언어가 무엇인가요?', maxMembers:10, deadline:'2026-04-01', host:ALL_USERS[10].nick, members:[ALL_USERS[10].nick, ALL_USERS[11].nick], applicants:[], chatMessages:[{author:ALL_USERS[10].nick, text:'이번주 문제 올렸어요!', date:new Date(Date.now()-3600000)}], isClosed:false, createdAt:new Date(Date.now()-86400000*3) },
  { id:2, title:'맛집 탐방 모임', category:'food', purpose:'학교 근처 맛집 개척', desc:'매주 금요일 저녁 맛집 탐방.', condition:'먹는 거 좋아하는 사람', question:'좋아하는 음식 장르는?', maxMembers:8, deadline:'2026-03-30', host:ALL_USERS[30].nick, members:[ALL_USERS[30].nick], applicants:[], chatMessages:[], isClosed:false, createdAt:new Date(Date.now()-86400000) },
  { id:3, title:'주말 등산 번개', category:'exercise', purpose:'건강한 주말', desc:'이번 주말 북한산 등산!', condition:'체력 상관없이 누구나', question:'등산 경험이 있으신가요?', maxMembers:5, deadline:'2026-03-15', host:ALL_USERS[50].nick, members:[ALL_USERS[50].nick, ALL_USERS[51].nick], applicants:[], chatMessages:[], isClosed:false, createdAt:new Date(Date.now()-86400000*0.5) },
];

function generatePromo(g) {
  const e = GATHER_EMOJIS[g.category] || '✨';
  return `${e} [${GATHER_CATS[g.category]}] ${g.title}\n\n📌 목적: ${g.purpose}\n\n${g.desc}\n\n✅ 가입 조건: ${g.condition}\n👥 모집 인원: ${g.maxMembers}명\n📅 모집 마감: ${g.deadline || '미정'}\n\n관심 있으신 분은 가입 신청해주세요!\n※ 승인제로 운영됩니다.`;
}

function renderGatherings() {
  const el = document.getElementById('gatherList');
  const q = (document.getElementById('gatherSearch').value || '').trim().toLowerCase();
  let list = gatherings;
  if (q) list = list.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
  if (list.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><div class="empty-state-text">모임이 없습니다.</div></div>'; return; }
  el.innerHTML = list.map(g => `
    <div class="gather-card" data-gid="${g.id}">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="gather-card-cat">${GATHER_CATS[g.category]}</span><span class="gather-card-status ${g.isClosed ? 'closed' : 'open'}">${g.isClosed ? '마감' : '모집중'}</span></div>
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
  const isHost = currentUser && currentUser.nick === g.host;
  const isMember = currentUser && g.members.includes(currentUser.nick);
  const hasApplied = currentUser && g.applicants.some(a => a.nick === currentUser.nick);

  let html = `<div class="gather-detail-section"><div class="gather-promo">${escapeHtml(generatePromo(g))}</div></div>`;

  // 멤버 (가입자만 볼 수 있음)
  if (isMember) {
    html += `<div class="gather-detail-section"><h3>멤버 (${g.members.length}/${g.maxMembers})</h3>` +
      g.members.map(m => `<span class="preview-keyword" style="margin:2px">${escapeHtml(m)}</span>`).join('') + '</div>';
  }

  // 호스트: 신청자 관리
  if (isHost && g.applicants.length > 0) {
    html += `<div class="gather-detail-section"><h3>가입 신청 (${g.applicants.length}명)</h3>` +
      g.applicants.map(a => {
        const u = getUserInfo(a.nick);
        return `<div class="applicant-item">
          <div class="applicant-info"><strong>${escapeHtml(a.nick)}</strong> (${u.school} · ${u.major} · ${u.year})
          <div style="font-size:.75rem;color:var(--text-secondary)">${u.keywords.slice(0,4).join(', ')}</div>
          <div class="applicant-answer">답변: "${escapeHtml(a.answer)}"</div></div>
          <div class="friend-actions"><button class="btn-accept gather-accept" data-gid="${g.id}" data-nick="${escapeHtml(a.nick)}">승낙</button><button class="btn-reject gather-reject" data-gid="${g.id}" data-nick="${escapeHtml(a.nick)}">거절</button></div>
        </div>`;
      }).join('') + '</div>';
  }

  // 액션
  html += '<div style="display:flex;gap:8px;margin-top:16px">';
  if (isMember && !g.isClosed) {
    html += `<button class="btn btn-primary" id="enterGatherChat" data-gid="${g.id}">채팅방 입장</button>`;
    if (isHost) html += `<button class="btn btn-danger" id="closeGather" data-gid="${g.id}">모집 마감</button>`;
  } else if (g.isClosed && isMember) {
    html += `<button class="btn btn-primary" id="enterGatherChat" data-gid="${g.id}">채팅방 입장</button>`;
  } else if (hasApplied) {
    html += '<button class="btn btn-ghost" disabled>신청 대기 중</button>';
  } else if (g.isClosed) {
    html += '<button class="btn btn-ghost" disabled>모집 마감</button>';
  } else {
    html += `<button class="btn btn-primary" id="applyGather" data-gid="${g.id}">가입 신청</button>`;
  }
  html += '</div>';

  document.getElementById('gatherDetailContent').innerHTML = html;

  // Events
  const enterBtn = document.getElementById('enterGatherChat');
  if (enterBtn) enterBtn.addEventListener('click', () => { switchTab('chat'); openChatRoom(g.id); });
  const applyBtn = document.getElementById('applyGather');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    document.getElementById('gatherApplyQuestion').textContent = g.question || '지원 동기를 알려주세요.';
    document.getElementById('gatherApplyAnswer').value = '';
    document.getElementById('gatherApplyModal').classList.add('active');
    document.getElementById('gatherApplyModal').dataset.gid = g.id;
  });
  const closeBtn = document.getElementById('closeGather');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    if (confirm('모집을 마감하시겠습니까? 승낙된 인원으로 채팅방이 개설됩니다.')) {
      g.isClosed = true;
      alert('모집이 마감되었습니다! 채팅방이 개설되었어요.');
      openGatherDetail(g.id);
    }
  });
}

document.getElementById('gatherDetailBack').addEventListener('click', () => { showSubPage('tabGather'); renderGatherings(); });

// Gather accept/reject
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('gather-accept')) {
    const g = gatherings.find(x => x.id === Number(e.target.dataset.gid));
    if (g) { const nick = e.target.dataset.nick; g.applicants = g.applicants.filter(a => a.nick !== nick); g.members.push(nick); openGatherDetail(g.id); }
  }
  if (e.target.classList.contains('gather-reject')) {
    const g = gatherings.find(x => x.id === Number(e.target.dataset.gid));
    if (g) { g.applicants = g.applicants.filter(a => a.nick !== e.target.dataset.nick); openGatherDetail(g.id); }
  }
});

// Apply modal
document.getElementById('gatherApplyClose').addEventListener('click', () => document.getElementById('gatherApplyModal').classList.remove('active'));
document.getElementById('gatherApplyCancelBtn').addEventListener('click', () => document.getElementById('gatherApplyModal').classList.remove('active'));
document.getElementById('gatherApplySubmitBtn').addEventListener('click', () => {
  const gid = Number(document.getElementById('gatherApplyModal').dataset.gid);
  const answer = document.getElementById('gatherApplyAnswer').value.trim();
  if (!answer) { alert('답변을 입력해주세요.'); return; }
  const g = gatherings.find(x => x.id === gid);
  if (g && currentUser) { g.applicants.push({ nick: currentUser.nick, answer, date: new Date() }); }
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
    maxMembers, deadline, host: currentUser.nick, members: [currentUser.nick], applicants: [], chatMessages: [], isClosed: false, createdAt: new Date(),
  });
  ['gatherTitle','gatherPurpose','gatherDesc','gatherCondition','gatherQuestion','gatherTags'].forEach(id => document.getElementById(id).value = '');
  alert('모임이 개설되었습니다! AI가 홍보글을 생성했어요.');
  showSubPage('tabGather'); renderGatherings();
});

// ===== CHAT =====
let currentChatGid = null;
function renderChatRooms() {
  const el = document.getElementById('chatRoomList');
  document.getElementById('chatListView').classList.remove('hidden');
  document.getElementById('chatRoomView').classList.add('hidden');
  const myRooms = gatherings.filter(g => currentUser && g.members.includes(currentUser.nick));
  if (myRooms.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128172;</div><div class="empty-state-text">참여 중인 채팅방이 없습니다.</div></div>'; return; }
  el.innerHTML = myRooms.map(g => {
    const last = g.chatMessages.length > 0 ? g.chatMessages[g.chatMessages.length - 1] : null;
    return `<div class="chat-room-item" data-gid="${g.id}"><div class="chat-room-info"><div class="chat-room-icon">${g.title[0]}</div><div><div class="chat-room-name">${escapeHtml(g.title)}</div><div class="chat-room-last">${last ? escapeHtml(last.text).substring(0, 30) : '메시지 없음'}</div></div></div>
    <div class="chat-room-meta"><div class="chat-room-time">${last ? formatDate(last.date) : ''}</div><div style="font-size:.75rem;color:var(--text-secondary)">${g.members.length}명</div></div></div>`;
  }).join('');
}
document.getElementById('chatRoomList').addEventListener('click', (e) => { const i = e.target.closest('.chat-room-item'); if (i) openChatRoom(Number(i.dataset.gid)); });

function openChatRoom(gid) {
  const g = gatherings.find(x => x.id === gid); if (!g) return;
  currentChatGid = gid;
  document.getElementById('chatListView').classList.add('hidden');
  document.getElementById('chatRoomView').classList.remove('hidden');
  document.getElementById('chatRoomName').textContent = g.title;
  document.getElementById('chatMemberCount').textContent = g.members.length + '명';
  renderChatMsgs(g);
}

function renderChatMsgs(g) {
  const el = document.getElementById('chatMessages');
  if (g.chatMessages.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-text">첫 메시지를 보내보세요!</div></div>'; return; }
  el.innerHTML = g.chatMessages.map(m => {
    const mine = currentUser && m.author === currentUser.nick;
    return `<div class="chat-msg ${mine ? 'mine' : 'other'}">${!mine ? `<div class="chat-msg-author">${escapeHtml(m.author)}</div>` : ''}<div class="chat-msg-bubble">${escapeHtml(m.text)}</div><div class="chat-msg-time">${formatDate(m.date)}</div></div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim(); if (!text || !currentChatGid) return;
  const g = gatherings.find(x => x.id === currentChatGid); if (!g) return;
  g.chatMessages.push({ author: currentUser.nick, text, date: new Date() });
  input.value = ''; renderChatMsgs(g);
  setTimeout(() => {
    const others = g.members.filter(m => m !== currentUser.nick);
    if (others.length > 0) {
      g.chatMessages.push({ author: others[Math.floor(Math.random() * others.length)], text: ['ㅋㅋ 좋아요!','넵!','저도요~','오 그거 좋네요','언제 만나요?'][Math.floor(Math.random() * 5)], date: new Date() });
      if (currentChatGid === g.id) renderChatMsgs(g);
    }
  }, 1500 + Math.random() * 2000);
}
document.getElementById('chatSendBtn').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
document.getElementById('chatBackBtn').addEventListener('click', () => { currentChatGid = null; renderChatRooms(); });

// ===== BOARD =====
const CAT_LABELS = { free:'자유게시판', question:'질문답변', info:'정보공유', review:'대학생활' };
let posts = Array.from({ length: 12 }, (_, i) => {
  const cats = ['free','question','info','review'];
  const titles = ['오늘 학식 맛있었다','전공 복수전공 고민','교내 무료 소프트웨어','동아리 MT 후기','자취 생존기','대외활동 추천','장학금 꿀팁','중간고사 벼락치기','교환학생 후기','노트북 추천','카페 TOP5','대학 와서 좋은 점'];
  const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 14));
  const author = ALL_USERS[Math.floor(Math.random() * ALL_USERS.length)];
  return { id: i + 1, category: cats[i % 4], title: titles[i], content: titles[i] + ' 관련 내용입니다.', author: author.nick, date: d, views: Math.floor(Math.random() * 500), likes: Math.floor(Math.random() * 50), comments: [] };
});
let currentSort = 'latest', currentPage = 1, currentPostId = null;
const writeModal = document.getElementById('writeModal'), detailModal = document.getElementById('detailModal');

function renderPosts() {
  let filtered = [...posts];
  if (currentSort === 'latest') filtered.sort((a, b) => b.date - a.date);
  else if (currentSort === 'popular') filtered.sort((a, b) => b.likes - a.likes);
  const start = (currentPage - 1) * 8, page = filtered.slice(start, start + 8);
  const el = document.getElementById('postList');
  el.innerHTML = page.map(p => `<div class="post-item" data-id="${p.id}"><div class="post-item-header"><span class="post-category">${CAT_LABELS[p.category]}</span><span class="post-title">${escapeHtml(p.title)}</span>${p.comments.length > 0 ? `<span class="post-comment-count">[${p.comments.length}]</span>` : ''}</div><div class="post-meta"><span>${p.author}</span><span>${formatDate(p.date)}</span><span>조회 ${p.views}</span></div></div>`).join('');
  document.getElementById('pagination').innerHTML = Array.from({ length: Math.ceil(filtered.length / 8) }, (_, i) => `<button class="page-btn ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('');
}

document.getElementById('writeBtn').addEventListener('click', () => writeModal.classList.add('active'));
document.getElementById('modalClose').addEventListener('click', () => writeModal.classList.remove('active'));
document.getElementById('cancelBtn').addEventListener('click', () => writeModal.classList.remove('active'));
document.getElementById('submitBtn').addEventListener('click', () => {
  const t = document.getElementById('postTitle').value.trim(), c = document.getElementById('postContent').value.trim();
  if (!t || !c) { alert('제목과 내용을 입력해주세요.'); return; }
  posts.unshift({ id: posts.length + 1, category: document.getElementById('postCategory').value, title: t, content: c, author: currentUser.nick, date: new Date(), views: 0, likes: 0, comments: [] });
  document.getElementById('postTitle').value = ''; document.getElementById('postContent').value = '';
  writeModal.classList.remove('active'); renderPosts();
});
document.getElementById('postList').addEventListener('click', (e) => { const i = e.target.closest('.post-item'); if (i) { const p = posts.find(x => x.id === Number(i.dataset.id)); if (!p) return; currentPostId = p.id; p.views++;
  document.getElementById('detailTitle').textContent = p.title; document.getElementById('detailMeta').innerHTML = `<span>${CAT_LABELS[p.category]}</span><span>${p.author}</span><span>${formatDate(p.date)}</span>`;
  document.getElementById('detailContent').textContent = p.content; document.getElementById('likeCount').textContent = p.likes; document.getElementById('likeBtn').classList.remove('liked');
  document.getElementById('commentList').innerHTML = p.comments.length === 0 ? '<div style="color:#94a3b8;font-size:.85rem">아직 댓글이 없습니다.</div>' : p.comments.map(c => `<div class="comment-item"><div class="comment-author">${escapeHtml(c.author)}</div><div class="comment-text">${escapeHtml(c.text)}</div></div>`).join('');
  detailModal.classList.add('active'); } });
document.getElementById('pagination').addEventListener('click', (e) => { if (e.target.classList.contains('page-btn')) { currentPage = Number(e.target.dataset.page); renderPosts(); } });
document.querySelectorAll('.sort-btn[data-sort]').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('.sort-btn[data-sort]').forEach(x => x.classList.remove('active')); b.classList.add('active'); currentSort = b.dataset.sort; renderPosts(); }));
document.getElementById('detailClose').addEventListener('click', () => detailModal.classList.remove('active'));
document.getElementById('likeBtn').addEventListener('click', () => { const p = posts.find(x => x.id === currentPostId); if (!p) return; const b = document.getElementById('likeBtn'); if (b.classList.contains('liked')) { p.likes--; b.classList.remove('liked'); } else { p.likes++; b.classList.add('liked'); } document.getElementById('likeCount').textContent = p.likes; });
document.getElementById('commentBtn').addEventListener('click', () => { const t = document.getElementById('commentInput').value.trim(); if (!t) return; const p = posts.find(x => x.id === currentPostId); if (p) { p.comments.push({ author: currentUser.nick, text: t }); document.getElementById('commentInput').value = ''; document.getElementById('commentList').innerHTML = p.comments.map(c => `<div class="comment-item"><div class="comment-author">${escapeHtml(c.author)}</div><div class="comment-text">${escapeHtml(c.text)}</div></div>`).join(''); } });

// Close modals
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('active'); }));
