// ===== 모임 시스템 =====

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
        return `<div class="applicant-item"><div class="applicant-info"><strong>${escapeHtml(u.name)}</strong> (${u.school} · ${u.major} · ${u.year})<div style="font-size:.75rem;color:var(--text-secondary)">${u.keywords.slice(0,4).join(', ')}</div><div class="applicant-answer">답변: "${escapeHtml(a.answer)}"</div></div><div class="friend-actions"><button class="btn-accept gather-accept" data-gid="${g.id}" data-uid="${a.uid}">승낙</button><button class="btn-reject gather-reject" data-gid="${g.id}" data-uid="${a.uid}">거절</button></div></div>`;
      }).join('') + '</div>';
  }
  html += '<div style="display:flex;gap:8px;margin-top:16px">';
  if (isMember) {
    html += `<button class="btn btn-primary" id="enterGatherChat" data-gid="${g.id}">채팅방 입장</button>`;
    if (isHost && !g.isClosed) html += `<button class="btn btn-danger" id="closeGather" data-gid="${g.id}">모집 마감</button>`;
  } else if (hasApplied) { html += '<button class="btn btn-ghost" disabled>신청 대기 중</button>'; }
  else if (g.isClosed) { html += '<button class="btn btn-ghost" disabled>모집 마감</button>'; }
  else { html += `<button class="btn btn-primary" id="applyGather" data-gid="${g.id}">가입 신청</button>`; }
  html += '</div>';
  document.getElementById('gatherDetailContent').innerHTML = html;

  const enterBtn = document.getElementById('enterGatherChat');
  if (enterBtn) enterBtn.addEventListener('click', () => openGroupChat(g.id));
  const applyBtn = document.getElementById('applyGather');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    document.getElementById('gatherApplyQuestion').textContent = g.question || '지원 동기를 알려주세요.';
    document.getElementById('gatherApplyAnswer').value = '';
    document.getElementById('gatherApplyModal').classList.add('active');
    document.getElementById('gatherApplyModal').dataset.gid = g.id;
  });
  const closeBtn = document.getElementById('closeGather');
  if (closeBtn) closeBtn.addEventListener('click', () => { if (confirm('모집을 마감하시겠습니까?')) { g.isClosed = true; alert('모집이 마감되었습니다!'); openGatherDetail(g.id); } });
}

document.getElementById('gatherDetailBack').addEventListener('click', () => { showSubPage('tabGather'); renderGatherings(); });

// 가입 신청 모달
document.getElementById('gatherApplyClose').addEventListener('click', () => document.getElementById('gatherApplyModal').classList.remove('active'));
document.getElementById('gatherApplyCancelBtn').addEventListener('click', () => document.getElementById('gatherApplyModal').classList.remove('active'));
document.getElementById('gatherApplySubmitBtn').addEventListener('click', () => {
  const gid = Number(document.getElementById('gatherApplyModal').dataset.gid);
  const answer = document.getElementById('gatherApplyAnswer').value.trim();
  if (!answer) { alert('답변을 입력해주세요.'); return; }
  const g = gatherings.find(x => x.id === gid);
  if (g && currentUser) g.applicants.push({ uid: currentUser.id, answer, date: new Date() });
  document.getElementById('gatherApplyModal').classList.remove('active');
  alert('가입 신청이 전송되었습니다!');
  openGatherDetail(gid);
});

// 모임 만들기
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
  gatherings.unshift({ id: Date.now(), title, category, purpose, desc, condition: condition || '없음', question: question || '지원 동기를 알려주세요.', maxMembers, deadline, hostId: currentUser.id, members: [currentUser.id], applicants: [], chatMessages: [], isClosed: false, createdAt: new Date() });
  ['gatherTitle','gatherPurpose','gatherDesc','gatherCondition','gatherQuestion'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  alert('모임이 개설되었습니다! AI가 홍보글을 생성했어요.');
  showSubPage('tabGather'); renderGatherings();
});
