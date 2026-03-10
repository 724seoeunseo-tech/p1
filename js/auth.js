// ===== 로그인 / 회원가입 =====
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

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('authPage').classList.remove('hidden');
  document.getElementById('authPage').style.opacity = '1';
});

function enterApp() {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  document.getElementById('myProfileView').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('userName').textContent = currentUser.profile ? currentUser.profile.name : (currentUser.name || '');
  switchTab('friends');
}

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
