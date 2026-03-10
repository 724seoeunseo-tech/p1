// ===== 친구 시스템 (목록, 추천, 학교친구, 요청) =====

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
  el.innerHTML = friendIds.map(id => { const u = getUserById(id); return u ? renderFriendListItem(u, true) : ''; }).join('');
}

function renderFriendListItem(u, isFriend) {
  const dmBtn = isFriend ? `<button class="friend-dm-btn" data-uid="${u.id}" title="메시지 보내기">&#128172;</button>` : '';
  return `<div class="friend-item" data-uid="${u.id}">
    <div class="friend-info"><div class="friend-avatar">${u.name[0]}</div><div><div class="friend-name">${escapeHtml(u.name)} <span style="font-size:.8rem;color:var(--text-secondary)">${u.age}, ${u.gender}</span></div><div class="friend-detail">${u.school} · ${u.major} · ${u.year}</div></div></div>
    <div class="friend-actions">${dmBtn}</div></div>`;
}

document.getElementById('friendSearchBtn').addEventListener('click', renderFriendList);
document.getElementById('friendSearchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderFriendList(); });

// 친구 요청
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

// 학교 친구
document.getElementById('goSchoolFriends').addEventListener('click', () => { showSubPage('tabSchoolFriends'); setupSchoolFriends(); });
document.getElementById('schoolFriendsBack').addEventListener('click', () => { showSubPage('tabFriends'); renderFriendsPage(); });

function setupSchoolFriends() {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : currentUser.univ || '서강대';
  document.getElementById('schoolFriendsTitle').textContent = mySchool + ' 친구';
  document.getElementById('filterMajor').innerHTML = '<option value="">전체 전공</option>' + (MAJORS_BY_SCHOOL[mySchool] || []).map(m => `<option>${m}</option>`).join('');
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

document.getElementById('selectAllSchool').addEventListener('click', () => {
  const mySchool = currentUser && currentUser.profile ? currentUser.profile.school : '서강대';
  const majorF = document.getElementById('filterMajor').value;
  const yearF = document.getElementById('filterYear').value;
  let users = ALL_USERS.filter(u => u.school === mySchool && !matched.has(u.id) && !sentOK.has(u.id));
  if (majorF) users = users.filter(u => u.major === majorF);
  if (yearF) users = users.filter(u => u.year === yearF);
  users.forEach(u => { sentOK.add(u.id); if (Math.random() < 0.25) { matched.add(u.id); sentOK.delete(u.id); } });
  const matchCount = users.filter(u => matched.has(u.id)).length;
  alert(`${users.length}명에게 OK를 보냈습니다! ${matchCount}명과 친구가 되었어요!`);
  renderSchoolFriendList();
});

// 추천 친구 (틴더 스와이프)
function setupSwipe() {
  const myKw = currentUser && currentUser.profile ? currentUser.profile.keywords : [];
  let candidates = ALL_USERS.filter(u => !matched.has(u.id) && !sentOK.has(u.id) && u.id !== (currentUser ? currentUser.id : -1));
  if (recSettings.school) candidates = candidates.filter(u => u.school === recSettings.school);
  if (recSettings.major) candidates = candidates.filter(u => u.major.includes(recSettings.major));
  if (recSettings.location) candidates = candidates.filter(u => u.location && u.location.includes(recSettings.location));
  if (recSettings.gender) candidates = candidates.filter(u => u.gender === recSettings.gender);
  if (recSettings.ageMin) candidates = candidates.filter(u => Number(u.age) >= Number(recSettings.ageMin));
  if (recSettings.ageMax) candidates = candidates.filter(u => Number(u.age) <= Number(recSettings.ageMax));
  if (recSettings.heightMin) candidates = candidates.filter(u => parseInt(u.height) >= Number(recSettings.heightMin));
  if (recSettings.heightMax) candidates = candidates.filter(u => parseInt(u.height) <= Number(recSettings.heightMax));
  candidates.sort((a, b) => b.keywords.filter(k => myKw.includes(k)).length - a.keywords.filter(k => myKw.includes(k)).length);
  swipeQueue = candidates.slice(0, 100);
  swipeIndex = 0;
}

function renderSwipeCard() {
  setupSwipe();
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

// 추천 설정
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
  recSettings = { location:'', school:'', major:'', ageMin:'', ageMax:'', gender:'', heightMin:'', heightMax:'' };
  ['recLocation','recSchool','recMajor','recAgeMin','recAgeMax','recGender','recHeightMin','recHeightMax'].forEach(id => document.getElementById(id).value = '');
});
document.getElementById('recSettingsApply').addEventListener('click', () => {
  recSettings = { location: document.getElementById('recLocation').value.trim(), school: document.getElementById('recSchool').value, major: document.getElementById('recMajor').value.trim(), ageMin: document.getElementById('recAgeMin').value, ageMax: document.getElementById('recAgeMax').value, gender: document.getElementById('recGender').value, heightMin: document.getElementById('recHeightMin').value, heightMax: document.getElementById('recHeightMax').value };
  alert('추천 설정이 적용되었습니다!');
  showSubPage('tabFriends'); renderFriendsPage();
});

// 유저 프로필 모달
function openUserProfile(uid) {
  const u = getUserById(uid);
  if (!u) return;
  renderPhotoSlider(document.getElementById('userProfilePhotos'), u.photos || [], 0);
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
    </div>${instaHtml}`;
  const isF = matched.has(uid), isSent = sentOK.has(uid);
  let actHtml = '';
  if (isF) actHtml = `<button class="btn btn-ghost" onclick="document.getElementById('userProfileModal').classList.remove('active')">닫기</button><button class="friend-dm-btn" data-uid="${uid}" style="width:auto;height:auto;padding:8px 16px;border-radius:10px">메시지</button>`;
  else if (isSent) actHtml = '<button class="btn btn-ghost" disabled>OK 전송됨</button>';
  else actHtml = `<button class="btn btn-primary school-ok" data-uid="${uid}">OK</button><button class="btn btn-ghost" onclick="document.getElementById('userProfileModal').classList.remove('active')">NO</button>`;
  document.getElementById('userProfileActions').innerHTML = actHtml;
  document.getElementById('userProfileModal').classList.add('active');
}
document.getElementById('userProfileClose').addEventListener('click', () => document.getElementById('userProfileModal').classList.remove('active'));

// 전역 클릭 이벤트 위임
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('school-ok')) { const uid = Number(e.target.dataset.uid); sentOK.add(uid); if (Math.random() < 0.25) { matched.add(uid); sentOK.delete(uid); const u = getUserById(uid); alert((u ? u.name : '') + '님도 OK! 친구가 되었어요!'); } renderSchoolFriendList(); }
  if (e.target.classList.contains('req-accept')) { const uid = Number(e.target.dataset.uid); receivedRequests.delete(uid); matched.add(uid); const u = getUserById(uid); alert((u ? u.name : '') + '님과 친구가 되었습니다!'); renderFriendRequests(); }
  if (e.target.classList.contains('req-reject')) { receivedRequests.delete(Number(e.target.dataset.uid)); renderFriendRequests(); }
  if (e.target.classList.contains('friend-dm-btn')) { e.stopPropagation(); openDmChat(Number(e.target.dataset.uid)); return; }
  const fi = e.target.closest('.friend-item');
  if (fi && !e.target.closest('.friend-actions') && fi.dataset.uid) openUserProfile(Number(fi.dataset.uid));
  if (e.target.classList.contains('gather-accept')) { const g = gatherings.find(x => x.id === Number(e.target.dataset.gid)); if (g) { const uid = Number(e.target.dataset.uid); g.applicants = g.applicants.filter(a => a.uid !== uid); g.members.push(uid); openGatherDetail(g.id); } }
  if (e.target.classList.contains('gather-reject')) { const g = gatherings.find(x => x.id === Number(e.target.dataset.gid)); if (g) { g.applicants = g.applicants.filter(a => a.uid !== Number(e.target.dataset.uid)); openGatherDetail(g.id); } }
});
